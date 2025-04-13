# server/app/models/content.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class QuizOption(BaseModel):
    text: str
    is_correct: bool

class QuizQuestion(BaseModel):
    question: str
    options: List[QuizOption]
    explanation: str

class Quiz(BaseModel):
    id: Optional[str] = None
    course_id: str
    module_id: str
    subtopic_id: str
    questions: List[QuizQuestion]
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class Project(BaseModel):
    id: Optional[str] = None
    course_id: str
    module_id: str
    subtopic_id: str
    title: str
    introduction: str
    requirements: str
    steps: str
    success_criteria: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class Content(BaseModel):
    id: Optional[str] = None
    course_id: str
    module_id: str
    subtopic_id: str
    markdown_content: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)