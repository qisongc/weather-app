import psycopg2
import redis
import requests

from fastapi import FastAPI
from pydantic import BaseModel, PositiveInt
from sqlmodel import SQLModel, Field, create_engine, Session
from fastapi.middleware.cors import CORSMiddleware

r = redis.Redis(host='redis', port=6379)

class Account(SQLModel, table=True):
        id: PositiveInt = Field(default=None, primary_key=True)
        username: str

engine = create_engine("postgresql+psycopg2://admin:admin@database/db")

app = FastAPI()

origins = [
    "http://host.docker.internal:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():

    return {"accounts": "Welcome to the Weather App API"}


@app.get("/counter")
def read_root():
    r.incr("counter")
    return {"Counter": r.get("counter")}

@app.get("/getForecast")
def get_forecast(lat: float, lon: float):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,weathercode"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data from Open Meteo API"}
     