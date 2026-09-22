from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.certificate import CertificateVerifyResponse, CertificateResponse
from app.services import certificate_service

router = APIRouter(tags=["Verification"])

@router.get("/api/verify/{certificate_id}", response_model=CertificateVerifyResponse)
def verify_certificate_endpoint(certificate_id: str, db: Session = Depends(get_db)):
    """
    Public verification endpoint.
    Returns:
    - VALID: Certificate is authentic and active
    - REVOKED: Certificate was revoked
    - INVALID: Certificate ID does not exist
    """
    cert = certificate_service.get_certificate_by_id(db, certificate_id)
    if not cert:
        return CertificateVerifyResponse(
            valid=False,
            status="INVALID",
            message="No certificate matching this Certificate ID exists in our records.",
            certificate=None
        )

    if cert.status == "REVOKED":
        return CertificateVerifyResponse(
            valid=False,
            status="REVOKED",
            message="Certificate has been REVOKED by the issuing authority and is no longer valid.",
            certificate=CertificateResponse.model_validate(cert)
        )

    return CertificateVerifyResponse(
        valid=True,
        status="VALID",
        message="Certificate verified successfully. This credential is authentic and valid.",
        certificate=CertificateResponse.model_validate(cert)
    )

@router.get("/api/health")
def health_check():
    """Service health check endpoint."""
    return {
        "status": "ok",
        "service": "CertiVault API",
        "version": "1.0.0"
    }
