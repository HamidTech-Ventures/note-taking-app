import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime, UUID, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Batch(Base):
    __tablename__ = "batches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Metadata
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="Untitled Project")
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Combined Content
    combined_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    
    # Status
    # status could be "processing", "completed", "archived"
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="completed")
    
    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="batches")
    notes: Mapped[List["Note"]] = relationship("Note", back_populates="batch", cascade="all, delete-orphan", order_by="Note.created_at")

    def __repr__(self) -> str:
        return f"<Batch {self.name} ({self.id})>"
