import requests
from sqlmodel import Session, select
from src.models import Location
from src.db import engine

def fetch_forecast(latitude: float, longitude: float, name: str, admin1: str = None, country: str = None):
    with Session(engine) as session:
        statement = select(Location).where(Location.latitude == latitude, Location.longitude == longitude)
        location = session.exec(statement).first()

    if location:
        location.search_count += 1
        session.add(location)
    else:
        location = Location(latitude=latitude, longitude=longitude, name=name, admin1=admin1, country=country)
        session.add(location)   
    
    session.commit()

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&hourly=temperature_2m"
    )
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None