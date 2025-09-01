from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import auth, market_data, bids, simulation
from app.database import init_db

# Create the main FastAPI application instance
app = FastAPI(
    title="Virtual Energy Trader API (MongoDB)",
    description="API for the Virtual Energy Trading App, powered by FastAPI and MongoDB.",
    version="3.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing) middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    """Initialize the database connection and Beanie ODM on application startup."""
    await init_db()

# Include the API routers from the endpoints module
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(market_data.router, prefix="/api/v1/market-data", tags=["Market Data"])
app.include_router(bids.router, prefix="/api/v1/bids", tags=["Bidding"])
app.include_router(simulation.router, prefix="/api/v1/simulations", tags=["Simulation"])

@app.get("/", tags=["Root"])
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the Virtual Energy Trader API v3 (MongoDB)!"}

