from sqlmodel import Session, select
from src.models import Account
from src.db import engine

def fetch_account(username: str):
    with Session(engine) as session:
        statement = select(Account).where(Account.username == username)
        return session.exec(statement).first()

def create_account(username: str):
    with Session(engine) as session:
        account = Account(username=username)
        session.add(account)
        session.commit()
        session.refresh(account)
        return account