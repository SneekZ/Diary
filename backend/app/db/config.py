import dotenv
import os

dotenv.load_dotenv(".env", override=False)

host = os.getenv("DATABASE_HOST")
port = os.getenv("DATABASE_PORT")
user = os.getenv("DATABASE_USER")
password= os.getenv("DATABASE_PASSWORD")
schema= os.getenv("DATABASE_SCHEMA")

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{schema}"