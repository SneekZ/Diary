from pydantic import BaseModel, Field, PastDate

class UserLogin(BaseModel):
    login: str = Field(..., min_length=4, max_length=16)
    password: str = Field(..., min_length=4, max_length=16)

class UserModel(BaseModel):
    firstName: str = Field(..., min_length=3, max_length=16)
    lastName: str = Field(..., min_length=3, max_length=16)
    birthDate: PastDate = Field(...)
    description: str = Field("")

class UserAll(UserLogin, UserModel):
    pass
