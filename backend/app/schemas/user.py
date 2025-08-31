from pydantic import BaseModel, EmailStr
from beanie import PydanticObjectId

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    """Schema for returning user data (omitting the password)."""
    id: PydanticObjectId

    class Config:
        from_attributes = True
        json_encoders = {PydanticObjectId: str}
