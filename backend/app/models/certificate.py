from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database.database import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    certificate_id = Column(String(32), unique=True, index=True, nullable=False)
    recipient_name = Column(String(255), nullable=False)
    certificate_type = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    organization_name = Column(String(255), nullable=False, default="CertiVault")
    issue_date = Column(String(64), nullable=False)
    signatory_name = Column(String(255), nullable=False, default="Alex Morgan")
    signatory_title = Column(String(255), nullable=False, default="Authorized Signatory")
    status = Column(String(32), nullable=False, default="VALID")  # VALID, REVOKED
    pdf_filename = Column(String(255), nullable=True)
    verification_url = Column(String(512), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now(), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Certificate {self.certificate_id} - {self.recipient_name} ({self.status})>"
