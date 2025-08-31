from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Response model for a successful login, containing the JWT."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Data model for the contents encoded within the JWT."""
    email: Optional[str] = None
