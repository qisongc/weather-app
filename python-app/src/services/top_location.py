from sqlmodel import Session, select
from src.models import Location
from src.db import engine

def fetch_top_location(count: int = 3):
    with Session(engine) as session:
        statement = (
            select(Location)
            .order_by(Location.search_count.desc())
            .limit(count)
        )
        results = session.exec(statement).all()

    if not results:
        return None
    return results