# server/app/services/ai_provider.py
from abc import ABC, abstractmethod
import json
import asyncio
from app.core.config import settings

class AIProvider(ABC):
    @abstractmethod
    async def generate_course_structure(self, topic, user_profile, learning_goal, additional_options):
        pass
        
    @abstractmethod
    async def generate_content(self, topic, subtopic, context):
        pass
    
    @abstractmethod
    async def generate_quiz(self, topic, subtopic, content):
        pass
    
    @abstractmethod
    async def generate_practical_project(self, topic, subtopic, content):
        pass

# Implementación para OpenAI
class OpenAIProvider(AIProvider):
    def __init__(self):
        import openai
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.MAX_TOKENS

    async def generate_course_structure(self, topic, user_profile, learning_goal, additional_options):
        prompt = f"""
        Crea un curso completo sobre "{topic}".
        
        Perfil del estudiante: {user_profile}
        
        Objetivo de aprendizaje: {learning_goal}
        
        Opciones adicionales: {additional_options}
        
        Estructura requerida:
        - Genera solo la estructura del curso completo con módulos y subtemas
        - No generes el contenido detallado
        - Formato: JSON con la siguiente estructura:
        {{
          "title": "Título del curso",
          "description": "Descripción general del curso",
          "modules": [
            {{
              "id": "module-1",
              "title": "Título del módulo",
              "description": "Descripción breve del módulo",
              "order": 1,
              "subtopics": [
                {{
                  "id": "subtopic-1-1",
                  "title": "Título del subtema",
                  "description": "Descripción breve del subtema"
                }}
              ]
            }}
          ]
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Eres un experto en diseño curricular y educación."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=self.max_tokens
        )
        
        return response.choices[0].message.content
        
    async def generate_content(self, topic, subtopic, context):
        prompt = f"""
        Genera contenido detallado para el subtema "{subtopic}" dentro del tema "{topic}".
        
        Contexto adicional: {context}
        
        El contenido debe ser educativo, claro y orientado a un público hispanohablante.
        Incluye ejemplos prácticos y explicaciones detalladas.
        Usa formato Markdown para estructurar el contenido.
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Eres un experto en educación con amplio conocimiento en múltiples disciplinas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=self.max_tokens
        )
        
        return response.choices[0].message.content
    
    async def generate_quiz(self, topic, subtopic, content):
        prompt = f"""
        Crea un mini test de opción múltiple (4-5 preguntas) sobre el siguiente contenido:
        Tema: {topic}
        Subtema: {subtopic}
        
        Contenido de referencia: {content[:1000]}
        
        Formato requerido (JSON):
        {{
          "questions": [
            {{
              "question": "Pregunta 1",
              "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
              "correctAnswer": "Opción correcta",
              "explanation": "Explicación de por qué esta es la respuesta correcta"
            }}
          ]
        }}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Eres un experto educador especializado en crear evaluaciones efectivas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=self.max_tokens
        )
        
        return response.choices[0].message.content
    
    async def generate_practical_project(self, topic, subtopic, content):
        prompt = f"""
        Crea un proyecto práctico para aplicar los conocimientos de:
        Tema: {topic}
        Subtema: {subtopic}
        
        El proyecto debe ser:
        1. Realista y aplicable al mundo real
        2. Detallado con pasos claros a seguir
        3. Ajustado al nivel del estudiante (intermedio)
        4. Estructurado en secciones: Introducción, Requisitos, Pasos, Criterios de éxito
        
        Usa formato Markdown para estructurar el contenido.
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Eres un experto en desarrollo de proyectos educativos prácticos."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=self.max_tokens
        )
        
        return response.choices[0].message.content

# Implementación para Google Gemini
class GeminiProvider(AIProvider):
    def __init__(self):
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.genai = genai
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
    async def generate_course_structure(self, topic, user_profile, learning_goal, additional_options):
        prompt = f"""
        Crea un curso completo sobre "{topic}".
        
        Perfil del estudiante: {user_profile}
        
        Objetivo de aprendizaje: {learning_goal}
        
        Opciones adicionales: {additional_options}
        
        Estructura requerida:
        - Genera solo la estructura del curso completo con módulos y subtemas
        - No generes el contenido detallado
        - Formato: JSON con la siguiente estructura:
        {{
          "title": "Título del curso",
          "description": "Descripción general del curso",
          "modules": [
            {{
              "id": "module-1",
              "title": "Título del módulo",
              "description": "Descripción breve del módulo",
              "order": 1,
              "subtopics": [
                {{
                  "id": "subtopic-1-1",
                  "title": "Título del subtema",
                  "description": "Descripción breve del subtema"
                }}
              ]
            }}
          ]
        }}

        SOLO responde con el JSON, sin texto adicional.
        """
        
        # Como el método es asíncrono pero la API de Gemini no lo es,
        # usamos run_in_executor para hacerlo asíncrono
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.model.generate_content(prompt)
        )
        return response.text

    async def generate_content(self, topic, subtopic, context):
        prompt = f"""
        Genera contenido detallado para el subtema "{subtopic}" dentro del tema "{topic}".
        
        Contexto adicional: {context}
        
        INSTRUCCIONES IMPORTANTES:
        1. El contenido debe ser educativo, claro y orientado a un público hispanohablante.
        2. Incluye ejemplos prácticos y explicaciones detalladas.
        3. Usa formato Markdown para estructurar el contenido.
        4. Comienza DIRECTAMENTE con el contenido en Markdown, sin introducciones como "Aquí tienes", "He creado", etc.
        5. Inicia el contenido directamente con un encabezado de nivel 2 (##) con el título del subtema.
        6. No incluyas mensajes introductorios o explicaciones sobre el formato.
        
        ESTRUCTURA RECOMENDADA:
        ## [Título del subtema]
        
        [Introducción y conceptos clave]
        
        ### [Primer subtópico]
        
        [Contenido]
        
        ### [Segundo subtópico]
        
        [Contenido]
        
        [Ejemplos prácticos]
        
        [Resumen o conclusión]
        """
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.model.generate_content(prompt)
        )
        return response.text
        
    async def generate_quiz(self, topic, subtopic, content):
        prompt = f"""
        Crea un mini test de opción múltiple (4-5 preguntas) sobre el siguiente contenido:
        Tema: {topic}
        Subtema: {subtopic}
        
        Contenido de referencia: {content[:1000]}
        
        Formato requerido (JSON):
        {{
          "questions": [
            {{
              "question": "Pregunta 1",
              "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
              "correctAnswer": "Opción correcta",
              "explanation": "Explicación de por qué esta es la respuesta correcta"
            }}
          ]
        }}
        """
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.model.generate_content(prompt)
        )
        return response.text
    
    async def generate_practical_project(self, topic, subtopic, content):
        prompt = f"""
        Crea un proyecto práctico para aplicar los conocimientos de:
        Tema: {topic}
        Subtema: {subtopic}
        
        El proyecto debe ser:
        1. Realista y aplicable al mundo real
        2. Detallado con pasos claros a seguir
        3. Ajustado al nivel del estudiante (intermedio)
        4. Estructurado en secciones: Introducción, Requisitos, Pasos, Criterios de éxito
        
        Usa formato Markdown para estructurar el contenido.
        """
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.model.generate_content(prompt)
        )
        return response.text

# Factory para seleccionar el proveedor correcto
def get_ai_provider():
    provider_name = settings.AI_PROVIDER.lower()
    if provider_name == "openai":
        return OpenAIProvider()
    elif provider_name == "gemini":
        return GeminiProvider()
    # Añadir más proveedores según sea necesario
    else:
        # Proveedor por defecto
        return GeminiProvider()