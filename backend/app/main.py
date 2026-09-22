import os
import io
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.database.database import Base, engine
from app.routes import certificates, verification
from app.services.asset_generator import ASSETS_DIR, ensure_assets_dir, generate_all_assets
from app.services.qr_service import generate_qr_image, get_verification_url

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created
    Base.metadata.create_all(bind=engine)
    # Ensure brand assets are generated
    ensure_assets_dir()
    logo_file = os.path.join(ASSETS_DIR, "logo.png")
    if not os.path.exists(logo_file):
        generate_all_assets()
    yield
    # Shutdown

app = FastAPI(
    title="CertiVault API",
    description="Digital Certificate Generation & Verification System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

# Mount static directory for brand assets
if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Include API routes
app.include_router(certificates.router)
app.include_router(verification.router)

@app.get("/api/qr/{certificate_id}")
def get_qr_code_image(certificate_id: str):
    """Returns a standalone PNG image of the QR code for a certificate ID."""
    url = get_verification_url(certificate_id)
    img = generate_qr_image(url, box_size=8, border=2)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": f"Internal Server Error: {str(exc)}"}
    )
