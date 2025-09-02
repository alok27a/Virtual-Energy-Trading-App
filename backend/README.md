# Backend Folders

## API Documentation

The FastAPI backend automatically generates interactive API documentation. Once the backend server is running, you can access these pages in your browser:

*   **Swagger UI:** [`http://127.0.0.1:8000/docs`](https://www.google.com/search?q=http://127.0.0.1:8000/docs "null")
    
    *   An interactive UI where you can test every API endpoint directly from your browser. This is the best way to experiment with the backend.
        
*   **ReDoc:** [`http://127.0.0.1:8000/redoc`](https://www.google.com/search?q=http://127.0.0.1:8000/redoc "null")
    
    *   A clean, user-friendly documentation page for the API.
        

The API is organized into the following groups of endpoints:

*   `Authentication`: User registration and token-based login.
    
*   `Market Data`: Fetching historical Day-Ahead and Real-Time prices.
    
*   `Bidding`: Submitting and retrieving user bids.
    
*   `Simulation`: Running the P&L simulation.

## Installation 
1. Navigate to the backend directory:
```bash
   cd backend
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Create a .env file in the root directory and add your OpenAI API key:
```
MONGO_DATABASE_URL="mongo-uri"
SECRET_KEY="a_very_secret_key_that_should_be_in_an_env_file"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

GRIDSTATUS_API_KEY="gridstatus-api-key"
PORT=8000
```

4. Start the backend server:

```
uvicorn app.main:app --reload
```