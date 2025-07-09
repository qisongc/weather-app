from fastapi import APIRouter
from src.services.comment import comment, fetch_comments
from sqlmodel import Session
from src.db import engine
from src.schemas import CommentRequest
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/comment")
def post_comment(payload: CommentRequest):
    with Session(engine) as session:
        new_comment = comment(payload.account_id, payload.location_id, payload.content, session)
        return JSONResponse(status_code=201, content=jsonable_encoder(new_comment))

@router.get("/comments")
def get_comments(location_id: int, page: int = 1, per_page: int = 10):
    with Session(engine) as session:
        comments = fetch_comments(location_id, session, page, per_page)
        return JSONResponse(status_code=200, content=jsonable_encoder(comments))