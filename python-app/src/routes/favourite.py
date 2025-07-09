from fastapi import APIRouter
from src.services.location import fetch_location
from src.services.favourite import add_favourite_location, remove_favourite_location, fetch_favourite_locations, is_favourite_location
from sqlmodel import Session
from src.db import engine
from src.schemas import FavouriteRequest
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/is-favourite-location")
def get_is_favourite_location(account_id: int, location_id: int):
    with Session(engine) as session:
        location = fetch_location(location_id, session)
        if location:
            is_fav = is_favourite_location(account_id, location.id, session)
            return JSONResponse(status_code=200, content=is_fav)
        return JSONResponse(status_code=404, content={"error": "Location not found"})

@router.post("/favourite-location")
def post_favourite_location(payload: FavouriteRequest):
    with Session(engine) as session:
        location = fetch_location(payload.location_id, session)
        if location:
            add_favourite_location(payload.account_id, location.id, session)
            return JSONResponse(status_code=201, content=True)
        return JSONResponse(status_code=404, content={"error": "Location not found"})

@router.delete("/unfavourite-location")
def delete_favourite_location(account_id: int, location_id: int):
    with Session(engine) as session:
        location = fetch_location(location_id, session)
        if location:
            remove_favourite_location(account_id, location.id, session)
            return JSONResponse(status_code=200, content=False)
        return JSONResponse(status_code=404, content={"error": "Location not found"})
   
@router.get("/favourite-locations")
def get_favourite_locations(account_id: int):
    with Session(engine) as session:
        favourites = fetch_favourite_locations(account_id, session)
        if favourites:
            return JSONResponse(status_code=200, content=[location.model_dump() for location in favourites])
        return JSONResponse(status_code=200, content=[])