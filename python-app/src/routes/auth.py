from fastapi import APIRouter
from fastapi.responses import JSONResponse
from src.schemas import LoginRequest
from src.services.auth import get_account, create_account

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest):
    username = payload.username.strip()
    if not username:
        return JSONResponse(status_code=400, content={"error": "Username cannot be empty"})
    account = get_account(username)
    if account:
        return JSONResponse(status_code=200, content=account.dict())
    else:
        account = create_account(username)
        return JSONResponse(status_code=201, content=account.dict())