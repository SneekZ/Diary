from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": False,
    "samesite": "lax"
}

from app.api.user import routerUser
from app.api.note import routerNote

app.include_router(routerUser, prefix="", tags=["User"])
app.include_router(routerNote, prefix="", tags=["Note"])
