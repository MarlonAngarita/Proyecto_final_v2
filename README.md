# 🎮 KÜTSA - Plataforma Educativa Gamificada

<div align="center">
  <img src="Frontend/public/assets/Logo_claro.png" alt="Kütsa Logo" width="200">
  
  [![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
  [![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
</div>

## 📋 Descripción

**Kütsa** es una plataforma educativa moderna que combina el aprendizaje tradicional con mecánicas de gamificación inspiradas en los videojuegos retro. El sistema permite a estudiantes, profesores y administradores interactuar en un entorno educativo dinámico con sistema de rachas, medallas, desafíos y foros comunitarios.

### 🌟 Características Principales

- 🎯 **Sistema de Gamificación**: Rachas diarias, medallas por logros, sistema de puntos
- 📚 **Gestión de Cursos**: Módulos organizados, evaluaciones interactivas, seguimiento de progreso
- 👥 **Roles Diferenciados**: Estudiantes, profesores y administradores con funcionalidades específicas
- 💬 **Foro Comunitario**: Espacio de discusión y colaboración entre usuarios
- 🎨 **Diseño Retro**: Interfaz inspirada en videojuegos clásicos de los 80s-90s
- 📱 **Responsive Design**: Optimizada para dispositivos móviles y desktop
- 🔐 **Autenticación JWT**: Sistema seguro de autenticación y autorización

---

## 👥 Equipo de Desarrollo

### Full Stack Developers

| Desarrollador | Rol | Especialización |
|---------------|-----|-----------------|
| **Marlon Estid Gómez** | Full Stack Developer | Frontend & Backend |
| **Elaine Liseth Leal** | Full Stack Developer | Frontend & Backend |
| **Julián Felipe Albarracín** | Full Stack Developer | Frontend & Backend |
| **Heidy Alejandra Caicedo** | Full Stack Developer | Frontend & Backend |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         KÜTSA PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (Angular 20)          │  BACKEND (Django REST)        │
│  ├── Components                 │  ├── Models                   │
│  │   ├── Landing Page           │  │   ├── User Management      │
│  │   ├── Authentication         │  │   ├── Course System        │
│  │   ├── User Dashboard         │  │   ├── Gamification         │
│  │   ├── Professor Panel        │  │   └── Forum System         │
│  │   └── Admin Panel            │  │                            │
│  ├── Services                   │  ├── ViewSets (API)           │
│  │   ├── Auth Service           │  │   ├── User API             │
│  │   ├── Course Service         │  │   ├── Course API           │
│  │   ├── Gamification           │  │   ├── Gamification API     │
│  │   └── Forum Service          │  │   └── Forum API            │
│  ├── Guards & Interceptors      │  ├── Serializers              │
│  └── Routing System             │  └── Authentication (JWT)     │
├─────────────────────────────────────────────────────────────────┤
│                    DATABASE (MySQL)                            │
│  Users | Courses | Modules | Quizzes | Medals | Forum | etc.   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular 20**: Framework principal para SPA
- **TypeScript**: Lenguaje de programación tipado
- **HTML5 & CSS3**: Estructura y estilos
- **RxJS**: Programación reactiva
- **Angular Router**: Navegación y routing
- **HTTP Client**: Comunicación con API REST

### Backend
- **Django 5.0**: Framework web de Python
- **Django REST Framework**: API REST
- **JWT Authentication**: Autenticación basada en tokens
- **MySQL**: Base de datos relacional
- **Python 3.11**: Lenguaje de programación

### Herramientas de Desarrollo
- **Node.js**: Entorno de ejecución para frontend
- **npm**: Gestor de paquetes
- **pip**: Gestor de paquetes de Python
- **Git**: Control de versiones

---

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- Python (v3.11 o superior)
- MySQL (v8.0 o superior)
- Git

### 🔧 Configuración del Backend (Django)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Proyecto_final_v2
   ```

2. **Crear entorno virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar base de datos**
   ```bash
   # Crear base de datos MySQL
   mysql -u root -p
   CREATE DATABASE kutsadb_v3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'kutsa_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON kutsadb_v3.* TO 'kutsa_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   
   # Ejecutar migraciones
   python manage.py migrate
   ```

5. **Cargar datos iniciales (opcional)**
   ```bash
   mysql -u kutsa_user -p kutsadb_v3 < DB/kutsadb_v3.sql
   ```

6. **Crear superusuario**
   ```bash
   python manage.py createsuperuser
   ```

7. **Ejecutar servidor de desarrollo**
   ```bash
   python manage.py runserver
   ```

### 🎨 Configuración del Frontend (Angular)

1. **Navegar al directorio frontend**
   ```bash
   cd Frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo**
   ```bash
   ng serve
   ```

4. **Acceder a la aplicación**
   ```
   http://localhost:4200
   ```

---

## 🗂️ Estructura del Proyecto

```
Proyecto_final_v2/
├── 📁 Backend/                 # API Django REST
│   ├── models.py              # Modelos de base de datos
│   ├── views.py               # Vistas de API
│   ├── serializers.py         # Serializadores
│   ├── routers.py             # Configuración de rutas
│   └── migrations/            # Migraciones de DB
├── 📁 Frontend/               # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/         # Componentes de páginas
│   │   │   ├── services/      # Servicios de datos
│   │   │   ├── guards/        # Guards de seguridad
│   │   │   └── interceptors/  # Interceptors HTTP
│   │   └── assets/            # Recursos estáticos
│   ├── angular.json           # Configuración Angular
│   └── package.json           # Dependencias npm
├── 📁 kustsa/                 # Configuración Django
│   ├── settings.py            # Configuración principal
│   ├── urls.py                # URLs principales
│   └── wsgi.py                # Configuración WSGI
├── 📁 DB/                     # Base de datos
│   └── kutsadb_v3.sql         # Schema de BD
├── 📄 requirements.txt        # Dependencias Python
├── 📄 manage.py               # Gestor Django
└── 📄 README.md               # Este archivo
```

---

## 🎯 Funcionalidades por Rol

### 👨‍🎓 Estudiantes
- ✅ Registro e inicio de sesión
- ✅ Dashboard personalizado con progreso
- ✅ Sistema de rachas diarias
- ✅ Colección de medallas y logros
- ✅ Acceso a cursos y módulos
- ✅ Evaluaciones interactivas (Quiz)
- ✅ Participación en foros
- ✅ Seguimiento de progreso académico

### 👨‍🏫 Profesores
- ✅ Panel de gestión de cursos
- ✅ Creación y edición de módulos
- ✅ Diseño de evaluaciones
- ✅ Gestión de desafíos
- ✅ Moderación de foros
- ✅ Seguimiento de estudiantes
- ✅ Estadísticas de rendimiento

### 👑 Administradores
- ✅ Gestión completa de usuarios
- ✅ Configuración del sistema
- ✅ Gestión de roles y permisos
- ✅ Estadísticas globales
- ✅ Configuración de gamificación
- ✅ Moderación general del sistema

---

## 🎮 Sistema de Gamificación

### 🔥 Sistema de Rachas
- **Rachas Diarias**: Mantén tu racha iniciando sesión cada día
- **Multiplicadores**: Rachas más largas otorgan más puntos
- **Recompensas**: Desbloquea medallas especiales por rachas épicas

### 🏆 Sistema de Medallas
- **Medallas de Progreso**: Por completar cursos y módulos
- **Medallas de Participación**: Por actividad en foros
- **Medallas Especiales**: Por logros únicos y hitos importantes
- **Medallas de Racha**: Por mantener rachas consecutivas

### 🎯 Desafíos
- **Desafíos Diarios**: Retos de programación y lógica
- **Desafíos Semanales**: Proyectos más complejos
- **Desafíos Especiales**: Eventos temáticos y competiciones

---

## 🔌 API Endpoints

### Autenticación
```
POST /api/v1/login/          # Iniciar sesión
POST /api/v1/register/       # Registrar usuario
POST /api/v1/logout/         # Cerrar sesión
```

### Usuarios
```
GET    /api/v1/usuarios/     # Listar usuarios
GET    /api/v1/usuarios/{id} # Obtener usuario
PUT    /api/v1/usuarios/{id} # Actualizar usuario
DELETE /api/v1/usuarios/{id} # Eliminar usuario
```

### Cursos y Módulos
```
GET    /api/v1/cursos/       # Listar cursos
POST   /api/v1/cursos/       # Crear curso
GET    /api/v1/modulos/      # Listar módulos
POST   /api/v1/modulos/      # Crear módulo
```

### Gamificación
```
GET    /api/v1/rachas/       # Obtener rachas
POST   /api/v1/rachas/       # Actualizar racha
GET    /api/v1/medallas/     # Listar medallas
GET    /api/v1/desafios/     # Listar desafíos
```

### Foro
```
GET    /api/v1/foro/         # Listar hilos
POST   /api/v1/foro/         # Crear hilo
GET    /api/v1/foro/{id}     # Obtener hilo
POST   /api/v1/foro/{id}/responder/ # Responder hilo
```

---

## 🧪 Testing

### Frontend Testing
```bash
cd Frontend
npm run test                 # Ejecutar tests unitarios
npm run test:coverage        # Tests con cobertura
npm run e2e                  # Tests end-to-end
```

### Backend Testing
```bash
python manage.py test        # Ejecutar tests de Django
python manage.py test Backend.tests  # Tests específicos
```

---

## 🚀 Despliegue

### Desarrollo Local
```bash
# Backend
python manage.py runserver 0.0.0.0:8000

# Frontend
cd Frontend
ng serve --host 0.0.0.0 --port 4200
```

### Producción
1. **Backend**: Configurar variables de entorno para producción
2. **Frontend**: Build de producción con `ng build --prod`
3. **Base de Datos**: Configurar MySQL en servidor
4. **Servidor Web**: Nginx/Apache para servir archivos estáticos
5. **WSGI**: Gunicorn para servir Django

---

## 📝 Variables de Entorno

### Backend (.env)
```env
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=mysql://kutsa_user:your_password@localhost/kutsadb_v3
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
JWT_SECRET_KEY=your-jwt-secret
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  appName: 'Kütsa'
};
```

---

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de conexión a la base de datos**
```bash
# Verificar que MySQL esté ejecutándose
sudo service mysql status

# En Windows con XAMPP
# Verificar que MySQL esté iniciado en el panel de control XAMPP

# Verificar configuración en settings.py
python manage.py check --database default

# Probar conexión a MySQL
mysql -u kutsa_user -p
```

**Error de CORS en frontend**
```bash
# Verificar configuración CORS en Django
pip install django-cors-headers
# Agregar 'corsheaders' a INSTALLED_APPS
```

**Error de dependencias**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
pip install --upgrade -r requirements.txt
```

---

## 📚 Documentación Adicional

- 📖 [Documentación Completa del Proyecto](./DOCUMENTACION_COMPLETA_PROYECTO.md)
- 🔥 [Sistema de Rachas](./DOCUMENTACION_COMPLETA_SISTEMA_RACHAS.md)
- 📊 [Estado de Documentación](./ESTADO_DOCUMENTACION.md)
- 📋 [Instrucciones Detalladas](./instrucciones.md)
- 📝 [Observaciones del Proyecto](./observaciones.md)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

### Estándares de Código

- **Frontend**: Seguir las convenciones de Angular y TypeScript
- **Backend**: Seguir PEP 8 para Python y convenciones de Django
- **Commits**: Usar mensajes descriptivos en español
- **Documentación**: Documentar todas las funciones y componentes importantes

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:

1. Revisa la documentación existente
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles específicos
4. Contacta al equipo de desarrollo

---

## 🎉 Agradecimientos

- Inspiración en videojuegos retro clásicos
- Comunidad de Angular y Django
- Instituciones educativas que apoyan la innovación en e-learning
- Todos los contribuidores y testers del proyecto

---

<div align="center">
  
  ### 🚀 ¡Disfruta aprendiendo con Kütsa! 🎮
  
  *Desarrollado con ❤️ por el equipo Full Stack*
  
  **Marlon Estid Gómez | Elaine Liseth Leal | Julián Felipe Albarracín | Heidy Alejandra Caicedo**
  
</div>
