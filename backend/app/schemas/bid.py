from pydantic import BaseModel, Field
from datetime import date
from typing import Literal
from beanie import PydanticObjectId

class BidBase(BaseModel):
    iso: str
    bid_date: date
    hour: int = Field(..., ge=0, le=23, description="The hour of the day (0-23) for the bid.")
    bid_type: Literal['buy', 'sell']
    quantity: float = Field(..., gt=0, description="Quantity in MWh.")
    price: float = Field(..., gt=0, description="Price in $/MWh.")

class BidCreate(BidBase):
    pass

class BidRead(BidBase):
    id: PydanticObjectId
    owner_id: PydanticObjectId

    class Config:
        from_attributes = True
        json_encoders = {PydanticObjectId: str} # Serialize ObjectId to string in JSON responses
