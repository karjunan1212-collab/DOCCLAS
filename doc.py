#from time import sleep
#from fastapi import FastAPI
# 
#app = FastAPI()
# 
#@app.get("/getval")
#def hello():
#    sleep(20)
#    return {"message": "get DOC sucessfull"}
#
#@app.get("/getocr")
#def hello():
#    sleep(20)
#    return {"message": "OCR Sucessful"}
#
#@app.get("/getclassify")
#def hello():
#    sleep(20)
#    return {"message": "Classification Successful"}

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import Optional
from time import sleep

app = FastAPI()

# Add CORS if Angular frontend needs it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for your Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration - UPDATE THIS WITH YOUR LINUX MACHINE IP
LINUX_WRAPPER_URL = "http://10.217.226.69:8001"  # Change to your Linux IP
# OR if using domain/hostname:
# LINUX_WRAPPER_URL = "http://your-linux-server.com:8001"


@app.get("/getval")
def hello():
    sleep(20)
    return {"message": "get DOC sucessfull"}



@app.get("/getval1")  # Changed to POST to accept file
#async def validate_document(file: UploadFile = File(...)):
async def validate_document(file: UploadFile = File(r'C:\Users\Karthikeyan188767\Documents\docblitz\De_IB_Doc.pdf')):    
    
    """Forward validation request to Linux wrapper"""
    try:
        # Forward file to Linux wrapper
        files = {"file": (file.filename, file.file, file.content_type)}
        response = requests.post(f"{LINUX_WRAPPER_URL}/getval", files=files, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "message": "Validation failed",
            "error": str(e)
        })

@app.post("/getocr")  # Changed to POST to accept file
async def ocr_document(
    file: Optional[UploadFile] = File(None),
    file_path: Optional[str] = Form(None)
):
    """Forward OCR request to Linux wrapper"""
    try:
        if file:
            # Upload new file
            files = {"file": (file.filename, file.file, file.content_type)}
            response = requests.post(f"{LINUX_WRAPPER_URL}/getocr", files=files, timeout=120)
        elif file_path:
            # Use existing file path
            data = {"file_path": file_path}
            response = requests.post(f"{LINUX_WRAPPER_URL}/getocr", data=data, timeout=120)
        else:
            raise HTTPException(status_code=400, detail={"message": "No file or file_path provided"})
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "message": "OCR failed",
            "error": str(e)
        })

@app.post("/getclassify")  # Changed to POST to accept data
async def classify_document(
    text: Optional[str] = Form(None),
    file_path: Optional[str] = Form(None)
):
    """Forward classification request to Linux wrapper"""
    try:
        data = {}
        if text:
            data["text"] = text
        if file_path:
            data["file_path"] = file_path
        
        if not data:
            raise HTTPException(status_code=400, detail={"message": "No text or file_path provided"})
        
        response = requests.post(f"{LINUX_WRAPPER_URL}/getclassify", data=data, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "message": "Classification failed",
            "error": str(e)
        })

# Optional: Health check endpoint
@app.get("/health")
def health_check():
    """Check if wrapper API is reachable"""
    try:
        response = requests.get(f"{LINUX_WRAPPER_URL}/health", timeout=5)
        return {
            "status": "ok",
            "wrapper_status": response.json()
        }
    except:
        return {
            "status": "error",
            "message": "Cannot reach Linux wrapper API"
        }

# Optional: Full pipeline endpoint
@app.post("/process-full")
async def process_full(
    file: UploadFile = File(...),
    skip_validation: bool = Form(False)
):
    """Forward full pipeline request to Linux wrapper"""
    try:
        files = {"file": (file.filename, file.file, file.content_type)}
        data = {"skip_validation": str(skip_validation).lower()}
        response = requests.post(
            f"{LINUX_WRAPPER_URL}/process-full", 
            files=files, 
            data=data, 
            timeout=180
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "message": "Full processing failed",
            "error": str(e)
        })


if __name__ == "__main__":
    import uvicorn
    print("Starting Angular FastAPI Backend on Windows")
    print(f"Forwarding requests to: {LINUX_WRAPPER_URL}")
    uvicorn.run(app, host="0.0.0.0", port=8000)