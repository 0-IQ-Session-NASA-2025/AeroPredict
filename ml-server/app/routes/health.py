from fastapi import APIRouter
from datetime import datetime
import psutil
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AeroPredict ML Server"
    }

@router.get("/health/detailed")
async def detailed_health_check():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AeroPredict ML Server",
        "system": {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent
            },
            "disk": {
                "total": disk.total,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100
            }
        },
        "process": {
            "pid": os.getpid(),
            "memory_info": psutil.Process().memory_info()._asdict()
        }
    }