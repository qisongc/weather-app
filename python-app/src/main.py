import debugpy
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import auth, counter, forecast, top_location

debugpy.listen(("0.0.0.0", 5678))

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://host.docker.internal:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(auth.router)
app.include_router(counter.router)
app.include_router(forecast.router)
app.include_router(top_location.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Weather App API"}