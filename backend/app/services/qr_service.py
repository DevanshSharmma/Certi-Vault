import os
import io
import base64
import qrcode
from PIL import Image

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

def get_verification_url(certificate_id: str) -> str:
    """Builds the full verification URL for a given certificate ID."""
    base_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    return f"{base_url}/verify/{certificate_id}"

def generate_qr_image(url: str, box_size: int = 10, border: int = 2) -> Image.Image:
    """Generates a high-quality QR code PIL image."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B192C", back_color="#FFFFFF")
    return img.convert("RGBA")

def generate_qr_base64(url: str) -> str:
    """Generates a data URI base64 string for embedding in web or previews."""
    img = generate_qr_image(url, box_size=8, border=2)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"

def save_qr_code_file(certificate_id: str, output_path: str) -> str:
    """Generates and saves the QR code for a certificate ID to a local PNG file."""
    url = get_verification_url(certificate_id)
    img = generate_qr_image(url)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    return output_path
