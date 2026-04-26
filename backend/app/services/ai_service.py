from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.services.preprocessor import enhance_handwritten_image
from app.services.ocr_engine import extract_text_from_image
from app.services.llm_engine import refine_handwritten_text
from app.services.cloudinary_service import upload_image_to_cloudinary
from app.services.batch_service import sync_batch_document
from app.models.note import Note
from app.models.batch import Batch
import uuid
from typing import Optional

async def process_and_save_note(
    db: AsyncSession, 
    user_id: uuid.UUID, 
    image_bytes: bytes,
    batch_id: Optional[uuid.UUID] = None
) -> Note:
    """
    Unified pipeline with Batch Support:
    1. Preprocess & OCR
    2. LLM Refinement (with highlights)
    3. Cloudinary Upload
    4. Batch Handling (Link or Create)
    5. Save & Sync Batch Document
    """
    # 1. OCR Extraction
    enhanced_img = enhance_handwritten_image(image_bytes)
    raw_text = extract_text_from_image(enhanced_img)
    
    # 2. LLM Refinement
    refined_text = refine_handwritten_text(raw_text)
    
    # 3. Cloudinary Upload
    image_url = upload_image_to_cloudinary(image_bytes)
    
    # 4. Batch Handling
    if batch_id:
        result = await db.execute(select(Batch).where(Batch.id == batch_id, Batch.user_id == user_id))
        batch = result.scalar_one_or_none()
        if not batch:
            # Fallback to new batch if provided ID is invalid
            batch = Batch(user_id=user_id)
            db.add(batch)
    else:
        batch = Batch(user_id=user_id)
        db.add(batch)
    
    await db.flush() # Get batch.id if new

    # 5. Save Note
    db_note = Note(
        user_id=user_id,
        batch_id=batch.id,
        image_url=image_url,
        raw_text=raw_text,
        refined_text=refined_text
    )
    
    db.add(db_note)
    await db.flush()
    
    # 6. Sync Project Document (Combined Text & PDF)
    await sync_batch_document(db, batch)
    
    await db.commit()
    await db.refresh(db_note)
    
    return db_note
