from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.model_service import ModelService

router = APIRouter()
model_service = ModelService()

class AerodynamicInput(BaseModel):
    velocity: float
    angle_of_attack: float
    altitude: float
    wing_span: Optional[float] = None
    wing_area: Optional[float] = None
    aircraft_type: Optional[str] = "generic"

class PredictionResponse(BaseModel):
    lift_coefficient: float
    drag_coefficient: float
    pressure_coefficient: float
    lift_force: float
    drag_force: float
    confidence_score: float

@router.post("/predict", response_model=PredictionResponse)
async def predict_aerodynamics(input_data: AerodynamicInput):
    try:
        prediction = await model_service.predict_aerodynamics(input_data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/predict/batch", response_model=List[PredictionResponse])
async def predict_batch(input_data: List[AerodynamicInput]):
    try:
        predictions = []
        for data in input_data:
            prediction = await model_service.predict_aerodynamics(data)
            predictions.append(prediction)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@router.get("/predict/example")
async def get_prediction_example():
    return {
        "example_input": {
            "velocity": 50.0,
            "angle_of_attack": 5.0,
            "altitude": 1000.0,
            "wing_span": 10.0,
            "wing_area": 15.0,
            "aircraft_type": "light_aircraft"
        },
        "description": "Example input for aerodynamic prediction"
    }