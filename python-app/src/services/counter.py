from src.db import redis_client

def increment_counter():
    redis_client.incr("counter")
    value = redis_client.get("counter")
    return int(value) if value else 0