from pydantic import BaseModel, EmailStr
from typing import Optional
from typing import Dict, Any

class UserBase(BaseModel):
    email: EmailStr


class UserLogin(UserBase):
    password: str


class UserCreate(UserBase):
    password: str
    firstname: str
    lastname: str


class UserInDB(UserBase):
    firstname: str
    lastname: str
    reset_token: Optional[str] = None


class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class Query(BaseModel):
    query: str
    

class Item(BaseModel):
    language: str
    
class openAIsent(BaseModel):
    query: str
    language: str
    
class PatientInfo(BaseModel):
    patientInfo: Dict[str, Any]