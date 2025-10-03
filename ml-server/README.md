# AeroPredict ML Server

A FastAPI-based machine learning server for aerodynamic predictions and analysis.

## Features

- **Aerodynamic Predictions**: Calculate lift coefficient, drag coefficient, and pressure coefficient
- **Model Management**: Load, unload, and monitor ML models
- **Health Monitoring**: System health checks and performance metrics
- **Batch Processing**: Support for batch predictions

## API Endpoints

### Health
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed system metrics

### Predictions
- `POST /api/v1/predict` - Single aerodynamic prediction
- `POST /api/v1/predict/batch` - Batch predictions
- `GET /api/v1/predict/example` - Example input format

### Model Management
- `GET /api/v1/models` - List available models
- `GET /api/v1/models/{model_name}` - Get model information
- `POST /api/v1/models/{model_name}/load` - Load a model
- `POST /api/v1/models/{model_name}/unload` - Unload a model
- `GET /api/v1/models/status` - Get models status

## Installation

```bash
cd ml-server
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## Example Usage

```python
import requests

# Health check
response = requests.get("http://localhost:8000/api/v1/health")

# Aerodynamic prediction
data = {
    "velocity": 50.0,
    "angle_of_attack": 5.0,
    "altitude": 1000.0,
    "wing_span": 10.0,
    "wing_area": 15.0,
    "aircraft_type": "light_aircraft"
}
response = requests.post("http://localhost:8000/api/v1/predict", json=data)
```