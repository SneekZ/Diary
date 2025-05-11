from app.db.models.user import User
from app.db.models.session import Session
from utils.sha256 import sha256

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import datetime

async def createUser(session: AsyncSession, login, password, lastName, firstName, birthDate, description) -> User:
    new_user = User(
        creationDate=datetime.datetime.now(),
        login=login,
        password=sha256(password),
        lastName=lastName,
        firstName=firstName,
        birthDate=birthDate,
        description=description
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return new_user

async def getUserById(session: AsyncSession, user_id: int) -> User | None:
    user = await session.execute(select(User).where(User.id == user_id))
    return user.scalar_one_or_none()

async def getUserByLogin(session: AsyncSession, login: str, password: str) -> User | None:
    user = await session.execute(select(User).where(User.login==login, User.password==sha256(password)))
    return user.scalar_one_or_none()

async def getUserBySessionToken(session: AsyncSession, sessionToken: str) -> User | None:
    result = await session.execute(select(Session).where(Session.sessionToken == sessionToken).options(selectinload(Session.user)))

    result = result.scalar_one_or_none()
    if result:
        return result.user

    return None

async def patchUser(session: AsyncSession, user: User, newLastName: str | None, newFirstName: str | None, newDescription: str) -> User | None:
    if user:
        if newLastName:
            user.lastName = newLastName

        if newFirstName:
            user.firstName = newFirstName

        if newDescription:
            user.description = newDescription

        await session.commit()
        await session.refresh(user)

    return user

async def deleteUser(session: AsyncSession, user: User) -> User | None:
    if user:
        await session.delete(user)
        await session.commit()

    return user
