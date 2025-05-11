from pydantic import BaseModel, Field
from datetime import datetime

class NoteModel(BaseModel):
    id: int = Field(...)
    dateStart: datetime = Field(...)
    dateEnd: datetime = Field(...)
    text: str = Field(..., min_length=0, max_length=256)
    color: str = Field(..., min_length=6, max_length=6)