from sqlmodel import Session, select
from sqlalchemy import func
import math
from src.models import Comment, Location

def comment(account_id: int, location_id: int, content: str, session: Session, per_page: int = 10):
    new_comment = Comment(account_id=account_id, location_id=location_id, content=content)
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)

    total = session.exec(
        select(func.count()).where(Comment.location_id == location_id)
    ).one()

    total_pages = math.ceil(total / per_page) if per_page else 1

    comments = fetch_comments(location_id, session, total_pages, per_page)
    return comments

def fetch_comments(location_id: int, session: Session, page: int = 1, per_page: int = 10):
    location = session.get(Location, location_id)
    if not location:
        return {"total": 0, "total_page": 0, "page": page, "per_page": per_page, "comments": []}

    total = len(location.comments)
    total_pages = math.ceil(total / per_page) if per_page else 1
    start = (page - 1) * per_page
    end = start + per_page

    sorted_comment = sorted(location.comments, key=lambda c: c.created_at)
    
    comments = [
        {
            "id": comment.id,
            "account_id": comment.account_id,
            "location_id": comment.location_id,
            "content": comment.content,
            "created_at": comment.created_at.isoformat(),
            "username": comment.author.username if comment.author else None
        }
        for comment in sorted_comment[start:end]
    ]

    return {"total": total, "total_page": total_pages, "page": page, "per_page": per_page, "comments": comments}