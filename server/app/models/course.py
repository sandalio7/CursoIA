# server/app/models/course.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class SubTopic(BaseModel):
    id: str
    title: str
    description: str
    content: Optional[str] = None
    has_quiz: bool = False
    has_project: bool = False

class Module(BaseModel):
    id: str
    title: str
    description: str
    order: int
    subtopics: List[SubTopic]

class Course(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    modules: List[Module]
    topic: str
    user_profile: str
    learning_goal: str
    additional_options: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        schema_extra = {
            "example": {
                "title": "Introducción a la Programación con Python",
                "description": "Un curso completo para principiantes que quieren aprender Python desde cero.",
                "topic": "Python",
                "user_profile": "Principiante sin experiencia previa en programación",
                "learning_goal": "Dominar los fundamentos de Python y crear pequeñas aplicaciones",
                "additional_options": "Enfoque práctico con muchos ejemplos",
                "modules": [
                    {
                        "id": "module-1",
                        "title": "Fundamentos de Python",
                        "description": "Conceptos básicos para entender Python",
                        "order": 1,
                        "subtopics": [
                            {
                                "id": "subtopic-1-1",
                                "title": "Instalación y configuración",
                                "description": "Cómo instalar Python y configurar el entorno de desarrollo",
                                "content": None,
                                "has_quiz": False,
                                "has_project": False
                            }
                        ]
                    }
                ]
            }
        }