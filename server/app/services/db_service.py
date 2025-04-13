# server/app/services/db_service.py
import motor.motor_asyncio
from typing import Dict, List, Optional
from bson import ObjectId
from datetime import datetime

from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

# Clase auxiliar para manejar ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")
    
    # Añadimos estos métodos para hacerlo serializable
    def __str__(self):
        return str(self)
    
    def __repr__(self):
        return str(self)

# Función para convertir _id a id en documentos
def fix_id(obj):
    if isinstance(obj, dict) and '_id' in obj:
        obj['id'] = str(obj['_id'])
        del obj['_id']
    return obj

class Database:
    @staticmethod
    async def get_courses():
        courses = []
        cursor = db.courses.find()
        async for document in cursor:
            document = fix_id(document)
            courses.append(document)
        return courses

    @staticmethod
    async def get_course(course_id: str):
        try:
            course = await db.courses.find_one({"_id": ObjectId(course_id)})
            if course:
                return fix_id(course)
        except Exception as e:
            print(f"Error getting course: {e}")
        return None

    @staticmethod
    async def create_course(course_data: Dict):
        try:
            # Asegurarse de que no haya un id o _id en los datos
            if 'id' in course_data:
                del course_data['id']
            if '_id' in course_data:
                del course_data['_id']
            
            course_data["created_at"] = datetime.now()
            course_data["updated_at"] = datetime.now()
            
            result = await db.courses.insert_one(course_data)
            new_course = await db.courses.find_one({"_id": result.inserted_id})
            return fix_id(new_course)
        except Exception as e:
            print(f"Error creating course: {e}")
            raise

    @staticmethod
    async def update_course(course_id: str, course_data: Dict):
        try:
            # Eliminar id si está presente para evitar conflictos
            if 'id' in course_data:
                del course_data['id']
            if '_id' in course_data:
                del course_data['_id']
            
            course_data["updated_at"] = datetime.now()
            
            await db.courses.update_one(
                {"_id": ObjectId(course_id)}, {"$set": course_data}
            )
            updated_course = await db.courses.find_one({"_id": ObjectId(course_id)})
            return fix_id(updated_course)
        except Exception as e:
            print(f"Error updating course: {e}")
            return None

    @staticmethod
    async def delete_course(course_id: str):
        try:
            result = await db.courses.delete_one({"_id": ObjectId(course_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting course: {e}")
            return False

    @staticmethod
    async def get_content(course_id: str, module_id: str, subtopic_id: str):
        try:
            content = await db.contents.find_one({
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id
            })
            if content:
                return fix_id(content)
            return None
        except Exception as e:
            print(f"Error getting content: {e}")
            return None

    @staticmethod
    async def create_or_update_content(content_data: Dict):
        try:
            query = {
                "course_id": content_data["course_id"],
                "module_id": content_data["module_id"],
                "subtopic_id": content_data["subtopic_id"]
            }
            
            # Eliminar id si está presente
            if 'id' in content_data:
                del content_data['id']
            if '_id' in content_data:
                del content_data['_id']
            
            content_data["updated_at"] = datetime.now()
            
            existing = await db.contents.find_one(query)
            
            if existing:
                await db.contents.update_one(query, {"$set": content_data})
                result = await db.contents.find_one(query)
                return fix_id(result)
            else:
                content_data["created_at"] = datetime.now()
                result = await db.contents.insert_one(content_data)
                content = await db.contents.find_one({"_id": result.inserted_id})
                return fix_id(content)
        except Exception as e:
            print(f"Error creating/updating content: {e}")
            raise

    # Los métodos para quiz y project son similares
    @staticmethod
    async def get_quiz(course_id: str, module_id: str, subtopic_id: str):
        try:
            quiz = await db.quizzes.find_one({
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id
            })
            if quiz:
                return fix_id(quiz)
            return None
        except Exception as e:
            print(f"Error getting quiz: {e}")
            return None
    
    @staticmethod
    async def create_or_update_quiz(quiz_data: Dict):
        try:
            query = {
                "course_id": quiz_data["course_id"],
                "module_id": quiz_data["module_id"],
                "subtopic_id": quiz_data["subtopic_id"]
            }
            
            # Eliminar id si está presente
            if 'id' in quiz_data:
                del quiz_data['id']
            if '_id' in quiz_data:
                del quiz_data['_id']
            
            quiz_data["updated_at"] = datetime.now()
            
            existing = await db.quizzes.find_one(query)
            
            if existing:
                await db.quizzes.update_one(query, {"$set": quiz_data})
                result = await db.quizzes.find_one(query)
                return fix_id(result)
            else:
                quiz_data["created_at"] = datetime.now()
                result = await db.quizzes.insert_one(quiz_data)
                quiz = await db.quizzes.find_one({"_id": result.inserted_id})
                return fix_id(quiz)
        except Exception as e:
            print(f"Error creating/updating quiz: {e}")
            raise
            
    @staticmethod
    async def get_project(course_id: str, module_id: str, subtopic_id: str):
        try:
            project = await db.projects.find_one({
                "course_id": course_id,
                "module_id": module_id,
                "subtopic_id": subtopic_id
            })
            if project:
                return fix_id(project)
            return None
        except Exception as e:
            print(f"Error getting project: {e}")
            return None
    
    @staticmethod
    async def create_or_update_project(project_data: Dict):
        try:
            query = {
                "course_id": project_data["course_id"],
                "module_id": project_data["module_id"],
                "subtopic_id": project_data["subtopic_id"]
            }
            
            # Eliminar id si está presente
            if 'id' in project_data:
                del project_data['id']
            if '_id' in project_data:
                del project_data['_id']
            
            project_data["updated_at"] = datetime.now()
            
            existing = await db.projects.find_one(query)
            
            if existing:
                await db.projects.update_one(query, {"$set": project_data})
                result = await db.projects.find_one(query)
                return fix_id(result)
            else:
                project_data["created_at"] = datetime.now()
                result = await db.projects.insert_one(project_data)
                project = await db.projects.find_one({"_id": result.inserted_id})
                return fix_id(project)
        except Exception as e:
            print(f"Error creating/updating project: {e}")
            raise