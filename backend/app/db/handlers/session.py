from app.db.models.user import User
from app.db.models.session import Session
from utils.sha256 import sha256

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import datetime
import uuid

async def createSession(session: AsyncSession, user: User) -> Session:
    sessionToken = str(uuid.uuid4())
    new_session = Session(
        creationDate=datetime.datetime.now(),
        sessionToken=sessionToken,
        user_id=user.id,
        user=user
    )

    session.add(new_session)
    await session.commit()
    await session.refresh(new_session)

    return new_session

async def getSession(session: AsyncSession, user: User) -> Session | None:
    sess = await session.execute(select(Session).where(Session.user == user).options(selectinload(Session.user)))
    return sess.scalar_one_or_none()

async def deleteSession(session: AsyncSession, user: User) -> Session | None:
    sess = await getSession(session, user)

    if sess:
        await session.delete(sess)
        await session.commit()

    return sess
