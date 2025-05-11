from fastapi import Request
from fastapi.exceptions import HTTPException

def getSessionToken(request: Request) -> str:
    sessionToken = request.cookies.get("session")
    if not sessionToken:
        raise HTTPException(401, "Пользователь не авторизован")

    return sessionToken
