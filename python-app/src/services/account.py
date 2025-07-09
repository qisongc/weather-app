from sqlmodel import Session, select
from src.models import Account

def fetch_account(username: str, session: Session):
    statement = select(Account).where(Account.username == username)
    return session.exec(statement).first()

def create_account(username: str, session: Session):
    account = Account(username=username)
    session.add(account)
    session.commit()
    session.refresh(account)
    return account