from sqlmodel import Session, select
from src.models import Favourite, Account

def is_favourite_location(account_id: int, location_id: int, session: Session):
    statement = select(Favourite).where(
        Favourite.account_id == account_id,
        Favourite.location_id == location_id
    )
    favourite = session.exec(statement).first()
    return favourite is not None

def add_favourite_location(account_id: int, location_id: int, session: Session):
    favourite = Favourite(account_id=account_id, location_id=location_id)
    session.add(favourite)
    session.commit()
    session.refresh(favourite)
    return favourite

def remove_favourite_location(account_id: int, location_id: int, session: Session):
    statement = select(Favourite).where(
        Favourite.account_id == account_id,
        Favourite.location_id == location_id
    )
    favourite = session.exec(statement).first()
    if favourite:
        session.delete(favourite)
        session.commit()
    return favourite

def fetch_favourite_locations(account_id: int, session: Session):
    account = session.get(Account, account_id)
    return account.favourites if account else []