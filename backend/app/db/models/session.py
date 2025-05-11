from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    creationDate = Column(DateTime)
    sessionToken = Column(String(36), unique=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="session")