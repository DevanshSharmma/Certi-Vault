import os
import sys
import re
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set testing environment before importing app
os.environ["DATABASE_URL"] = "sqlite:///./test_certivault.db"
os.environ["FRONTEND_URL"] = "http://localhost:5173"

from app.main import app
from app.database.database import Base, engine

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_certivault.db"):
        try:
            os.remove("./test_certivault.db")
        except Exception:
            pass

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "CertiVault" in data["service"]

def test_create_prashant_sharma_certificate():
    payload = {
        "recipient_name": "Prashant Sharma",
        "certificate_type": "Certificate of Appreciation",
        "description": "In recognition of valuable participation, dedication and contribution.",
        "organization_name": "CertiVault",
        "issue_date": "22 September 2026",
        "signatory_name": "Alex Morgan",
        "signatory_title": "Authorized Signatory"
    }
    response = client.post("/api/certificates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["recipient_name"] == "Prashant Sharma"
    assert data["certificate_type"] == "Certificate of Appreciation"
    assert data["status"] == "VALID"
    assert re.match(r"^CERT-\d{4}-[A-Z0-9]{6}$", data["certificate_id"])
    assert f"/verify/{data['certificate_id']}" in data["verification_url"]

def test_create_rahul_sharma_certificate():
    payload = {
        "recipient_name": "Rahul Sharma",
        "certificate_type": "Certificate of Achievement",
        "description": "Outstanding performance in full-stack cloud engineering.",
        "organization_name": "CertiVault",
        "issue_date": "22 September 2026"
    }
    response = client.post("/api/certificates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["recipient_name"] == "Rahul Sharma"
    assert data["recipient_name"] != "Prashant Sharma"
    assert data["certificate_type"] == "Certificate of Achievement"
    assert re.match(r"^CERT-\d{4}-[A-Z0-9]{6}$", data["certificate_id"])

def test_create_ananya_singh_certificate():
    payload = {
        "recipient_name": "Ananya Singh",
        "certificate_type": "Certificate of Completion",
        "description": "Excellence in digital security systems development.",
        "organization_name": "CertiVault"
    }
    response = client.post("/api/certificates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["recipient_name"] == "Ananya Singh"
    assert data["status"] == "VALID"

def test_verify_valid_certificate():
    # First create
    create_res = client.post("/api/certificates", json={
        "recipient_name": "Aman Verma",
        "certificate_type": "Certificate of Recognition"
    })
    cert_id = create_res.json()["certificate_id"]

    # Verify
    verify_res = client.get(f"/api/verify/{cert_id}")
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    assert vdata["valid"] is True
    assert vdata["status"] == "VALID"
    assert vdata["certificate"]["recipient_name"] == "Aman Verma"

def test_verify_invalid_certificate():
    response = client.get("/api/verify/CERT-2026-INVALID")
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert data["status"] == "INVALID"
    assert "No certificate matching this Certificate ID exists" in data["message"]
    assert data["certificate"] is None

def test_pdf_download():
    create_res = client.post("/api/certificates", json={
        "recipient_name": "Priya Patel",
        "certificate_type": "Certificate of Participation"
    })
    cert_id = create_res.json()["certificate_id"]

    pdf_res = client.get(f"/api/certificates/{cert_id}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    content_disp = pdf_res.headers.get("content-disposition", "")
    assert "attachment" in content_disp
    assert f"CertiVault_Priya_Patel_{cert_id}.pdf" in content_disp
    assert len(pdf_res.content) > 1000

def test_revoke_certificate():
    create_res = client.post("/api/certificates", json={
        "recipient_name": "Dev Test",
        "certificate_type": "Certificate of Recognition"
    })
    cert_id = create_res.json()["certificate_id"]

    # Revoke
    revoke_res = client.patch(f"/api/certificates/{cert_id}/revoke")
    assert revoke_res.status_code == 200
    rdata = revoke_res.json()
    assert rdata["status"] == "REVOKED"
    assert rdata["certificate_id"] == cert_id

    # Verify after revoke
    verify_res = client.get(f"/api/verify/{cert_id}")
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    assert vdata["valid"] is False
    assert vdata["status"] == "REVOKED"
    assert "REVOKED" in vdata["message"]
    assert vdata["certificate"]["status"] == "REVOKED"

def test_qr_code_endpoint():
    create_res = client.post("/api/certificates", json={
        "recipient_name": "QR Recipient",
        "certificate_type": "Certificate of Appreciation"
    })
    cert_id = create_res.json()["certificate_id"]

    qr_res = client.get(f"/api/qr/{cert_id}")
    assert qr_res.status_code == 200
    assert qr_res.headers["content-type"] == "image/png"
    assert len(qr_res.content) > 100
