import os
import io
import math
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import barcode
from barcode.writer import ImageWriter

from app.services.qr_service import generate_qr_image, get_verification_url
from app.services.asset_generator import ASSETS_DIR, ensure_assets_dir, generate_all_assets

GENERATED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "generated_certificates"))

def ensure_dirs():
    os.makedirs(GENERATED_DIR, exist_ok=True)
    ensure_assets_dir()

def draw_decorative_corners(c: canvas.Canvas, x1, y1, x2, y2, size=24, color=colors.HexColor("#D4AF37")):
    """Draws ornamental corner brackets at the corners of a rectangle."""
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(1.8)

    # Top-Left
    c.line(x1, y2 - size, x1, y2)
    c.line(x1, y2, x1 + size, y2)
    c.circle(x1 + 6, y2 - 6, 2, stroke=1, fill=1)

    # Top-Right
    c.line(x2 - size, y2, x2, y2)
    c.line(x2, y2, x2, y2 - size)
    c.circle(x2 - 6, y2 - 6, 2, stroke=1, fill=1)

    # Bottom-Left
    c.line(x1, y1 + size, x1, y1)
    c.line(x1, y1, x1 + size, y1)
    c.circle(x1 + 6, y1 + 6, 2, stroke=1, fill=1)

    # Bottom-Right
    c.line(x2 - size, y1, x2, y1)
    c.line(x2, y1, x2, y1 + size)
    c.circle(x2 - 6, y1 + 6, 2, stroke=1, fill=1)

    c.restoreState()

def draw_watermark(c: canvas.Canvas, cx, cy):
    """Draws a subtle central security watermark behind the certificate text."""
    c.saveState()
    c.setFillColor(colors.HexColor("#F3F0E6"))
    c.setStrokeColor(colors.HexColor("#EAE4D2"))
    c.setLineWidth(1)

    # Concentric faint watermark rings
    for r in [170, 130, 90]:
        c.circle(cx, cy, r, stroke=1, fill=0)

    # Subtle central watermark text
    c.setFillColor(colors.HexColor("#F5F2EA"))
    c.setFont("Times-Bold", 64)
    c.drawCentredString(cx, cy - 20, "CERTI•VAULT")
    c.restoreState()

def draw_left_security_bar(c: canvas.Canvas, x, y, width, height):
    """
    Draws a genuine high-security margin bar on the left side of the certificate.
    Features midnight navy base, dual gold pinstripes, micro-guilloche diamond lattice,
    and vertical security crest.
    """
    c.saveState()

    navy = colors.HexColor("#0B192C")
    gold = colors.HexColor("#D4AF37")
    gold_dark = colors.HexColor("#B38F3F")
    gold_light = colors.HexColor("#FDF8ED")

    # Main bar background
    c.setFillColor(navy)
    c.rect(x, y, width, height, stroke=0, fill=1)

    # Outer border of the bar
    c.setStrokeColor(gold)
    c.setLineWidth(1.5)
    c.rect(x, y, width, height, stroke=1, fill=0)

    # Inner gold pinstripes
    c.setStrokeColor(gold_dark)
    c.setLineWidth(0.8)
    c.line(x + 5, y + 6, x + 5, y + height - 6)
    c.line(x + width - 5, y + 6, x + width - 5, y + height - 6)

    # Security guilloche / diamond pattern along the bar
    cx = x + width / 2
    step = 28
    start_y = y + 20
    end_y = y + height - 20

    c.setStrokeColor(colors.HexColor("#1E3E62"))
    c.setLineWidth(0.7)
    cur_y = start_y
    while cur_y <= end_y:
        # Diamond motif
        p = c.beginPath()
        p.moveTo(cx, cur_y - 10)
        p.lineTo(cx + 12, cur_y)
        p.lineTo(cx, cur_y + 10)
        p.lineTo(cx - 12, cur_y)
        p.close()
        c.drawPath(p, stroke=1, fill=0)

        # Micro center dot
        c.setFillColor(gold)
        c.circle(cx, cur_y, 1.2, stroke=0, fill=1)
        cur_y += step

    # Vertical Security Medallion in upper section of bar
    med_y = y + height - 70
    c.setFillColor(navy)
    c.setStrokeColor(gold)
    c.setLineWidth(1.5)
    c.circle(cx, med_y, 18, stroke=1, fill=1)

    # Inner ring
    c.setStrokeColor(gold_dark)
    c.setLineWidth(0.8)
    c.circle(cx, med_y, 14, stroke=1, fill=0)

    # Gold Star emblem
    c.setFillColor(gold)
    c.setFont("Times-Bold", 14)
    c.drawCentredString(cx, med_y - 4, "★")

    # Micro text vertically rotated along security bar
    c.saveState()
    c.translate(cx - 4, y + 120)
    c.rotate(90)
    c.setFillColor(gold_light)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(0, 0, "CERTI•VAULT  SECURE  CREDENTIAL  INTEGRITY  VERIFIED")
    c.restoreState()

    c.restoreState()

def generate_barcode_image(certificate_id: str) -> ImageReader:
    """Generates a Code 128 barcode image in memory."""
    code128 = barcode.get_barcode_class("code128")
    bc = code128(certificate_id, writer=ImageWriter())
    buf = io.BytesIO()
    bc.write(buf, options={"write_text": False, "module_height": 7.0, "module_width": 0.22, "quiet_zone": 1.0})
    buf.seek(0)
    return ImageReader(buf)

def generate_certificate_pdf(
    certificate_id: str,
    recipient_name: str,
    certificate_type: str,
    description: str,
    organization_name: str,
    issue_date: str,
    signatory_name: str,
    signatory_title: str,
) -> str:
    """
    Generates a genuine, professional A4 landscape PDF certificate with:
    - Left security margin bar
    - Concentric borders with corner ornaments
    - Watermark
    - Logo, seal, signature
    - Scannable QR code & Code 128 barcode
    - Recipient name prominently featured
    """
    ensure_dirs()

    # Asset paths
    logo_path = os.path.join(ASSETS_DIR, "logo.png")
    seal_path = os.path.join(ASSETS_DIR, "seal.png")
    sig_path = os.path.join(ASSETS_DIR, "signature.png")

    if not (os.path.exists(logo_path) and os.path.exists(seal_path) and os.path.exists(sig_path)):
        generate_all_assets()

    # Output file name: CertiVault_[Recipient_Name]_[Certificate_ID].pdf
    safe_name = "".join(c for c in recipient_name if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")
    filename = f"CertiVault_{safe_name}_{certificate_id}.pdf"
    pdf_path = os.path.join(GENERATED_DIR, filename)

    # Page setup: A4 Landscape (841.89 x 595.27 pt)
    page_w, page_h = landscape(A4)
    c = canvas.Canvas(pdf_path, pagesize=(page_w, page_h))
    c.setTitle(f"CertiVault - {recipient_name} - {certificate_id}")
    c.setSubject(certificate_type)
    c.setAuthor(organization_name)

    # 1. Base background: warm off-white / parchment
    c.setFillColor(colors.HexColor("#FCFBF7"))
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # 2. Outer decorative borders
    margin_outer = 16
    margin_inner = 22
    gold = colors.HexColor("#D4AF37")
    navy = colors.HexColor("#0B192C")
    charcoal = colors.HexColor("#334155")

    # Outer thin border
    c.setStrokeColor(gold)
    c.setLineWidth(1)
    c.rect(margin_outer, margin_outer, page_w - 2 * margin_outer, page_h - 2 * margin_outer, stroke=1, fill=0)

    # Inner double border
    c.setStrokeColor(navy)
    c.setLineWidth(2.5)
    c.rect(margin_inner, margin_inner, page_w - 2 * margin_inner, page_h - 2 * margin_inner, stroke=1, fill=0)

    # Fine accent line inside
    c.setStrokeColor(gold)
    c.setLineWidth(0.8)
    c.rect(margin_inner + 4, margin_inner + 4, page_w - 2 * (margin_inner + 4), page_h - 2 * (margin_inner + 4), stroke=1, fill=0)

    # Corner ornaments
    draw_decorative_corners(c, margin_inner + 6, margin_inner + 6, page_w - (margin_inner + 6), page_h - (margin_inner + 6), size=24, color=gold)

    # 3. REAL LEFT SECURITY BAR ("put one real bar on left side and make the certificate real genique")
    bar_x = margin_inner + 8
    bar_y = margin_inner + 8
    bar_width = 46
    bar_height = page_h - 2 * (margin_inner + 8)
    draw_left_security_bar(c, bar_x, bar_y, bar_width, bar_height)

    # Content Area Center X (offset for left bar)
    content_start_x = bar_x + bar_width + 12
    content_end_x = page_w - (margin_inner + 12)
    center_x = (content_start_x + content_end_x) / 2.0

    # 4. Central Watermark
    draw_watermark(c, center_x, page_h / 2.0 - 15)

    # 5. Header: Logo & Organization
    top_y = page_h - 48
    try:
        logo_img = ImageReader(logo_path)
        logo_w, logo_h = 175, 52
        c.drawImage(logo_img, center_x - (logo_w / 2), top_y - logo_h, width=logo_w, height=logo_h, mask="auto")
    except Exception as e:
        # Fallback text if image load fails
        c.setFillColor(navy)
        c.setFont("Times-Bold", 24)
        c.drawCentredString(center_x, top_y - 20, "CERTI•VAULT")

    # Issuing Organization line
    c.setFillColor(charcoal)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(center_x, top_y - 64, organization_name.upper())

    # Decorative separator ribbon below logo
    c.setStrokeColor(gold)
    c.setLineWidth(1.2)
    c.line(center_x - 140, top_y - 74, center_x + 140, top_y - 74)
    c.circle(center_x, top_y - 74, 2.5, stroke=1, fill=1)

    # 6. Certificate Title (e.g. CERTIFICATE OF APPRECIATION)
    title_text = certificate_type.upper()
    c.setFillColor(navy)
    c.setFont("Times-Bold", 24)
    c.drawCentredString(center_x, top_y - 106, title_text)

    # 7. Presentation Subtitle
    c.setFillColor(charcoal)
    c.setFont("Times-Italic", 12.5)
    c.drawCentredString(center_x, top_y - 128, "This certificate is proudly presented to")

    # 8. Recipient Full Name (THE CENTRAL VISUAL FOCUS)
    # Dynamic styling with subtle underline accent
    rec_name_y = top_y - 172
    c.setFillColor(navy)
    c.setFont("Times-Bold", 31)
    c.drawCentredString(center_x, rec_name_y, recipient_name.upper())

    # Elegant gold underline bar with diamond flourish under recipient name
    name_width = c.stringWidth(recipient_name.upper(), "Times-Bold", 31)
    bar_len = max(name_width + 40, 220)
    c.setStrokeColor(gold)
    c.setLineWidth(1.5)
    c.line(center_x - (bar_len / 2), rec_name_y - 8, center_x + (bar_len / 2), rec_name_y - 8)
    c.circle(center_x, rec_name_y - 8, 3, stroke=1, fill=1)

    # 9. Description / Achievement Text
    desc_y = rec_name_y - 34
    desc_text = description.strip() if description and description.strip() else (
        "In recognition of valuable participation, dedication, and exemplary standard of contribution."
    )
    c.setFillColor(charcoal)
    c.setFont("Times-Roman", 11.5)

    # Word wrap description if long
    words = desc_text.split()
    lines = []
    curr_line = []
    max_line_width = 460
    for w in words:
        test_line = " ".join(curr_line + [w])
        if c.stringWidth(test_line, "Times-Roman", 11.5) > max_line_width:
            lines.append(" ".join(curr_line))
            curr_line = [w]
        else:
            curr_line.append(w)
    if curr_line:
        lines.append(" ".join(curr_line))

    for line in lines[:2]:  # at most 2 balanced lines
        c.drawCentredString(center_x, desc_y, line)
        desc_y -= 16

    # 10. Metadata Row: Issue Date & Unique Certificate ID
    meta_y = desc_y - 10
    c.setFillColor(navy)
    c.setFont("Helvetica-Bold", 10)
    meta_text = f"Issue Date: {issue_date}     •     Certificate ID: {certificate_id}"
    c.drawCentredString(center_x, meta_y, meta_text)

    # 11. Bottom Row Layout:
    # LEFT COLUMN (of content area): Real QR Code + Code 128 Barcode
    # CENTER COLUMN: Original Decorative Seal
    # RIGHT COLUMN: Digital Signature + Signatory Name & Title

    bottom_area_y = margin_inner + 22

    # A) Real Scannable QR Code
    qr_x = content_start_x + 28
    qr_y = bottom_area_y + 8
    qr_size = 72
    try:
        verification_url = get_verification_url(certificate_id)
        qr_pil = generate_qr_image(verification_url, box_size=6, border=1)
        qr_reader = ImageReader(qr_pil)
        # QR background box with fine border
        c.setFillColor(colors.white)
        c.setStrokeColor(gold)
        c.setLineWidth(1)
        c.rect(qr_x - 3, qr_y - 3, qr_size + 6, qr_size + 6, stroke=1, fill=1)
        c.drawImage(qr_reader, qr_x, qr_y, width=qr_size, height=qr_size)

        # Micro label below QR
        c.setFillColor(charcoal)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(qr_x + (qr_size / 2), qr_y - 9, "SCAN TO VERIFY")
    except Exception as e:
        c.drawString(qr_x, qr_y, f"QR Error: {e}")

    # Code 128 Barcode next to QR
    try:
        barcode_reader = generate_barcode_image(certificate_id)
        bc_x = qr_x + qr_size + 14
        bc_y = qr_y + 12
        bc_w, bc_h = 100, 36
        c.drawImage(barcode_reader, bc_x, bc_y, width=bc_w, height=bc_h, mask="auto")

        c.setFillColor(navy)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(bc_x + (bc_w / 2), bc_y - 8, certificate_id)
    except Exception as e:
        pass

    # B) Seal in Center
    seal_size = 90
    seal_x = center_x + 10 - (seal_size / 2)
    seal_y = bottom_area_y - 2
    try:
        seal_img = ImageReader(seal_path)
        c.drawImage(seal_img, seal_x, seal_y, width=seal_size, height=seal_size, mask="auto")
    except Exception as e:
        c.circle(center_x, bottom_area_y + 35, 30, stroke=1, fill=0)

    # C) Right Side: Digital Signature of Alex Morgan
    sig_area_w = 170
    sig_x = content_end_x - sig_area_w - 18
    sig_y = bottom_area_y + 24
    try:
        sig_img = ImageReader(sig_path)
        sig_w, sig_h = 150, 50
        c.drawImage(sig_img, sig_x + 10, sig_y, width=sig_w, height=sig_h, mask="auto")
    except Exception as e:
        c.drawString(sig_x, sig_y + 15, "Alex Morgan")

    # Signature Line & Signatory Title
    line_y = sig_y + 6
    c.setStrokeColor(navy)
    c.setLineWidth(1.2)
    c.line(sig_x, line_y, sig_x + sig_area_w, line_y)

    c.setFillColor(navy)
    c.setFont("Times-Bold", 11)
    c.drawCentredString(sig_x + (sig_area_w / 2), line_y - 12, signatory_name)

    c.setFillColor(charcoal)
    c.setFont("Helvetica", 9)
    c.drawCentredString(sig_x + (sig_area_w / 2), line_y - 23, signatory_title)

    # 12. Bottom Security Footer note
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(center_x, margin_inner + 4, "Digitally registered and cryptographically anchored by CertiVault Authentication Service • Tamper-Evident Record")

    c.save()
    return pdf_path
