import numpy as np
from datetime import datetime
from typing import List, Dict, Optional
from app.models.aerodynamic_model import AerodynamicModel
from app.routes.prediction import AerodynamicInput, PredictionResponse

class ModelService:
    def __init__(self):
        self.loaded_models = {}
        self.available_models = {
            "lift_drag_predictor": {
                "name": "lift_drag_predictor",
                "version": "1.0.0",
                "type": "aerodynamic",
                "status": "available",
                "last_trained": "2024-01-15T10:30:00Z",
                "accuracy": 0.92
            },
            "pressure_coefficient_model": {
                "name": "pressure_coefficient_model",
                "version": "1.1.0",
                "type": "pressure_analysis",
                "status": "available",
                "last_trained": "2024-02-20T14:45:00Z",
                "accuracy": 0.88
            }
        }

        self.aerodynamic_model = AerodynamicModel()

    async def predict_aerodynamics(self, input_data: AerodynamicInput) -> PredictionResponse:
        prediction = self.aerodynamic_model.predict(
            velocity=input_data.velocity,
            angle_of_attack=input_data.angle_of_attack,
            altitude=input_data.altitude,
            wing_span=input_data.wing_span or 10.0,
            wing_area=input_data.wing_area or 15.0
        )

        return PredictionResponse(**prediction)

    async def get_available_models(self) -> List[Dict]:
        return list(self.available_models.values())

    async def get_model_info(self, model_name: str) -> Optional[Dict]:
        return self.available_models.get(model_name)

    async def load_model(self, model_name: str) -> str:
        if model_name not in self.available_models:
            raise ValueError(f"Model {model_name} not found")

        if model_name not in self.loaded_models:
            self.loaded_models[model_name] = {
                "loaded_at": datetime.utcnow().isoformat(),
                "status": "loaded"
            }

        return "loaded"

    async def unload_model(self, model_name: str) -> str:
        if model_name in self.loaded_models:
            del self.loaded_models[model_name]
        return "unloaded"

    async def get_models_status(self) -> Dict:
        status = {
            "loaded_models": list(self.loaded_models.keys()),
            "available_models": list(self.available_models.keys()),
            "total_loaded": len(self.loaded_models),
            "total_available": len(self.available_models)
        }
        return status