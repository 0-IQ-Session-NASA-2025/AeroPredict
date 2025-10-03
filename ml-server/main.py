from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, prediction, model

app = FastAPI(
    title="AeroPredict ML Server",
    description="Machine Learning API for AeroPredict - Aerodynamic predictions and analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(prediction.router, prefix="/api/v1", tags=["prediction"])
app.include_router(model.router, prefix="/api/v1", tags=["model"])

@app.get("/")
async def root():
    return {
        "message": "AeroPredict ML Server",
        "version": "1.0.0",
        "description": "Machine Learning API for aerodynamic predictions"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)