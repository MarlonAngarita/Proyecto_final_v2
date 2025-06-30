# 🗄️ DOCUMENTACIÓN DE BASE DE DATOS - KÜTSA

## 📋 Información General

**Base de Datos**: `kutsadb_v3`  
**Motor**: MySQL 8.0  
**Charset**: UTF8MB4 (Unicode completo)  
**Collation**: utf8mb4_unicode_ci  
**Tipo**: Relacional normalizada  

---

## 🎯 Justificación del Diseño

### 🔍 **Decisiones Arquitectónicas**

#### 1. **MySQL como Motor de Base de Datos**
- ✅ **Rendimiento**: Excelente para aplicaciones web con alta concurrencia
- ✅ **Escalabilidad**: Soporte robusto para crecimiento horizontal y vertical
- ✅ **Compatibilidad**: Amplio soporte en Django y ecosistema Python
- ✅ **Confiabilidad**: Motor maduro y estable para aplicaciones educativas
- ✅ **Comunidad**: Documentación extensa y soporte comunitario

#### 2. **Normalización de Datos**
- 📊 **3NF (Tercera Forma Normal)**: Eliminación de redundancias
- 🔗 **Relaciones bien definidas**: FK constraints para integridad
- 🎯 **Separación de responsabilidades**: Cada tabla tiene un propósito específico
- 📈 **Optimización de consultas**: Índices en campos relacionales

#### 3. **Estrategia de Gamificación**
- 🎮 **Modularidad**: Sistema de medallas, rachas y desafíos separados
- 📊 **Trazabilidad**: Registro de fechas y progreso del usuario
- 🔄 **Flexibilidad**: Fácil extensión para nuevas mecánicas de juego

---

## 📊 Esquema de la Base de Datos

### 🏗️ **Diagrama Conceptual**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KÜTSA DATABASE SCHEMA                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   AVATARES  │    │    ROLES    │    │TIPO_DOCUMENTO│              │
│  │             │    │             │    │             │              │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘              │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│                    ┌───────▼────────┐                               │
│                    │    USUARIOS    │                               │
│                    │   (Central)    │                               │
│                    └───────┬────────┘                               │
│                            │                                        │
│       ┌────────────────────┼────────────────────┐                   │
│       │                    │                    │                   │
│  ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐              │
│  │  RACHAS  │         │  FORO    │         │GAMIFICACION            │
│  │ USUARIO  │         │          │         │          │              │
│  └──────────┘         └──────────┘         └──────────┘              │
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   CURSOS    │◄───┤   MODULOS   │◄───┤    QUIZ     │              │
│  │             │    │             │    │             │              │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘              │
│         │                  │                                        │
│         │                  │                                        │
│  ┌──────▼──────┐    ┌──────▼──────┐                                 │
│  │CURSOS_NIVEL │    │  PROGRESO   │                                 │
│  │             │    │   USUARIO   │                                 │
│  └─────────────┘    └─────────────┘                                 │
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │  MEDALLAS   │◄───┤ MEDALLAS_   │    │  DESAFIOS   │              │
│  │             │    │  USUARIO    │    │             │              │
│  └─────────────┘    └─────────────┘    └──────┬──────┘              │
│                                               │                     │
│                                        ┌──────▼──────┐              │
│                                        │ DESAFIOS_   │              │
│                                        │  USUARIO    │              │
│                                        └─────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Descripción de Tablas

### 👤 **GESTIÓN DE USUARIOS**

#### 1. **usuarios** (Tabla Central)
```sql
CREATE TABLE usuarios (
  id bigint AUTO_INCREMENT PRIMARY KEY,
  username varchar(150) UNIQUE NOT NULL,
  email varchar(254) UNIQUE NOT NULL,
  password varchar(128) NOT NULL,
  nombre varchar(100) NOT NULL,
  id_avatar integer NULL,
  id_rol integer NULL,
  id_tipo_documento integer NULL,
  -- Campos de Django User
  first_name varchar(150),
  last_name varchar(150),
  is_staff bool NOT NULL,
  is_active bool NOT NULL,
  is_superuser bool NOT NULL,
  date_joined datetime(6) NOT NULL,
  last_login datetime(6) NULL
);
```

**Justificación:**
- 🎯 **Hereda de Django User**: Aprovecha autenticación y permisos built-in
- 🔐 **Campos únicos**: Email y username para prevenir duplicados
- 🎨 **Personalización**: Avatar y rol para experiencia personalizada
- 📝 **Flexibilidad**: Soporte para diferentes tipos de documento

#### 2. **roles**
```sql
CREATE TABLE roles (
  id_rol integer AUTO_INCREMENT PRIMARY KEY,
  nombre_rol varchar(50) UNIQUE NOT NULL
);
```

**Roles del Sistema:**
- 👨‍🎓 **Estudiante**: Acceso a cursos, gamificación y foros
- 👨‍🏫 **Profesor**: Gestión de contenido y evaluaciones
- 👑 **Administrador**: Control total del sistema

#### 3. **avatares**
```sql
CREATE TABLE avatares (
  id_avatar integer AUTO_INCREMENT PRIMARY KEY,
  nombre_avatar varchar(100) NOT NULL,
  imagen_url varchar(255) NOT NULL
);
```

**Justificación:**
- 🎮 **Gamificación**: Personalización del perfil del usuario
- 🎨 **Identidad visual**: Mejora la experiencia de usuario
- 📁 **Gestión centralizada**: URLs organizadas y escalables

#### 4. **tipo_documento**
```sql
CREATE TABLE tipo_documento (
  id_tipo_documento integer AUTO_INCREMENT PRIMARY KEY,
  nombre_tipo varchar(50) UNIQUE NOT NULL
);
```

**Justificación:**
- 📋 **Flexibilidad regional**: Soporte para diferentes documentos (CC, TI, Pasaporte)
- 🌍 **Escalabilidad internacional**: Fácil adición de nuevos tipos
- ✅ **Normalización**: Evita redundancia en datos de usuario

---

### 📚 **SISTEMA EDUCATIVO**

#### 5. **cursos**
```sql
CREATE TABLE cursos (
  id_curso integer AUTO_INCREMENT PRIMARY KEY,
  nombre_curso varchar(100) NOT NULL,
  descripcion_curso longtext NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  fecha_creacion datetime(6) NULL,
  id_profesor bigint NULL,
  FOREIGN KEY (id_profesor) REFERENCES usuarios(id)
);
```

**Justificación:**
- 📅 **Control temporal**: Fechas de inicio y fin para programación
- 👨‍🏫 **Autoría**: Relación con profesor responsable
- 📝 **Contenido rico**: Descripción extensa con longtext

#### 6. **modulos**
```sql
CREATE TABLE modulos (
  id_modulo integer AUTO_INCREMENT PRIMARY KEY,
  nombre_modulo varchar(100) NOT NULL,
  contenido_modulo longtext NOT NULL,
  id_curso integer NOT NULL,
  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);
```

**Justificación:**
- 🧩 **Modularidad**: Divide el contenido en unidades manejables
- 📖 **Contenido extenso**: Soporte para HTML, Markdown, etc.
- 🔗 **Jerarquía clara**: Relación directa con cursos

#### 7. **quiz**
```sql
CREATE TABLE quiz (
  id_quiz integer AUTO_INCREMENT PRIMARY KEY,
  pregunta longtext NOT NULL,
  opcion_a varchar(255) NOT NULL,
  opcion_b varchar(255) NOT NULL,
  opcion_c varchar(255) NOT NULL,
  opcion_d varchar(255) NOT NULL,
  respuesta_correcta varchar(255) NOT NULL,
  id_modulo integer NOT NULL,
  FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo)
);
```

**Justificación:**
- 📝 **Evaluación estándar**: Formato de opción múltiple ampliamente usado
- 🎯 **Simplicidad**: Estructura fija para fácil implementación
- 📊 **Evaluación automática**: Respuesta correcta almacenada para auto-corrección

#### 8. **niveles**
```sql
CREATE TABLE niveles (
  id_nivel integer AUTO_INCREMENT PRIMARY KEY,
  nombre_nivel varchar(100) NOT NULL,
  requisitos longtext NOT NULL
);
```

**Justificación:**
- 📈 **Progresión**: Sistema de niveles para motivar al estudiante
- 📋 **Requisitos claros**: Criterios específicos para avanzar
- 🎯 **Flexibilidad**: Requisitos pueden ser complejos y detallados

---

### 🎮 **SISTEMA DE GAMIFICACIÓN**

#### 9. **medallas**
```sql
CREATE TABLE medallas (
  id_medalla integer AUTO_INCREMENT PRIMARY KEY,
  nombre_medalla varchar(100) NOT NULL,
  descripcion longtext NOT NULL,
  icono_url varchar(255) NOT NULL
);
```

**Justificación:**
- 🏆 **Reconocimiento**: Sistema de logros para motivar usuarios
- 🎨 **Visual atractivo**: Iconos para mejor experiencia
- 📝 **Claridad**: Descripción detallada de criterios

#### 10. **desafios**
```sql
CREATE TABLE desafios (
  id_desafio integer AUTO_INCREMENT PRIMARY KEY,
  nombre_desafio varchar(100) NOT NULL,
  descripcion longtext NOT NULL,
  recompensa integer NULL,
  dificultad varchar(50) NOT NULL
);
```

**Justificación:**
- 🎯 **Engagement**: Retos adicionales para mantener interés
- 💰 **Sistema de recompensas**: Puntos por completar desafíos
- 📊 **Clasificación**: Niveles de dificultad para progresión

#### 11. **rachas_usuario**
```sql
CREATE TABLE rachas_usuario (
  id_racha integer AUTO_INCREMENT PRIMARY KEY,
  dias_consecutivos integer NOT NULL,
  ultima_actividad datetime(6) NULL,
  id_usuario bigint UNIQUE NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

**Justificación:**
- 🔥 **Hábito de estudio**: Incentiva uso diario de la plataforma
- ⏰ **Seguimiento temporal**: Control preciso de actividad
- 👤 **Único por usuario**: Un registro de racha por persona

---

### 🔗 **TABLAS DE RELACIÓN**

#### 12. **medallas_usuario**
```sql
CREATE TABLE medallas_usuario (
  id_medalla_usuario integer AUTO_INCREMENT PRIMARY KEY,
  fecha_obtencion datetime(6) NOT NULL,
  id_medalla integer NOT NULL,
  id_usuario bigint NOT NULL,
  UNIQUE (id_usuario, id_medalla),
  FOREIGN KEY (id_medalla) REFERENCES medallas(id_medalla),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

#### 13. **desafios_usuario**
```sql
CREATE TABLE desafios_usuario (
  id_desafio_usuario integer AUTO_INCREMENT PRIMARY KEY,
  completado bool NOT NULL,
  fecha_completado datetime(6) NULL,
  id_desafio integer NOT NULL,
  id_usuario bigint NOT NULL,
  UNIQUE (id_usuario, id_desafio),
  FOREIGN KEY (id_desafio) REFERENCES desafios(id_desafio),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

#### 14. **progreso_usuario**
```sql
CREATE TABLE progreso_usuario (
  id_progreso integer AUTO_INCREMENT PRIMARY KEY,
  completado bool NOT NULL,
  fecha_completado datetime(6) NULL,
  id_modulo integer NOT NULL,
  id_usuario bigint NOT NULL,
  UNIQUE (id_usuario, id_modulo),
  FOREIGN KEY (id_modulo) REFERENCES modulos(id_modulo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

---

## 🔐 Integridad y Restricciones

### 🛡️ **Restricciones de Integridad**

#### **Claves Primarias**
- ✅ Todas las tablas tienen PK auto-incremental
- ✅ Garantizan unicidad de registros
- ✅ Optimización automática de consultas

#### **Claves Foráneas**
- ✅ Integridad referencial completa
- ✅ Cascada controlada en eliminaciones
- ✅ Prevención de registros huérfanos

#### **Restricciones Únicas**
- ✅ `usuarios.email` y `usuarios.username`
- ✅ `roles.nombre_rol`
- ✅ Relaciones usuario-medalla, usuario-desafío
- ✅ Prevención de duplicados lógicos

#### **Validaciones de Datos**
- ✅ `NOT NULL` en campos obligatorios
- ✅ `longtext` para contenido extenso
- ✅ `datetime(6)` para precisión en fechas

---

## 📈 Optimización y Rendimiento

### 🚀 **Índices Automáticos**
```sql
-- Índices de Django automáticamente creados
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_modulos_curso ON modulos(id_curso);
CREATE INDEX idx_quiz_modulo ON quiz(id_modulo);
```

### 🎯 **Estrategias de Optimización**

#### **1. Consultas Frecuentes**
- 📊 Dashboard de usuario (rachas, progreso, medallas)
- 📚 Listado de cursos y módulos
- 🏆 Sistema de gamificación

#### **2. Particionamiento Potencial**
- 📅 Tablas por fecha (gamificacion, progreso_usuario)
- 👥 Separación por rol de usuario
- 📖 Archivado de cursos antiguos

#### **3. Caché de Consultas**
- 🔄 Información de perfil de usuario
- 📊 Estadísticas de gamificación
- 📚 Catálogo de cursos activos

---

## 🔄 Consideraciones de Escalabilidad

### 📊 **Crecimiento Esperado**

#### **Usuarios**
- 👥 **Inicial**: 100-1,000 usuarios
- 📈 **Proyectado**: 10,000-100,000 usuarios
- 🎯 **Estrategia**: Sharding por región/institución

#### **Contenido**
- 📚 **Cursos**: Crecimiento constante
- 📝 **Módulos**: Alta frecuencia de creación
- ❓ **Quiz**: Volumen muy alto

#### **Gamificación**
- 🏆 **Medallas**: Catálogo estable
- 🎯 **Desafíos**: Rotación frecuente
- 🔥 **Rachas**: Una por usuario, datos compactos

### 🔧 **Mejoras Futuras**

#### **1. Auditoría**
```sql
-- Tabla de auditoría propuesta
CREATE TABLE auditoria (
  id bigint AUTO_INCREMENT PRIMARY KEY,
  tabla varchar(50) NOT NULL,
  operacion varchar(10) NOT NULL,
  id_registro bigint NOT NULL,
  datos_anteriores JSON,
  datos_nuevos JSON,
  id_usuario bigint,
  fecha datetime(6) NOT NULL
);
```

#### **2. Sistema de Notificaciones**
```sql
-- Notificaciones push/email
CREATE TABLE notificaciones (
  id bigint AUTO_INCREMENT PRIMARY KEY,
  tipo varchar(50) NOT NULL,
  titulo varchar(200) NOT NULL,
  mensaje longtext NOT NULL,
  leida bool DEFAULT FALSE,
  id_usuario bigint NOT NULL,
  fecha_creacion datetime(6) NOT NULL
);
```

#### **3. Analytics Avanzado**
```sql
-- Métricas de uso
CREATE TABLE metricas_uso (
  id bigint AUTO_INCREMENT PRIMARY KEY,
  evento varchar(100) NOT NULL,
  parametros JSON,
  id_usuario bigint,
  ip_address varchar(45),
  user_agent varchar(500),
  fecha datetime(6) NOT NULL
);
```

---

## 🛠️ Comandos de Mantenimiento

### 📊 **Consultas de Monitoreo**

#### **Estadísticas Generales**
```sql
-- Resumen de usuarios por rol
SELECT r.nombre_rol, COUNT(*) as cantidad
FROM usuarios u
JOIN roles r ON u.id_rol = r.id_rol
GROUP BY r.nombre_rol;

-- Cursos más populares
SELECT c.nombre_curso, COUNT(pu.id_usuario) as estudiantes
FROM cursos c
LEFT JOIN modulos m ON c.id_curso = m.id_curso
LEFT JOIN progreso_usuario pu ON m.id_modulo = pu.id_modulo
GROUP BY c.id_curso, c.nombre_curso
ORDER BY estudiantes DESC;

-- Usuarios más activos en rachas
SELECT u.nombre, ru.dias_consecutivos
FROM usuarios u
JOIN rachas_usuario ru ON u.id = ru.id_usuario
ORDER BY ru.dias_consecutivos DESC
LIMIT 10;
```

#### **Limpieza de Datos**
```sql
-- Limpiar sesiones expiradas
DELETE FROM django_session 
WHERE expire_date < NOW();

-- Actualizar rachas inactivas
UPDATE rachas_usuario 
SET dias_consecutivos = 0 
WHERE ultima_actividad < DATE_SUB(NOW(), INTERVAL 2 DAY);
```

### 🔧 **Backup y Recuperación**
```bash
# Backup completo
mysqldump -u kutsa_user -p kutsadb_v3 > backup_kutsa_$(date +%Y%m%d).sql

# Backup solo estructura
mysqldump -u kutsa_user -p --no-data kutsadb_v3 > schema_kutsa.sql

# Backup solo datos
mysqldump -u kutsa_user -p --no-create-info kutsadb_v3 > data_kutsa.sql
```

---

## 📋 Conclusiones

### ✅ **Fortalezas del Diseño**

1. **🏗️ Arquitectura Sólida**
   - Normalización adecuada (3NF)
   - Relaciones bien definidas
   - Integridad referencial completa

2. **🎮 Gamificación Efectiva**
   - Sistema modular y extensible
   - Múltiples mecánicas de engagement
   - Trazabilidad completa de progreso

3. **📚 Sistema Educativo Robusto**
   - Jerarquía clara: Cursos → Módulos → Quiz
   - Flexibilidad en contenido
   - Seguimiento detallado de progreso

4. **🔐 Seguridad y Permisos**
   - Integración con sistema Django
   - Roles bien definidos
   - Campos únicos para prevenir duplicados

### 🎯 **Recomendaciones**

1. **📊 Monitoreo Continuo**
   - Implementar métricas de rendimiento
   - Alertas para consultas lentas
   - Análisis regular de crecimiento

2. **🔄 Optimización Proactiva**
   - Índices adicionales según uso real
   - Particionamiento de tablas grandes
   - Caché estratégico de consultas frecuentes

3. **📈 Escalabilidad**
   - Considerar read replicas para consultas
   - Implementar sistema de auditoría
   - Planificar migración a microservicios si es necesario

---

*📅 Documentación creada: 30 de junio de 2025*  
*👥 Equipo: Marlon Estid Gómez, Elaine Liseth Leal, Julián Felipe Albarracín, Heidy Alejandra Caicedo*  
*🎮 Proyecto: Plataforma Educativa Kütsa*
