from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session
from src.db import engine
from src.services.account import fetch_account, create_account
from src.schemas import LoginRequest

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest):
    with Session(engine) as session:
        username = payload.username.strip()
        if not username:
            return JSONResponse(status_code=400, content={"error": "Username cannot be empty"})
        account = fetch_account(username, session)
        if account:
            return JSONResponse(status_code=200, content=jsonable_encoder(account))
        else:
            account = create_account(username, session)
            return JSONResponse(status_code=201, content=jsonable_encoder(account))