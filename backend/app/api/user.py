from app.api.models.user import UserModel, UserLogin, UserAll
from app.api.config import COOKIE_SETTINGS
from app.db.session import SessionLocal
import app.db.handlers.user as dbUser
import app.db.handlers.session as dbSession
from app.api.utils import getSessionToken

from fastapi.exceptions import HTTPException
from fastapi import Response, Request, APIRouter

routerUser = APIRouter()

@routerUser.post("/register/")
async def register(userData: UserAll):
    async with SessionLocal() as session:
        user = await dbUser.createUser(
            session,
            userData.login,
            userData.password,
            userData.lastName,
            userData.firstName,
            userData.birthDate,
            userData.description
        )

    if not user:
        raise HTTPException(500, "Пользователь не был добавлен")

    return Response(status_code=200) 

@routerUser.post("/login/")
async def login(userData: UserLogin, response: Response):
    async with SessionLocal() as session:
        user = await dbUser.getUserByLogin(
            session,
            userData.login,
            userData.password
        )

        if not user:
            raise HTTPException(401, "Неверный логин или пароль")

        sess = await dbSession.createSession(session, user)
        if not sess:
            raise HTTPException(500, "Не удалось создать токен сессии") 

        sessionToken = sess.sessionToken

        response.set_cookie(
            key="session",
            value=sessionToken,
            max_age=120400,
            **COOKIE_SETTINGS
        )

    return user

@routerUser.post("/logout/")
async def logout(response: Response):
    response.delete_cookie("session")

    return Response(status_code=200) 
    
@routerUser.delete("/user/")
async def user_delete(request: Request):
    async with SessionLocal() as session:
        sessionToken = getSessionToken(request)

        user = await dbUser.getUserBySessionToken(session, sessionToken)
        if not user:
            raise HTTPException(400, "Пользователь не был найден")

        user = await dbUser.deleteUser(
            session,
            user
        )

    return Response(status_code=200) 

@routerUser.patch("/user/", response_model=UserModel)
async def user_patch(request: Request, patchedUser: UserModel):
    async with SessionLocal() as session:
        sessionToken = getSessionToken(request)

        user = await dbUser.getUserBySessionToken(session, sessionToken)

        user.lastName = patchedUser.firstName
        user.firstName = patchedUser.firstName
        user.birthDate = patchedUser.birthDate
        user.description = patchedUser.description

        await session.commit()
        await session.refresh(user)

    return Response(status_code=200) 