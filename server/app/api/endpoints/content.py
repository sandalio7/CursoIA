# server/app/api/endpoints/content.py
from fastapi import APIRouter, HTTPException, Path
from typing import Dict

from app.services.db_service import Database
from app.services.ai_provider import get_ai_provider
import json

router = APIRouter()
ai_provider = get_ai_provider()

@router.get("/{course_id}/{module_id}/{subtopic_id}", response_description="Obtener contenido de un subtema")
async def get_content(
    course_id: str = Path(..., description="ID del curso"),
    module_id: str = Path(..., description="ID del módulo"),
    subtopic_id: str = Path(..., description="ID del subtema")
):
    # Buscar el curso
    course = await Database.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Curso con ID {course_id} no encontrado")
    
    # Buscar el módulo y subtema específicos
    module = None
    subtopic = None
    
    for m in course.get("modules", []):
        if m.get("id") == module_id:
            module = m
            for st in m.get("subtopics", []):
                if st.get("id") == subtopic_id:
                    subtopic = st
                    break
            break
    
    if not module or not subtopic:
        raise HTTPException(status_code=404, detail="Módulo o subtema no encontrado")
    
    # Verificar si ya existe contenido para este subtema
    content = await Database.get_content(course_id, module_id, subtopic_id)
    
    # Si no existe contenido, generarlo con IA
    if not content:
        try:
            # Preparar contexto para la generación
            context = {
                "course_title": course.get("title", ""),
                "course_description": course.get("description", ""),
                "module_title": module.get("title", ""),
                "module_description": module.get("description", ""),
                "subtopic_title": subtopic.get("title", ""),
                "subtopic_description": subtopic.get("description", ""),
                "user_profile": course.get("user_profile", ""),
                "learning_goal": course.get("learning_goal", "")
            }
            
            # Generar contenido con IA
            markdown_content = await ai_provider.generate_content(
                course.get("topic", ""), 
                subtopic.get("title", ""), 
                json.dumps(context)
            )
            
            if not markdown_content or markdown_content.strip() == "":
                raise HTTPException(
                    status_code=500,
                    detail=f"El proveedor de IA generó contenido vacío. Verifica la configuración de la API."
                )

            # Guardar el contenido en la base de datos
            content_data = {
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id,
                "markdown_content": markdown_content
            }
            
            content = await Database.create_or_update_content(content_data)
            
            # Actualizar el campo has_content en el curso
            for m in course.get("modules", []):
                if m.get("id") == module_id:
                    for st in m.get("subtopics", []):
                        if st.get("id") == subtopic_id:
                            st["content"] = "generated"
                            break
            
            await Database.update_course(course_id, course)
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error al generar el contenido: {str(e)}"
            )
    
    return content

@router.get("/{course_id}/{module_id}/{subtopic_id}/quiz", response_description="Obtener quiz de un subtema")
async def get_quiz(
    course_id: str = Path(..., description="ID del curso"),
    module_id: str = Path(..., description="ID del módulo"),
    subtopic_id: str = Path(..., description="ID del subtema")
):
    # Buscar el curso
    course = await Database.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Curso con ID {course_id} no encontrado")
    
    # Buscar si ya existe un quiz
    quiz = await Database.get_quiz(course_id, module_id, subtopic_id)
    
    # Si no existe quiz, generarlo con IA
    if not quiz:
        # Primero necesitamos el contenido para generar el quiz
        content = await Database.get_content(course_id, module_id, subtopic_id)

        if not content or not content.get("markdown_content"):
            raise HTTPException(
                status_code=400, 
                detail="El contenido es nulo o vacío. No se puede generar el quiz."
            )

        if not content:
            raise HTTPException(status_code=404, detail="No hay contenido para generar el quiz")
        
        try:
            # Generar quiz con IA
            quiz_json = await ai_provider.generate_quiz(
                course.get("topic", ""),
                content.get("subtopic_title", ""),
                content.get("markdown_content", "")
            )
            
            # Parsear el JSON del quiz
            try:
                quiz_json = quiz_json.strip()
                start_idx = quiz_json.find('{')
                end_idx = quiz_json.rfind('}') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    quiz_json = quiz_json[start_idx:end_idx]
                
                quiz_data = json.loads(quiz_json)
            except json.JSONDecodeError as e:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Error al parsear el quiz: {str(e)}"
                )
            
            # Formatear las preguntas según nuestro modelo
            formatted_questions = []
            for q in quiz_data.get("questions", []):
                options = []
                correct_option = q.get("correctAnswer", "")
                
                for opt in q.get("options", []):
                    options.append({
                        "text": opt,
                        "is_correct": opt == correct_option
                    })
                
                formatted_questions.append({
                    "question": q.get("question", ""),
                    "options": options,
                    "explanation": q.get("explanation", "")
                })
            
            # Guardar el quiz
            quiz_data = {
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id,
                "questions": formatted_questions
            }
            
            quiz = await Database.create_or_update_quiz(quiz_data)
            
            # Actualizar el campo has_quiz en el curso
            for m in course.get("modules", []):
                if m.get("id") == module_id:
                    for st in m.get("subtopics", []):
                        if st.get("id") == subtopic_id:
                            st["has_quiz"] = True
                            break
            
            await Database.update_course(course_id, course)
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error al generar el quiz: {str(e)}"
            )
    
    return quiz

@router.get("/{course_id}/{module_id}/{subtopic_id}/project", response_description="Obtener proyecto práctico de un subtema")
async def get_project(
    course_id: str = Path(..., description="ID del curso"),
    module_id: str = Path(..., description="ID del módulo"),
    subtopic_id: str = Path(..., description="ID del subtema")
):
    # Buscar el curso
    course = await Database.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail=f"Curso con ID {course_id} no encontrado")
    
    # Buscar si ya existe un proyecto
    project = await Database.get_project(course_id, module_id, subtopic_id)
    
    # Si no existe proyecto, generarlo con IA
    if not project:
        # Primero necesitamos el contenido para generar el proyecto
        content = await Database.get_content(course_id, module_id, subtopic_id)
        if not content:
            raise HTTPException(status_code=404, detail="No hay contenido para generar el proyecto")
        
        try:
            # Generar proyecto con IA
            project_markdown = await ai_provider.generate_practical_project(
                course.get("topic", ""),
                content.get("subtopic_title", ""),
                content.get("markdown_content", "")
            )
            
            # Extraer secciones del markdown
            lines = project_markdown.split('\n')
            title = lines[0].replace('# ', '') if lines and lines[0].startswith('# ') else "Proyecto Práctico"
            
            introduction = ""
            requirements = ""
            steps = ""
            success_criteria = ""
            
            current_section = "introduction"
            
            for line in lines[1:]:
                if line.startswith('## ') or line.startswith('# '):
                    section_title = line.lower()
                    if 'introduc' in section_title or 'resumen' in section_title:
                        current_section = "introduction"
                    elif 'requisit' in section_title or 'requerim' in section_title:
                        current_section = "requirements"
                    elif 'paso' in section_title or 'instrucc' in section_title:
                        current_section = "steps"
                    elif 'criterio' in section_title or 'éxito' in section_title:
                        current_section = "success_criteria"
                elif current_section == "introduction":
                    introduction += line + '\n'
                elif current_section == "requirements":
                    requirements += line + '\n'
                elif current_section == "steps":
                    steps += line + '\n'
                elif current_section == "success_criteria":
                    success_criteria += line + '\n'
            
            # Guardar el proyecto
            project_data = {
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id,
                "title": title,
                "introduction": introduction.strip(),
                "requirements": requirements.strip(),
                "steps": steps.strip(),
                "success_criteria": success_criteria.strip()
            }
            
            project = await Database.create_or_update_project(project_data)
            
            # Actualizar el campo has_project en el curso
            for m in course.get("modules", []):
                if m.get("id") == module_id:
                    for st in m.get("subtopics", []):
                        if st.get("id") == subtopic_id:
                            st["has_project"] = True
                            break
            
            await Database.update_course(course_id, course)
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error al generar el proyecto: {str(e)}"
            )
    
    return project