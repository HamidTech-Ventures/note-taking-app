import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Response
from fastapi.responses import StreamingResponse
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.note import Note
from app.models.batch import Batch
from app.notes import schemas
from app.services import ai_service

router = APIRouter()

@router.post("/process", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
async def process_note(
    file: UploadFile = File(...),
    batch_id: Optional[uuid.UUID] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a note and link it to a batch (new or existing).
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type."
        )
    
    try:
        image_bytes = await file.read()
        note = await ai_service.process_and_save_note(db, current_user.id, image_bytes, batch_id)
        return note
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}"
        )

@router.get("/batches", response_model=List[schemas.BatchResponse])
async def get_batches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all projects (batches) for the user."""
    result = await db.execute(
        select(Batch)
        .where(Batch.user_id == current_user.id)
        .options(selectinload(Batch.notes))
        .order_by(Batch.created_at.desc())
    )
    return result.scalars().all()

@router.get("/batches/{batch_id}", response_model=schemas.BatchResponse)
async def get_batch_detail(
    batch_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed project synthesis and note gallery."""
    result = await db.execute(
        select(Batch)
        .where(Batch.id == batch_id, Batch.user_id == current_user.id)
        .options(selectinload(Batch.notes))
    )
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Project not found")
    return batch

@router.get("/batches/{batch_id}/download")
async def download_batch_pdf(
    batch_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Proxy download to bypass CORS and force attachment headers.
    """
    result = await db.execute(
        select(Batch).where(Batch.id == batch_id, Batch.user_id == current_user.id)
    )
    batch = result.scalar_one_or_none()
    
    if not batch or not batch.pdf_url:
        raise HTTPException(status_code=404, detail="PDF archive not found or not yet generated.")

    async def iter_pdf():
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", batch.pdf_url) as r:
                if r.status_code != 200:
                    return
                async for chunk in r.aiter_bytes():
                    yield chunk

    filename = f"{batch.name or 'note_archive'}.pdf"
    return StreamingResponse(
        iter_pdf(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.get("/", response_model=List[schemas.NoteResponse])
async def get_notes_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve history of all notes."""
    result = await db.execute(
        select(Note).where(Note.user_id == current_user.id).order_by(Note.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{note_id}", response_model=schemas.NoteResponse)
async def get_note_detail(
    note_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.patch("/{note_id}", response_model=schemas.NoteResponse)
async def update_note(
    note_id: uuid.UUID,
    note_update: schemas.NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if note_update.title is not None:
        note.title = note_update.title
    
    await db.commit()
    await db.refresh(note)
    return note
