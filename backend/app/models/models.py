from beanie import Document, PydanticObjectId
from pydantic import Field, EmailStr
from typing import Optional, Literal
from datetime import datetime, date

class User(Document):
    """Represents a user in the 'users' collection."""
    email: EmailStr = Field(..., unique=True)
    hashed_password: str

    class Settings:
        name = "users"  # MongoDB collection name

class Bid(Document):
    """Represents a bid in the 'bids' collection."""
    owner_id: PydanticObjectId
    iso: str = Field(..., index=True)
    bid_date: date = Field(..., index=True)
    hour: int = Field(..., ge=0, le=23)
    bid_type: Literal['buy', 'sell']
    quantity: float = Field(..., gt=0)  # in MWh
    price: float = Field(..., gt=0)     # in $/MWh
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bids"
        indexes = [
            ["owner_id", "iso", "bid_date"],  # Compound index for efficient querying
        ]

class Position(Document):
    """Represents a cleared position in the 'positions' collection."""
    owner_id: PydanticObjectId
    iso: str = Field(..., index=True)
    position_date: date
    hour: int = Field(..., ge=0, le=23)
    position_type: Literal['buy', 'sell']
    quantity: float
    clearing_price: float
    realized_pnl: float = 0.0

    class Settings:
        name = "positions"
