from sqlmodel import Session, select
from src.models import Location
from typing import Optional

def fetch_location(location_id: int, session: Session):
    statement = select(Location).where(Location.id == location_id)
    return session.exec(statement).first()

def find_location(latitude: float, longitude: float, session: Session) -> Optional[Location]:
    statement = select(Location).where(Location.latitude == latitude, Location.longitude == longitude)
    return session.exec(statement).first()

def add_location(latitude: float, longitude: float, name: str, admin1: str, country: str, session: Session):
    location = Location(latitude=latitude, longitude=longitude, name=name, admin1=admin1, country=country)
    session.add(location)
    session.commit()
    session.refresh(location)
    return location

def increase_location_search_count(location: Location, session: Session):
    location.search_count += 1
    session.add(location)
    session.commit()
    session.refresh(location)
    return location

def fetch_top_location(session: Session, count: int = 3):
    statement = select(Location).order_by(Location.search_count.desc()).limit(count)
    results = session.exec(statement).all()
    return results