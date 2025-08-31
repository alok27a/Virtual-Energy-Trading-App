from pydantic import BaseModel
from typing import List
from datetime import date

class MarketDataPoint(BaseModel):
    """Represents a single time-series data point for charts."""
    x: int  # Unix timestamp in milliseconds
    y: float # Price or load value

class MarketDataResponse(BaseModel):
    """The successful response structure for the market data endpoint."""
    iso: str
    date: date
    daData: List[MarketDataPoint]
    rtData: List[MarketDataPoint]

class MarketDataError(BaseModel):
    """The error response structure."""
    detail: str
