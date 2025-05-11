from app.db.session import SessionLocal
import app.db.handlers.note as dbNote
import app.db.handlers.user as dbUser
from app.api.models.note import NoteModel
from app.api.utils import getSessionToken

from fastapi.exceptions import HTTPException
from fastapi import Request, APIRouter, Response

routerNote = APIRouter()

@routerNote.get("/note/", response_model=list[NoteModel])
async def getNotes(request: Request):
    sessionToken = getSessionToken(request)

    async with SessionLocal() as session:
        user = await dbUser.getUserBySessionToken(session, sessionToken)
        if not user:
            raise HTTPException(401, "Пользователь не найден")

        notes = await dbNote.getNotesByUser(session, user)
        noteModels: list[NoteModel]  = []

        noteModels = [
            NoteModel(
                id=note.id,
                text=note.text,
                color=note.color,
                dateStart=note.dateStart,
                dateEnd=note.dateEnd
            )
            for note in notes
        ]


    return noteModels

@routerNote.post("/note/")
async def postNote(request: Request, noteModel: NoteModel):
    sessionToken = getSessionToken(request)

    async with SessionLocal() as session:
        user = await dbUser.getUserBySessionToken(session, sessionToken)
        if not user:
            raise HTTPException(401, "Пользователь не найден")

        note = await dbNote.createNote(
            session,
            user,
            noteModel.dateStart,
            noteModel.dateEnd,
            noteModel.text,
            noteModel.color
        )
        if not note:
            raise HTTPException(500, "Не удалось создать запись")

    return note

@routerNote.patch("/note/")
async def patchNote(newNote: NoteModel, request: Request):
    sessionToken = getSessionToken(request)

    async with SessionLocal() as session:
        user = await dbUser.getUserBySessionToken(session, sessionToken)
        if not user:
            raise HTTPException(401, "Пользователь не найден")

        note = await dbNote.getNoteByIdAndUser(session, user, newNote.id)
        if not note:
            raise HTTPException(404, "Запись не найдена")

        note = await dbNote.patchNote(
            session,
            note,
            newNote.dateStart,
            newNote.dateEnd,
            newNote.text,
            newNote.color
        )
        if not note:
            raise HTTPException(500, "Не удалось обновить запись")

    return note

@routerNote.delete("/note/{noteId}")
async def patchNote(noteId: int, request: Request):
    sessionToken = getSessionToken(request)

    async with SessionLocal() as session:
        user = await dbUser.getUserBySessionToken(session, sessionToken)
        if not user:
            raise HTTPException(401, "Пользователь не найден")

        note = await dbNote.getNoteByIdAndUser(session, user, noteId)
        if not note:
            raise HTTPException(404, "Запись не найдена")

        note = await dbNote.deleteNote(session, note)
        if not note:
            raise HTTPException(500, "Не удалось удалить запись")

    return Response(status_code=200) 
