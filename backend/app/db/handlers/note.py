from app.db.models.user import User
from app.db.models.note import Note

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import datetime

async def createNote(session: AsyncSession, user: User, dateStart: str, dateEnd: str, text: str, color: str) -> Note:
    new_note= Note(
        creationDate=datetime.datetime.now(),
        dateStart=dateStart,
        dateEnd=dateEnd,
        text=text,
        color=color,
        user_id=user.id,
        user=user
    )

    session.add(new_note)
    await session.commit()
    await session.refresh(new_note)

    return new_note

async def getNoteById(session: AsyncSession, note_id: int) -> Note | None:
    result= await session.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    return note

async def getNotesByUser(session: AsyncSession, user: User) -> list[Note] | None:
    result = await session.execute(select(Note).where(Note.user == user))
    notes = result.scalars().all()
    return notes

async def getNoteByIdAndUser(session: AsyncSession, user: User, noteId: int) -> Note | None:
    result = await session.execute(select(Note).where(Note.id == noteId, Note.user == user))
    note = result.scalar_one_or_none()
    return note

async def patchNote(
        session: AsyncSession, 
        note: Note, 
        newDateStart: datetime.datetime | None, 
        newDateEnd: datetime.datetime | None, 
        newText: str | None, 
        newColor: str | None
        ) -> Note | None:
    if note:
        if newDateStart:
            note.dateStart = newDateStart
        
        if newDateEnd:
            note.dateEnd = newDateEnd

        if newText:
            note.text = newText

        if newColor:
            note.color = newColor
        
        await session.commit()
        await session.refresh(note)

    return note

async def deleteNote(session: AsyncSession, note: Note) -> Note | None:
    if note:
        await session.delete(note)
        await session.commit()

    return note
