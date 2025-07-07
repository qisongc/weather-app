from fastapi import APIRouter
from src.services.forecast import fetch_forecast

router = APIRouter()

@router.get("/getForecast")
def get_forecast(latitude: float, longitude: float, name: str, admin1: str = None, country: str = None):
    data = fetch_forecast(latitude, longitude, name, admin1, country)
    if data:
        return data
    return {"error": "Failed to fetch data from Open Meteo API"}