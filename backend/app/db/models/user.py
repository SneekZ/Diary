from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    creationDate = Column(DateTime)
    login = Column(String(32), unique=True)
    password = Column(String(256))
    lastName = Column(String(32))
    firstName = Column(String(32))
    birthDate = Column(Date)
    description = Column(String(256))
    
    session = relationship("Session", back_populates="user")
    note= relationship("Note", back_populates="user")