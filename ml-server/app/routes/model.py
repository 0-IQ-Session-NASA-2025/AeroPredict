from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.model_service import ModelService

router = APIRouter()
model_service = ModelService()

class ModelInfo(BaseModel):
    name: str
    version: str
    type: str
    status: str
    last_trained: str
    accuracy: float

@router.get("/models", response_model=list[ModelInfo])
async def get_available_models():
    try:
        models = await model_service.get_available_models()
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve models: {str(e)}")

@router.get("/models/{model_name}")
async def get_model_info(model_name: str):
    try:
        model_info = await model_service.get_model_info(model_name)
        if not model_info:
            raise HTTPException(status_code=404, detail="Model not found")
        return model_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve model info: {str(e)}")

@router.post("/models/{model_name}/load")
async def load_model(model_name: str):
    try:
        result = await model_service.load_model(model_name)
        return {"message": f"Model {model_name} loaded successfully", "status": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

@router.post("/models/{model_name}/unload")
async def unload_model(model_name: str):
    try:
        result = await model_service.unload_model(model_name)
        return {"message": f"Model {model_name} unloaded successfully", "status": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unload model: {str(e)}")

@router.get("/models/status")
async def get_models_status():
    try:
        status = await model_service.get_models_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get models status: {str(e)}")