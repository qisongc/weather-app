from fastapi import APIRouter
from src.services.counter import increment_counter

router = APIRouter()

@router.get("/counter")
def read_counter():
    counter = increment_counter()
    return {"message": "Counter incremented", "counter": counter}