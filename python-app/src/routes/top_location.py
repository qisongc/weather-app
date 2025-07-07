from fastapi import APIRouter
from src.services.top_location import fetch_top_location

router = APIRouter()

@router.get("/getTopLocation")
def get_top_location(count: int = 3):
    data = fetch_top_location(count)
    if data:
        return data
    return []