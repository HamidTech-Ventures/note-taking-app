import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, UUID, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Note(Base):
    __tablename__ = "notes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    batch_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("batches.id"), nullable=True)
    
    # Content
    image_url: Mapped[str] = mapped_column(String(512), nullable=False) # Cloudinary URL
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True, default="Batch Entry")
    raw_text: Mapped[str] = mapped_column(Text, nullable=True)
    refined_text: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notes")
    batch: Mapped[Optional["Batch"]] = relationship("Batch", back_populates="notes")

    def __repr__(self) -> str:
        return f"<Note {self.id}>"
