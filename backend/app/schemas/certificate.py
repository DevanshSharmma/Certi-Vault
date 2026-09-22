import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict

ALLOWED_TYPES = [
    "Certificate of Appreciation",
    "Certificate of Participation",
    "Certificate of Achievement",
    "Certificate of Recognition",
    "Certificate of Completion",
]

class CertificateCreate(BaseModel):
    recipient_name: str = Field(..., description="Recipient's full name")
    certificate_type: str = Field(..., description="Type of certificate")
    description: Optional[str] = Field(None, max_length=500, description="Achievement or honor description")
    organization_name: Optional[str] = Field("CertiVault", max_length=150, description="Issuing organization")
    issue_date: Optional[str] = Field(None, max_length=64, description="Formatted issue date")
    signatory_name: Optional[str] = Field("Alex Morgan", max_length=150, description="Signatory name")
    signatory_title: Optional[str] = Field("Authorized Signatory", max_length=150, description="Signatory title")

    @field_validator("recipient_name")
    @classmethod
    def validate_recipient_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Recipient full name cannot be empty.")
        if len(trimmed) > 100:
            raise ValueError("Recipient full name cannot exceed 100 characters.")
        # Allow letters, unicode letters, spaces, hyphens, apostrophes, dots
        if not re.match(r"^[\w\s\.\-']+$", trimmed, re.UNICODE):
            raise ValueError("Recipient name contains invalid characters. Use letters, spaces, hyphens, or apostrophes.")
        return trimmed

    @field_validator("certificate_type")
    @classmethod
    def validate_certificate_type(cls, v: str) -> str:
        trimmed = v.strip()
        if trimmed not in ALLOWED_TYPES:
            raise ValueError(f"Invalid certificate type. Allowed: {', '.join(ALLOWED_TYPES)}")
        return trimmed

    @field_validator("organization_name")
    @classmethod
    def validate_org_name(cls, v: Optional[str]) -> str:
        if not v or not v.strip():
            return "CertiVault"
        return v.strip()

    @field_validator("signatory_name")
    @classmethod
    def validate_signatory_name(cls, v: Optional[str]) -> str:
        if not v or not v.strip():
            return "Alex Morgan"
        return v.strip()

    @field_validator("signatory_title")
    @classmethod
    def validate_signatory_title(cls, v: Optional[str]) -> str:
        if not v or not v.strip():
            return "Authorized Signatory"
        return v.strip()

class CertificateResponse(BaseModel):
    id: int
    certificate_id: str
    recipient_name: str
    certificate_type: str
    description: Optional[str]
    organization_name: str
    issue_date: str
    signatory_name: str
    signatory_title: str
    status: str
    pdf_filename: Optional[str]
    verification_url: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CertificateVerifyResponse(BaseModel):
    valid: bool
    status: str  # VALID, REVOKED, INVALID
    message: str
    certificate: Optional[CertificateResponse] = None

class CertificateRevokeResponse(BaseModel):
    certificate_id: str
    status: str
    message: str
