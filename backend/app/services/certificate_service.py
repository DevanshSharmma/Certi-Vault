import os
import random
import string
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.certificate import Certificate
from app.schemas.certificate import CertificateCreate
from app.services.pdf_service import generate_certificate_pdf
from app.services.qr_service import get_verification_url

# Alphanumeric characters for certificate ID (clean, readable uppercase)
ID_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

def generate_unique_certificate_id(db: Session) -> str:
    """
    Generates a collision-safe unique certificate ID in format CERT-YYYY-XXXXXX.
    Example: CERT-2026-7F4K92
    """
    year = datetime.now().year
    for _ in range(100):  # Retry loop to prevent collision
        random_suffix = "".join(random.choices(ID_CHARS, k=6))
        candidate_id = f"CERT-{year}-{random_suffix}"
        exists = db.query(Certificate).filter(Certificate.certificate_id == candidate_id).first()
        if not exists:
            return candidate_id
    # Fallback with timestamp if loop exhausted
    ts_suffix = datetime.now().strftime("%f")[:6].upper()
    return f"CERT-{year}-{ts_suffix}"

def format_default_date() -> str:
    """Formats current date nicely, e.g. '22 September 2026'."""
    now = datetime.now()
    return now.strftime("%d %B %Y")

def create_certificate(db: Session, data: CertificateCreate) -> Certificate:
    """
    Creates a new certificate record, generates unique ID, QR URL, and ReportLab PDF.
    """
    certificate_id = generate_unique_certificate_id(db)
    issue_date = data.issue_date.strip() if data.issue_date and data.issue_date.strip() else format_default_date()
    description = data.description.strip() if data.description and data.description.strip() else (
        "In recognition of valuable participation, dedication and contribution."
    )
    verification_url = get_verification_url(certificate_id)

    # Generate genuine PDF
    pdf_path = generate_certificate_pdf(
        certificate_id=certificate_id,
        recipient_name=data.recipient_name,
        certificate_type=data.certificate_type,
        description=description,
        organization_name=data.organization_name,
        issue_date=issue_date,
        signatory_name=data.signatory_name,
        signatory_title=data.signatory_title,
    )
    pdf_filename = os.path.basename(pdf_path)

    cert = Certificate(
        certificate_id=certificate_id,
        recipient_name=data.recipient_name,
        certificate_type=data.certificate_type,
        description=description,
        organization_name=data.organization_name,
        issue_date=issue_date,
        signatory_name=data.signatory_name,
        signatory_title=data.signatory_title,
        status="VALID",
        pdf_filename=pdf_filename,
        verification_url=verification_url,
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

def get_certificate_by_id(db: Session, certificate_id: str) -> Optional[Certificate]:
    """Finds a certificate by its certificate_id (case-insensitive)."""
    clean_id = certificate_id.strip().upper()
    return db.query(Certificate).filter(Certificate.certificate_id == clean_id).first()

def list_certificates(
    db: Session,
    query: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> Tuple[List[Certificate], int]:
    """Lists certificates with optional search and status filtering."""
    q = db.query(Certificate)
    if query and query.strip():
        search = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Certificate.recipient_name.ilike(search),
                Certificate.certificate_id.ilike(search),
                Certificate.organization_name.ilike(search),
            )
        )
    if status and status.upper() in ("VALID", "REVOKED"):
        q = q.filter(Certificate.status == status.upper())

    total = q.count()
    certs = q.order_by(Certificate.id.desc()).offset(skip).limit(limit).all()
    return certs, total

def revoke_certificate(db: Session, certificate_id: str) -> Optional[Certificate]:
    """Revokes a certificate by updating its status to REVOKED."""
    cert = get_certificate_by_id(db, certificate_id)
    if not cert:
        return None
    cert.status = "REVOKED"
    db.commit()
    db.refresh(cert)
    return cert
