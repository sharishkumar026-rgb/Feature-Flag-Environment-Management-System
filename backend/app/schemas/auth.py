from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


# =========================
# REGISTER
# =========================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int 
    is_active: bool = True


# =========================
# LOGIN
# =========================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# ROLE RESPONSE
# =========================

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# =========================
# USER RESPONSE
# =========================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: RoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# REGISTER RESPONSE
# =========================

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse


# =========================
# LOGIN RESPONSE
# =========================

class LoginResponse(BaseModel):
    success: bool
    message: str
    access_token: str
    token_type: str
    user: UserResponse
    


# =========================
# LOGOUT RESPONSE
# =========================

class LogoutResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse


# =========================
# ME RESPONSE
# =========================

class UserMeResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse