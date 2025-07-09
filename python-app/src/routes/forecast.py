from fastapi import APIRouter
import requests
from sqlmodel import Session
from src.db import engine, redis_client
from src.services.location import find_location, add_location, increase_location_search_count, fetch_top_location
from fastapi.responses import JSONResponse
import json


router = APIRouter()

@router.get("/get-forecast")
def get_forecast(latitude: float, longitude: float, name: str, admin1: str = None, country: str = None):
    with Session(engine) as session:
        location = find_location(latitude, longitude, session)
        if location:
            increase_location_search_count(location, session)
        else:
            location = add_location(latitude, longitude, name, admin1, country, session=session)

    redis_key = f"{latitude},{longitude}"
    redis_value = redis_client.get(redis_key)
    if redis_value:
        return JSONResponse(status_code=200, content=json.loads(redis_value))

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&hourly=temperature_2m"
    )
    response = requests.get(url)
    if response.status_code == 200:
        forecast = response.json()
        response = { "location": location.model_dump(), "forecast": forecast }

        redis_client.set(redis_key, json.dumps(response), ex=900)

        return JSONResponse(status_code=200, content=response)
    return JSONResponse(status_code=404, content={"error": "Failed to fetch data from Open Meteo API"})

@router.get("/get-top-location-forecast")
def get_top_location_forecast(count: int = 3):
    with Session(engine) as session:
        locations = fetch_top_location(count, session)
        if locations:
            responses = []
            for location in locations:
                redis_key = f"{location.latitude},{location.longitude}"
                redis_value = redis_client.get(redis_key)
                if redis_value:
                    responses.append(json.loads(redis_value))
                else:
                    url = (
                        f"https://api.open-meteo.com/v1/forecast?"
                        f"latitude={location.latitude}&longitude={location.longitude}&hourly=temperature_2m"
                    )
                    response = requests.get(url)
                    if response.status_code == 200:
                        forecast = response.json()
                        response = { "location": location.model_dump(), "forecast": forecast }

                        redis_client.set(redis_key, json.dumps(response), ex=900)
                        responses.append(response)
            return JSONResponse(status_code=200, content=responses)
    return JSONResponse(status_code=200, content=[])