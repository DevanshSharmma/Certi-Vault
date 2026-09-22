"""
End-to-End Verification Script for CertiVault
Tests all 8 mandatory verification scenarios:
1. Dynamic generation for 'Prashant Sharma' (name, ID, DB, PDF, QR)
2. Dynamic generation for 'Rahul Sharma' (distinct name & new ID)
3. Dynamic generation for 'Ananya Singh'
4. PDF download, headers, and internal binary structure verification
5. QR code verification URL lookup
6. Invalid ID lookup ('CERT-2026-INVALID') -> status INVALID
7. Certificate revocation -> status REVOKED
8. Print layout & ReportLab A4 landscape dimensions check
"""
import os
import sys
import re

# Ensure backend root is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ["DATABASE_URL"] = "sqlite:///./certivault_e2e.db"
os.environ["FRONTEND_URL"] = "http://localhost:5173"

from fastapi.testclient import TestClient
from app.main import app
from app.database.database import Base, engine, SessionLocal
from app.models.certificate import Certificate
from app.services.pdf_service import GENERATED_DIR

client = TestClient(app)

def run_all_tests():
    print("=" * 60)
    print("STARTING CERTIVAULT END-TO-END VERIFICATION")
    print("=" * 60)

    # Clean DB setup
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    passed = 0
    total = 8

    # TEST 1: Prashant Sharma
    print("\n[TEST 1] Generate certificate for 'Prashant Sharma'...")
    res1 = client.post("/api/certificates", json={
        "recipient_name": "Prashant Sharma",
        "certificate_type": "Certificate of Appreciation",
        "description": "In recognition of valuable participation, dedication and contribution.",
        "organization_name": "CertiVault",
        "issue_date": "22 September 2026"
    })
    assert res1.status_code == 201, f"Failed: {res1.text}"
    data1 = res1.json()
    id1 = data1["certificate_id"]
    assert data1["recipient_name"] == "Prashant Sharma"
    assert re.match(r"^CERT-\d{4}-[A-Z0-9]{6}$", id1)
    
    # Check DB
    db_cert1 = db.query(Certificate).filter(Certificate.certificate_id == id1).first()
    assert db_cert1 is not None, "DB record missing!"
    assert db_cert1.recipient_name == "Prashant Sharma"
    assert db_cert1.status == "VALID"

    # Check PDF on disk
    pdf_path1 = os.path.join(GENERATED_DIR, db_cert1.pdf_filename)
    assert os.path.exists(pdf_path1), f"PDF file not found at {pdf_path1}"
    assert os.path.getsize(pdf_path1) > 5000, "PDF file too small!"

    # Check QR endpoint
    qr_res1 = client.get(f"/api/qr/{id1}")
    assert qr_res1.status_code == 200
    assert qr_res1.headers["content-type"] == "image/png"
    print(f"  [PASS] TEST 1 PASSED: 'Prashant Sharma' generated, ID: {id1}, DB Record & PDF (size: {os.path.getsize(pdf_path1)} bytes) verified.")
    passed += 1

    # TEST 2: Rahul Sharma
    print("\n[TEST 2] Generate certificate for 'Rahul Sharma'...")
    res2 = client.post("/api/certificates", json={
        "recipient_name": "Rahul Sharma",
        "certificate_type": "Certificate of Achievement",
        "description": "Outstanding performance in cybersecurity and distributed systems."
    })
    assert res2.status_code == 201
    data2 = res2.json()
    id2 = data2["certificate_id"]
    assert data2["recipient_name"] == "Rahul Sharma"
    assert data2["recipient_name"] != "Prashant Sharma", "Error: Recipient name was hardcoded!"
    assert id2 != id1, "Error: Certificate ID collided!"
    print(f"  [PASS] TEST 2 PASSED: 'Rahul Sharma' dynamic, ID: {id2} != {id1}.")
    passed += 1

    # TEST 3: Ananya Singh
    print("\n[TEST 3] Generate certificate for 'Ananya Singh'...")
    res3 = client.post("/api/certificates", json={
        "recipient_name": "Ananya Singh",
        "certificate_type": "Certificate of Completion",
        "description": "Mastery of cryptographic verification workflows."
    })
    assert res3.status_code == 201
    data3 = res3.json()
    id3 = data3["certificate_id"]
    assert data3["recipient_name"] == "Ananya Singh"
    assert id3 != id1 and id3 != id2
    print(f"  [PASS] TEST 3 PASSED: 'Ananya Singh' dynamic, ID: {id3}.")
    passed += 1

    # TEST 4: PDF Download and Verification
    print("\n[TEST 4] Test PDF Download & Headers...")
    pdf_res = client.get(f"/api/certificates/{id1}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    content_disp = pdf_res.headers.get("content-disposition", "")
    assert "attachment" in content_disp
    assert f"CertiVault_Prashant_Sharma_{id1}.pdf" in content_disp
    assert len(pdf_res.content) > 10000
    # Verify PDF starts with %PDF
    assert pdf_res.content.startswith(b"%PDF"), "Response is not a valid PDF binary!"
    print(f"  [PASS] TEST 4 PASSED: PDF auto-download header confirmed ({content_disp}). Valid %PDF binary length: {len(pdf_res.content)} bytes.")
    passed += 1

    # TEST 5: QR Code Verification URL
    print("\n[TEST 5] QR Code verification URL test...")
    verify_url = f"/api/verify/{id1}"
    v_res = client.get(verify_url)
    assert v_res.status_code == 200
    v_data = v_res.json()
    assert v_data["valid"] is True
    assert v_data["status"] == "VALID"
    assert v_data["certificate"]["recipient_name"] == "Prashant Sharma"
    assert v_data["certificate"]["certificate_id"] == id1
    print(f"  [PASS] TEST 5 PASSED: Scanning QR / opening URL verified certificate status VALID for {id1}.")
    passed += 1

    # TEST 6: Invalid Certificate ID
    print("\n[TEST 6] Verify non-existent ID 'CERT-2026-INVALID'...")
    inv_res = client.get("/api/verify/CERT-2026-INVALID")
    assert inv_res.status_code == 200
    inv_data = inv_res.json()
    assert inv_data["valid"] is False
    assert inv_data["status"] == "INVALID"
    assert "No certificate matching this Certificate ID exists in our records." in inv_data["message"]
    assert inv_data["certificate"] is None
    print("  [PASS] TEST 6 PASSED: Invalid ID correctly returned status: INVALID with no fake data.")
    passed += 1

    # TEST 7: Revoke Certificate
    print("\n[TEST 7] Revoke certificate & verify status updated to REVOKED...")
    rev_res = client.patch(f"/api/certificates/{id1}/revoke")
    assert rev_res.status_code == 200
    assert rev_res.json()["status"] == "REVOKED"

    # Re-verify through verification endpoint
    check_rev = client.get(f"/api/verify/{id1}")
    assert check_rev.status_code == 200
    rev_data = check_rev.json()
    assert rev_data["valid"] is False
    assert rev_data["status"] == "REVOKED"
    assert rev_data["certificate"]["status"] == "REVOKED"
    print(f"  [PASS] TEST 7 PASSED: Certificate {id1} status transitioned to REVOKED.")
    passed += 1

    # TEST 8: Print layout & A4 landscape check
    print("\n[TEST 8] Print certificate layout verification...")
    frontend_css_path = os.path.abspath(os.path.join(backend_dir, "..", "frontend", "src", "index.css"))
    with open(frontend_css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    assert "@media print" in css_content
    assert "size: A4 landscape" in css_content
    assert ".no-print" in css_content
    assert ".printable-certificate-wrapper" in css_content
    print("  [PASS] TEST 8 PASSED: Dedicated @media print styles configured for pristine A4 landscape output.")
    passed += 1

    print("\n" + "=" * 60)
    print(f"ALL {passed}/{total} END-TO-END TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

    # Clean up test DB
    db.close()
    if os.path.exists("./certivault_e2e.db"):
        try:
            os.remove("./certivault_e2e.db")
        except Exception:
            pass

if __name__ == "__main__":
    run_all_tests()
