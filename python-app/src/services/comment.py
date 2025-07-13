from sqlmodel import Session, select
from src.models import Comment, Location, Account
import math
import logging
logger = logging.getLogger('sqlalchemy.engine')
logger.setLevel(logging.DEBUG)
from sqlalchemy import func

logging.basicConfig()

def comment(account_id: int, location_id: int, content: str, session: Session, per_page: int = 10):
    new_comment = Comment(account_id=account_id, location_id=location_id, content=content)
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)

    total = session.exec(select(func.count()).where(Comment.location_id == location_id)).one()
    total_pages = math.ceil(total / per_page) if per_page else 1

    comments = fetch_comments(location_id, session, total_pages, per_page)
    return comments

def fetch_comments(location_id: int, session: Session, page: int = 1, per_page: int = 10):
    total = session.exec(select(func.count()).where(Comment.location_id == location_id)).one()
    total_pages = math.ceil(total / per_page) if per_page else 1
    offset = (page - 1) * per_page

    comments = session.exec(select(Comment).where(Comment.location_id == location_id).order_by(Comment.created_at).offset(offset).limit(per_page)).all()
    unique_account_id = list(set([row.account_id for row in comments]))

    accounts = session.exec(select(Account).where(Account.id.in_(unique_account_id))).all()
    accounts_dict = {account.id: account.username for account in accounts}
    print(accounts_dict)

    comments_with_account = [
        {
            "id": comment.id,
            "account_id": comment.account_id,
            "location_id": comment.location_id,
            "content": comment.content,
            "created_at": comment.created_at.isoformat(),
            "username": accounts_dict[comment.account_id] if comment.account_id in accounts_dict else None
        }
        for comment in comments
    ]

    return {"total": total, "total_page": total_pages, "page": page, "per_page": per_page, "comments": comments_with_account}