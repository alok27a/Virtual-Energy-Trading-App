from pydantic import BaseModel
from datetime import date
from typing import Literal
from beanie import PydanticObjectId

class PositionRead(BaseModel):
    """Schema for returning position data, including calculated P&L."""
    id: PydanticObjectId
    owner_id: PydanticObjectId
    iso: str
    position_date: date
    hour: int
    position_type: Literal['buy', 'sell']
    quantity: float
    clearing_price: float
    realized_pnl: float

    class Config:
        from_attributes = True
        json_encoders = {PydanticObjectId: str}
