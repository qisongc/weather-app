from sqlmodel import SQLModel, Field
from pydantic import PositiveInt

class Users(SQLModel, table=True):
    id: PositiveInt = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)
