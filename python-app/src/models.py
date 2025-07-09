from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Index, UniqueConstraint

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    account_id: int = Field(foreign_key="account.id")
    location_id: int = Field(foreign_key="location.id")

    author: Optional["Account"] = Relationship(back_populates="comments")
    location: Optional["Location"] = Relationship(back_populates="comments")

class Favourite(SQLModel, table=True):
    account_id: int = Field(foreign_key="account.id", primary_key=True)
    location_id: int = Field(foreign_key="location.id", primary_key=True)

class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)

    favourites: List["Location"] = Relationship(
        back_populates="favourited_by",
        link_model=Favourite
    )
    comments: List["Comment"] = Relationship(back_populates="author")

class Location(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    latitude: float = Field(nullable=False)
    longitude: float = Field(nullable=False)
    name: str = Field(nullable=False)
    admin1: Optional[str] = Field(default=None, nullable=True)
    country: Optional[str] = Field(default=None, nullable=True)
    search_count: int = Field(default=1, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "latitude",
            "longitude",
            name="uq_lat_lng"
        ),
    )

    favourited_by: List[Account] = Relationship(
        back_populates="favourites",
        link_model=Favourite
    )
    comments: List["Comment"] = Relationship(back_populates="location")