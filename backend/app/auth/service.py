import httpx
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User
from app.auth.schemas import UserSignup, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token, create_password_reset_token, verify_password_reset_token
from app.core.email import send_reset_password_email
from app.core.config import settings

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserSignup) -> User:
    existing_user = await get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )
    
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
    )
    db.add(db_user)
    await db.flush() # Populate ID
    return db_user

async def authenticate_user(db: AsyncSession, login_data: UserLogin) -> Optional[User]:
    user = await get_user_by_email(db, login_data.email)
    if not user or not user.hashed_password:
        return None
    if not verify_password(login_data.password, user.hashed_password):
        return None
    return user

async def process_google_login(db: AsyncSession, id_token: str) -> User:
    # Verify Google token (server-side verification)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        google_data = response.json()
        email = google_data.get("email")
        google_id = google_data.get("sub")
        full_name = google_data.get("name", "")

        user = await get_user_by_email(db, email)
        
        if user:
            # Link Google account if not already linked
            if not user.google_id:
                user.google_id = google_id
                await db.flush()
        else:
            # Create new user via Google
            user = User(
                email=email,
                full_name=full_name,
                google_id=google_id,
                is_active=True,
                is_verified=True # Google emails are verified
            )
            db.add(user)
            await db.flush()
            
        return user

async def request_password_reset(db: AsyncSession, email: str) -> None:
    user = await get_user_by_email(db, email)
    if user:
        token = create_password_reset_token(email)
        send_reset_password_email(email, token)

async def reset_password(db: AsyncSession, token: str, new_password: str) -> bool:
    email = verify_password_reset_token(token)
    if not email:
        return False
    
    user = await get_user_by_email(db, email)
    if not user:
        return False
    
    user.hashed_password = get_password_hash(new_password)
    await db.flush()
    return True
