from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError

from app.models.models import User
from app.schemas.token import TokenData
from app.auth.security import verify_password
from app.core.config import settings

# This tells FastAPI where to look for the token for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

async def authenticate_user(email: str, password: str) -> User | None:
    """Finds a user in MongoDB and verifies their password."""
    user = await User.find_one(User.email == email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Decodes the JWT token to get the current user from the database."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except (JWTError, ValidationError):
        raise credentials_exception

    user = await User.find_one(User.email == token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to get the current authenticated and active user."""
    # In a real app, you might check an `is_active` flag on the user model here.
    return current_user
