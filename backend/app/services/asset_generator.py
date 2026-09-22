"""
CertiVault Asset Generator
Generates original fictional branding assets (Logo, Seal, Signature) in SVG and high-res PNG formats.
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "assets"))

def ensure_assets_dir():
    os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_logo_svg() -> str:
    """Returns SVG markup for the official CertiVault logo."""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 90" width="300" height="90">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E3E62" />
      <stop offset="100%" stop-color="#0B192C" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="40%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#B38F3F" />
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Shield Emblem Icon -->
  <g transform="translate(10, 5)" filter="url(#subtleShadow)">
    <!-- Outer Golden Crest -->
    <path d="M 40,5 L 72,16 C 72,50 56,72 40,78 C 24,72 8,50 8,16 Z" 
          fill="url(#goldGrad)" stroke="#B38F3F" stroke-width="1.5" />
    <!-- Inner Navy Shield -->
    <path d="M 40,10 L 67,20 C 67,48 53,67 40,72 C 27,67 13,48 13,20 Z" 
          fill="url(#shieldGrad)" />
    <!-- Certificate Document Scroll motif inside shield -->
    <rect x="25" y="24" width="30" height="26" rx="2" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" />
    <line x1="30" y1="31" x2="50" y2="31" stroke="#FDFBF7" stroke-width="1.5" stroke-linecap="round" />
    <line x1="30" y1="37" x2="46" y2="37" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" />
    <line x1="30" y1="43" x2="42" y2="43" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" />
    <!-- Golden Verification Checkmark -->
    <circle cx="53" cy="48" r="9" fill="#0B192C" stroke="url(#goldGrad)" stroke-width="1.5" />
    <path d="M 49,48 L 52,51 L 57,45" fill="none" stroke="url(#goldGrad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Brand Typography -->
  <text x="95" y="47" font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" font-size="28" font-weight="700" letter-spacing="4" fill="#0B192C">CERTI<tspan fill="#D4AF37">VAULT</tspan></text>
  <text x="96" y="65" font-family="'Inter', 'Segoe UI', sans-serif" font-size="9" font-weight="600" letter-spacing="3.2" fill="#64748B">CREATE • VERIFY • TRUST</text>
</svg>"""

def generate_seal_svg() -> str:
    """Returns SVG markup for the official decorative certificate seal."""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF3D5" />
      <stop offset="25%" stop-color="#D4AF37" />
      <stop offset="60%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#594100" />
    </linearGradient>
    <linearGradient id="sealInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#0B192C" />
    </linearGradient>
    <filter id="sealShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Ribbons behind seal -->
  <g transform="translate(100, 100)">
    <polygon points="-25,45 -38,95 -20,85 0,95 -12,45" fill="#8C1D24" stroke="#D4AF37" stroke-width="1.5" />
    <polygon points="12,45 0,95 20,85 38,95 25,45" fill="#A82831" stroke="#D4AF37" stroke-width="1.5" />
  </g>

  <!-- Seal Outer Sunburst/Star -->
  <g transform="translate(100, 100)" filter="url(#sealShadow)">
    <!-- 24-point gold star medallion -->
    <path d="M 0,-70 L 10,-60 L 26,-67 L 31,-53 L 49,-52 L 48,-36 L 64,-28 L 57,-13 L 70,-1 L 58,11 L 65,27 L 50,34 L 51,51 L 34,52 L 29,67 L 13,62 L 0,72 L -13,62 L -29,67 L -34,52 L -51,51 L -50,34 L -65,27 L -58,11 L -70,-1 L -57,-13 L -64,-28 L -48,-36 L -49,-52 L -31,-53 L -26,-67 L -10,-60 Z" 
          fill="url(#sealGoldGrad)" stroke="#AA7C11" stroke-width="1.2" />

    <!-- Outer Gold Ring -->
    <circle r="56" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1" />
    <circle r="54" fill="#0B192C" stroke="url(#sealGoldGrad)" stroke-width="2" />
    <circle r="44" fill="url(#sealGoldGrad)" stroke="#AA7C11" stroke-width="1" />
    <circle r="41" fill="#0F172A" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="0.8" />

    <!-- Center Checkmark & Shield -->
    <path d="M 0,-25 L 18,-15 C 18,6 9,18 0,22 C -9,18 -18,6 -18,-15 Z" fill="url(#sealGoldGrad)" />
    <path d="M 0,-22 L 15,-13 C 15,5 7,15 0,19 C -7,15 -15,5 -15,-13 Z" fill="#0B192C" />
    <path d="M -7,-1 L -2,4 L 8,-6" fill="none" stroke="url(#sealGoldGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Text on Seal Ring -->
    <path id="textCircleTop" d="M -46,0 A 46,46 0 0,1 46,0" fill="none" />
    <text font-family="'Cinzel', serif" font-size="7.5" font-weight="700" fill="#FDFBF7" letter-spacing="2.2">
      <textPath href="#textCircleTop" startOffset="50%" text-anchor="middle">CERTIVAULT • OFFICIAL</textPath>
    </text>
    <path id="textCircleBottom" d="M 46,0 A 46,46 0 0,1 -46,0" fill="none" />
    <text font-family="'Cinzel', serif" font-size="7.5" font-weight="700" fill="#D4AF37" letter-spacing="2.2">
      <textPath href="#textCircleBottom" startOffset="50%" text-anchor="middle">CERTIFIED • 2026</textPath>
    </text>
  </g>
</svg>"""

def generate_signature_svg() -> str:
    """Returns SVG markup for the official fictional digital signature (Alex Morgan)."""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
  <defs>
    <linearGradient id="inkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F2B5C" />
      <stop offset="50%" stop-color="#143A78" />
      <stop offset="100%" stop-color="#0B192C" />
    </linearGradient>
  </defs>
  <!-- Alex Morgan Handwritten Signature Path -->
  <path d="M 25,52 C 32,32 38,15 46,14 C 52,13 51,32 46,55 C 44,60 55,42 62,38 C 67,35 69,45 74,44 C 77,43 82,34 86,45 C 90,52 93,42 100,41 C 104,41 106,47 112,46 C 120,44 116,22 126,18 C 132,15 136,32 133,52 C 131,58 141,36 148,34 C 153,32 155,44 160,42 C 165,40 168,33 175,41 C 182,49 187,40 195,38 C 205,36 215,48 222,46"
        fill="none" stroke="url(#inkGrad)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Flourish Underline -->
  <path d="M 38,62 C 75,56 140,58 185,63 C 200,65 215,62 205,58 C 190,54 165,60 145,64"
        fill="none" stroke="#1E3E62" stroke-width="1.8" stroke-linecap="round" />
</svg>"""

def generate_logo_png(filepath: str):
    """Draws high-resolution transparent logo PNG for ReportLab PDF."""
    w, h = 600, 180
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Outer Crest
    cx, cy = 90, 85
    crest_pts = [
        (cx, cy - 65),
        (cx + 55, cy - 45),
        (cx + 55, cy + 15),
        (cx, cy + 65),
        (cx - 55, cy + 15),
        (cx - 55, cy - 45)
    ]
    draw.polygon(crest_pts, fill=(212, 175, 55, 255), outline=(179, 143, 63, 255))

    # Inner Navy Shield
    inner_pts = [
        (cx, cy - 58),
        (cx + 47, cy - 40),
        (cx + 47, cy + 12),
        (cx, cy + 56),
        (cx - 47, cy + 12),
        (cx - 47, cy - 40)
    ]
    draw.polygon(inner_pts, fill=(11, 25, 44, 255))

    # Certificate Icon inside shield
    draw.rectangle([cx - 24, cy - 30, cx + 18, cy + 12], outline=(212, 175, 55, 255), width=3)
    draw.line([cx - 16, cy - 20, cx + 10, cy - 20], fill=(255, 255, 255, 255), width=3)
    draw.line([cx - 16, cy - 10, cx + 6, cy - 10], fill=(212, 175, 55, 255), width=3)
    draw.line([cx - 16, cy, cx + 2, cy], fill=(212, 175, 55, 255), width=3)

    # Verification circle + checkmark
    chk_cx, chk_cy = cx + 22, cy + 18
    draw.ellipse([chk_cx - 14, chk_cy - 14, chk_cx + 14, chk_cy + 14], fill=(11, 25, 44, 255), outline=(212, 175, 55, 255), width=3)
    draw.line([chk_cx - 7, chk_cy - 1, chk_cx - 2, chk_cy + 5], fill=(212, 175, 55, 255), width=4)
    draw.line([chk_cx - 2, chk_cy + 5, chk_cx + 8, chk_cy - 5], fill=(212, 175, 55, 255), width=4)

    # Text rendering
    try:
        font_main = ImageFont.truetype("timesbd.ttf", 52)
        font_sub = ImageFont.truetype("arialbd.ttf", 18)
    except Exception:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((180, 42), "CERTI", font=font_main, fill=(11, 25, 44, 255))
    draw.text((345, 42), "VAULT", font=font_main, fill=(212, 175, 55, 255))
    draw.text((185, 106), "CREATE • VERIFY • TRUST", font=font_sub, fill=(100, 116, 139, 255))

    img.save(filepath, "PNG")

def generate_seal_png(filepath: str):
    """Draws high-resolution transparent Seal PNG for ReportLab PDF."""
    size = 400
    img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2

    # Draw ribbons
    r_color = (168, 40, 49, 255)
    r_border = (212, 175, 55, 255)
    ribbon_left = [(cx - 30, cy + 60), (cx - 70, cy + 170), (cx - 35, cy + 150), (cx, cy + 170), (cx - 15, cy + 60)]
    ribbon_right = [(cx + 15, cy + 60), (cx, cy + 170), (cx + 35, cy + 150), (cx + 70, cy + 170), (cx + 30, cy + 60)]
    draw.polygon(ribbon_left, fill=r_color, outline=r_border)
    draw.polygon(ribbon_right, fill=r_color, outline=r_border)

    # 32-point gold star medallion
    num_points = 32
    r_outer = 135
    r_inner = 120
    star_pts = []
    for i in range(num_points * 2):
        angle = i * math.pi / num_points
        r = r_outer if i % 2 == 0 else r_inner
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        star_pts.append((x, y))
    draw.polygon(star_pts, fill=(212, 175, 55, 255), outline=(170, 124, 17, 255))

    # Concentric rings
    draw.ellipse([cx - 115, cy - 115, cx + 115, cy + 115], fill=(11, 25, 44, 255), outline=(245, 245, 245, 255), width=3)
    draw.ellipse([cx - 95, cy - 95, cx + 95, cy + 95], fill=(212, 175, 55, 255), outline=(170, 124, 17, 255), width=2)
    draw.ellipse([cx - 88, cy - 88, cx + 88, cy + 88], fill=(15, 23, 42, 255), outline=(255, 255, 255, 120), width=2)

    # Center shield
    sh_pts = [
        (cx, cy - 45),
        (cx + 35, cy - 25),
        (cx + 35, cy + 10),
        (cx, cy + 42),
        (cx - 35, cy + 10),
        (cx - 35, cy - 25)
    ]
    draw.polygon(sh_pts, fill=(212, 175, 55, 255))
    sh_inner = [
        (cx, cy - 40),
        (cx + 29, cy - 22),
        (cx + 29, cy + 8),
        (cx, cy + 36),
        (cx - 29, cy + 8),
        (cx - 29, cy - 22)
    ]
    draw.polygon(sh_inner, fill=(11, 25, 44, 255))

    # Checkmark inside
    draw.line([cx - 14, cy - 2, cx - 4, cy + 10], fill=(212, 175, 55, 255), width=5)
    draw.line([cx - 4, cy + 10, cx + 16, cy - 10], fill=(212, 175, 55, 255), width=5)

    # Ring texts
    try:
        font_ring = ImageFont.truetype("timesbd.ttf", 16)
        font_yr = ImageFont.truetype("arialbd.ttf", 14)
    except Exception:
        font_ring = ImageFont.load_default()
        font_yr = ImageFont.load_default()

    draw.text((cx - 52, cy - 108), "CERTIVAULT", font=font_ring, fill=(255, 255, 255, 255))
    draw.text((cx - 52, cy + 92), "• CERTIFIED •", font=font_yr, fill=(212, 175, 55, 255))

    img.save(filepath, "PNG")

def generate_signature_png(filepath: str):
    """Draws high-resolution transparent Signature PNG for ReportLab PDF."""
    w, h = 480, 160
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Signature curve strokes for 'Alex Morgan'
    curve_points = [
        (50, 104), (64, 64), (76, 30), (92, 28), (104, 26), (102, 64), (92, 110),
        (88, 120), (110, 84), (124, 76), (134, 70), (138, 90), (148, 88), (154, 86),
        (164, 68), (172, 90), (180, 104), (186, 84), (200, 82), (208, 82), (212, 94),
        (224, 92), (240, 88), (232, 44), (252, 36), (264, 30), (272, 64), (266, 104),
        (262, 116), (282, 72), (296, 68), (306, 64), (310, 88), (320, 84), (330, 80),
        (336, 66), (350, 82), (364, 98), (374, 80), (390, 76), (410, 72), (430, 96), (444, 92)
    ]
    # Draw smooth multi-segment stroke
    for i in range(len(curve_points) - 1):
        draw.line([curve_points[i], curve_points[i+1]], fill=(15, 43, 92, 255), width=5)

    # Flourish underline
    flourish = [(76, 124), (150, 112), (280, 116), (370, 126), (410, 130), (430, 124), (410, 116), (330, 120), (290, 128)]
    for i in range(len(flourish) - 1):
        draw.line([flourish[i], flourish[i+1]], fill=(30, 62, 98, 255), width=3)

    img.save(filepath, "PNG")

def generate_all_assets():
    """Generates all brand assets in SVG and PNG."""
    ensure_assets_dir()

    # SVG files
    with open(os.path.join(ASSETS_DIR, "logo.svg"), "w", encoding="utf-8") as f:
        f.write(generate_logo_svg())

    with open(os.path.join(ASSETS_DIR, "seal.svg"), "w", encoding="utf-8") as f:
        f.write(generate_seal_svg())

    with open(os.path.join(ASSETS_DIR, "signature.svg"), "w", encoding="utf-8") as f:
        f.write(generate_signature_svg())

    # PNG files
    generate_logo_png(os.path.join(ASSETS_DIR, "logo.png"))
    generate_seal_png(os.path.join(ASSETS_DIR, "seal.png"))
    generate_signature_png(os.path.join(ASSETS_DIR, "signature.png"))

    print(f"All CertiVault assets generated in {ASSETS_DIR}")

if __name__ == "__main__":
    generate_all_assets()
