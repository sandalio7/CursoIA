# server/app/api/endpoints/courses.py
from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any

from app.models.course import Course
from app.services.db_service import Database
from app.services.ai_provider import get_ai_provider
import json

router = APIRouter()
ai_provider = get_ai_provider()

@router.get("/", response_description="Obtener todos los cursos")
async def get_courses():
    courses = await Database.get_courses()
    return {"courses": courses}

@router.get("/{course_id}", response_description="Obtener un curso por ID")
async def get_course(course_id: str):
    course = await Database.get_course(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail=f"Curso con ID {course_id} no encontrado")
    return course

@router.post("/", response_description="Crear un nuevo curso")
async def create_course(
    topic: str = Body(...),
    user_profile: str = Body(...),
    learning_goal: str = Body(...),
    additional_options: str = Body(None)
):
    try:
        # Generar estructura del curso usando el modelo de IA
        course_structure_json = await ai_provider.generate_course_structure(
            topic, user_profile, learning_goal, additional_options
        )
        
        # Intentar parsear la respuesta del modelo
        try:
            # A veces los modelos devuelven texto alrededor del JSON
            course_structure_json = course_structure_json.strip()
            # Intentar encontrar el primer { y el último }
            start_idx = course_structure_json.find('{')
            end_idx = course_structure_json.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                course_structure_json = course_structure_json[start_idx:end_idx]
            
            course_structure = json.loads(course_structure_json)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error al parsear la estructura del curso: {str(e)}. Respuesta recibida: {course_structure_json[:100]}..."
            )
        
        # Crear el objeto del curso
        course_data = {
            "title": course_structure.get("title", f"Curso sobre {topic}"),
            "description": course_structure.get("description", ""),
            "modules": course_structure.get("modules", []),
            "topic": topic,
            "user_profile": user_profile,
            "learning_goal": learning_goal,
            "additional_options": additional_options
        }
        
        # Guardar el curso en la base de datos
        created_course = await Database.create_course(course_data)
        return created_course
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el curso: {str(e)}")

@router.delete("/{course_id}", response_description="Eliminar un curso")
async def delete_course(course_id: str):
    deleted = await Database.delete_course(course_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Curso con ID {course_id} no encontrado")
    return {"message": "Curso eliminado correctamente"}