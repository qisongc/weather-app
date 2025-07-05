from fastapi import FastAPI
from pydantic import BaseModel, PositiveInt
import psycopg2
import redis
from sqlmodel import SQLModel, Field, create_engine, Session

r = redis.Redis(host='redis', port=6379)

class Account(SQLModel, table=True):
        id: PositiveInt = Field(default=None, primary_key=True)
        name: str

engine = create_engine("postgresql+psycopg2://admin:admin@database/db")

app = FastAPI()

@app.get("/")
def read_root():

    # Create the database tables if they do not exist
    SQLModel.metadata.create_all(engine)
    account_1 = Account(name="John")
    account_2 = Account(name="Joe")
    with Session(engine) as session:
        session.add(account_1)
        session.add(account_2)
        session.commit()

    conn = psycopg2.connect(
        database="db",
        user="admin",
        password="admin",
        host="database",
    )

    cur = conn.cursor()

    cur.execute("SELECT * FROM account;")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return {"accounts": rows}


@app.get("/counter")
def read_root():
    r.incr("counter")
    return {"Counter": r.get("counter")}