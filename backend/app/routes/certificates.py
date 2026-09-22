import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateRevokeResponse,
)
from app.services import certificate_service
from app.services.pdf_service import GENERATED_DIR, generate_certificate_pdf

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])

@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate_endpoint(payload: CertificateCreate, db: Session = Depends(get_db)):
    """Generates a new digital certificate."""
    try:
        cert = certificate_service.create_certificate(db, payload)
        return cert
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Certificate generation failed: {str(e)}"
        )

@router.get("", response_model=List[CertificateResponse])
def list_certificates_endpoint(
    q: Optional[str] = Query(None, description="Search by recipient, ID, or organization"),
    status: Optional[str] = Query(None, description="Filter by status (VALID, REVOKED)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Lists certificates with optional search and filter."""
    certs, _ = certificate_service.list_certificates(db, query=q, status=status, skip=skip, limit=limit)
    return certs

@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate_endpoint(certificate_id: str, db: Session = Depends(get_db)):
    """Fetches a certificate by its certificate_id."""
    cert = certificate_service.get_certificate_by_id(db, certificate_id)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found in database."
        )
    return cert

@router.get("/{certificate_id}/pdf")
def download_certificate_pdf_endpoint(certificate_id: str, db: Session = Depends(get_db)):
    """Downloads the genuine A4 landscape PDF certificate."""
    cert = certificate_service.get_certificate_by_id(db, certificate_id)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found."
        )

    # Resolve PDF file path
    pdf_path = None
    if cert.pdf_filename:
        candidate_path = os.path.join(GENERATED_DIR, cert.pdf_filename)
        if os.path.exists(candidate_path):
            pdf_path = candidate_path

    # If file was missing or moved, regenerate it on the fly
    if not pdf_path or not os.path.exists(pdf_path):
        pdf_path = generate_certificate_pdf(
            certificate_id=cert.certificate_id,
            recipient_name=cert.recipient_name,
            certificate_type=cert.certificate_type,
            description=cert.description,
            organization_name=cert.organization_name,
            issue_date=cert.issue_date,
            signatory_name=cert.signatory_name,
            signatory_title=cert.signatory_title,
        )

    safe_name = "".join(c for c in cert.recipient_name if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")
    download_filename = f"CertiVault_{safe_name}_{cert.certificate_id}.pdf"

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=download_filename,
        headers={
            "Content-Disposition": f'attachment; filename="{download_filename}"'
        }
    )

@router.patch("/{certificate_id}/revoke", response_model=CertificateRevokeResponse)
def revoke_certificate_endpoint(certificate_id: str, db: Session = Depends(get_db)):
    """Revokes a certificate."""
    cert = certificate_service.revoke_certificate(db, certificate_id)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found."
        )
    return CertificateRevokeResponse(
        certificate_id=cert.certificate_id,
        status="REVOKED",
        message="Certificate has been successfully revoked."
    )
