import motor.motor_asyncio
from beanie import init_beanie

from app.core.config import settings
from app.models.models import User, Bid, Position

async def init_db():
    """
    Initializes the database connection and the Beanie ODM.
    This function is called once on application startup.
    """
    # Create an asynchronous client for MongoDB using the URL from settings
    client = motor.motor_asyncio.AsyncIOMotorClient(
        settings.MONGO_DATABASE_URL
    )

    # Initialize Beanie with the document models.
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, Bid, Position]
    )