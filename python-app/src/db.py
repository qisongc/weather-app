from sqlmodel import create_engine
import redis

engine = create_engine("postgresql+psycopg2://admin:admin@database/db")
redis_client = redis.Redis(host='redis', port=6379)