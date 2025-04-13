import os
import subprocess
import sys
import platform

# Colores para terminal
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"

def print_colored(text, color):
    print(f"{color}{text}{RESET}")

def check_python_version():
    print_colored("Verificando versión de Python...", YELLOW)
    major, minor = sys.version_info[:2]
    if major < 3 or (major == 3 and minor < 9):
        print_colored(f"❌ Se requiere Python 3.9 o superior. Versión actual: {major}.{minor}", RED)
        sys.exit(1)
    print_colored(f"✅ Versión de Python correcta: {major}.{minor}", GREEN)

def create_virtual_env():
    if os.path.exists("venv"):
        print_colored("✅ El entorno virtual ya existe", GREEN)
        return
    
    print_colored("Creando entorno virtual...", YELLOW)
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print_colored("✅ Entorno virtual creado correctamente", GREEN)
    except subprocess.CalledProcessError:
        print_colored("❌ Error al crear el entorno virtual", RED)
        sys.exit(1)

def install_dependencies():
    print_colored("Instalando dependencias...", YELLOW)
    
    # Determinar el comando para activar el entorno virtual
    if platform.system() == "Windows":
        activate_cmd = r"venv\Scripts\activate"
    else:
        activate_cmd = "source venv/bin/activate"
    
    # Instalar dependencias
    try:
        install_cmd = f"{activate_cmd} && pip install -r requirements.txt"
        if platform.system() == "Windows":
            subprocess.run(install_cmd, shell=True, check=True)
        else:
            subprocess.run(install_cmd, shell=True, executable="/bin/bash", check=True)
        print_colored("✅ Dependencias instaladas correctamente", GREEN)
    except subprocess.CalledProcessError:
        print_colored("❌ Error al instalar dependencias", RED)
        sys.exit(1)

def check_mongodb():
    print_colored("Verificando conexión a MongoDB...", YELLOW)
    try:
        import pymongo
        from pymongo.errors import ServerSelectionTimeoutError
        
        # Intentar conectar a MongoDB (con timeout corto)
        client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
        client.server_info()  # Provocará error si no puede conectar
        
        print_colored("✅ Conexión a MongoDB establecida correctamente", GREEN)
    except ServerSelectionTimeoutError:
        print_colored("❌ No se pudo conectar a MongoDB. Asegúrate de que esté instalado y en ejecución.", RED)
        print_colored("   Puedes usar MongoDB Compass o Docker para configurar MongoDB localmente.", YELLOW)
    except ImportError:
        print_colored("❓ No se pudo verificar MongoDB (pymongo no está instalado)", YELLOW)
    except Exception as e:
        print_colored(f"❓ Error al verificar MongoDB: {str(e)}", YELLOW)

def create_directory_structure():
    print_colored("Verificando estructura de directorios...", YELLOW)
    
    directories = [
        "app",
        "app/core",
        "app/api",
        "app/api/endpoints",
        "app/models",
        "app/services",
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print_colored(f"  Creado: {directory}/", YELLOW)
    
    print_colored("✅ Estructura de directorios completada", GREEN)

def main():
    print_colored("=== Configuración del Entorno de Desarrollo ===", GREEN)
    
    check_python_version()
    create_directory_structure()
    create_virtual_env()
    install_dependencies()
    check_mongodb()
    
    print_colored("\n=== Configuración Completada ===", GREEN)
    print_colored("\nPara iniciar el servidor de desarrollo:", YELLOW)
    
    if platform.system() == "Windows":
        print_colored("  venv\\Scripts\\activate && python -m uvicorn main:app --reload", GREEN)
    else:
        print_colored("  source venv/bin/activate && python -m uvicorn main:app --reload", GREEN)

if __name__ == "__main__":
    main()