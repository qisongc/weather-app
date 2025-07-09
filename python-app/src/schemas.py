from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str

class FavouriteRequest(BaseModel):
    account_id: int
    location_id: int

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    name: str
    admin: str
    country: str

class CommentRequest(BaseModel):
    account_id: int
    location_id: int
    content: str