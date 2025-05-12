from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String, TIMESTAMP
from sqlalchemy.orm import relationship
from app.db.session import Base

class Note(Base):
    __tablename__ = "note"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    creationDate = Column(DateTime)
    dateStart = Column(TIMESTAMP(timezone=True))
    dateEnd = Column(TIMESTAMP(timezone=True))
    text = Column(Text)
    color = Column(String(6))

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="note")