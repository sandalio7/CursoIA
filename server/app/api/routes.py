# server/app/api/routes.py
from fastapi import APIRouter

from app.api.endpoints import courses, content

api_router = APIRouter()
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(content.router, prefix="/content", tags=["content"])