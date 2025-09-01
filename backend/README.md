# Backend Installation
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