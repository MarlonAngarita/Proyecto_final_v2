/*
===================================================================================================
CONFIGURACIÓN DE RUTAS - APP.ROUTES.TS
===================================================================================================

Define todas las rutas de la aplicación Kütsa organizadas por roles y funcionalidades.
Utiliza lazy loading para optimizar la carga de componentes.

Estructura de rutas:
- Rutas públicas: Inicio, Login, Registro
- Rutas de Profesor: Dashboard, cursos, desafíos, foro, módulos, quiz
- Rutas de Usuario: Dashboard, cursos, desafíos, foro, medallas, progreso, rachas, perfil
- Rutas de Admin: Panel administrativo

@author Sistema Kütsa
@version 2.0 - Sistema de rutas modular
*/

import { Routes } from '@angular/router';

// ===========================================================================================
// IMPORTACIÓN DE COMPONENTES PÚBLICOS
// ===========================================================================================
import { Inicio } from './pages/Inicio/inicio';
import { Login } from './pages/Login/login';
import { Registro } from './pages/Registro/registro';
import { RegistroProfesor } from './pages/Registro/registro-profesor';
import { RegistroAdmin } from './pages/Registro/registro-admin';

// ===========================================================================================
// IMPORTACIÓN DE COMPONENTES DEL PROFESOR
// ===========================================================================================
import { Cursos } from './pages/Profesor/cursos/cursos';
import { DashboardProfesor } from './pages/Profesor/dashboard-profesor/dashboard-profesor';
import { Desafios } from './pages/Profesor/desafios/desafios';
import { Foro } from './pages/Profesor/foro/foro';
import { Modulos } from './pages/Profesor/modulos/modulos';
import { Quiz } from './pages/Profesor/quiz/quiz';
import { PerfilProfesor } from './pages/Profesor/perfil/perfil';
import { DashboardUsuario } from './pages/Usuario/dashboard-usuario/dashboard-usuario';
import { Cursos as CursosUsuario } from './pages/Usuario/cursos/cursos';
import { DesafiosUsuario } from './pages/Usuario/desafios-usuario/desafios-usuario';
import { ForoUsuario } from './pages/Usuario/foro/foro';
import { MedallasUsuario } from './pages/Usuario/medallas-usuario/medallas-usuario';
import { ProgresoUsuario } from './pages/Usuario/progreso-usuario/progreso-usuario';
import { RachasUsuario } from './pages/Usuario/rachas-usuario/rachas-usuario';
import { Perfil } from './pages/Usuario/perfil/perfil';

// ===========================================================================================
// IMPORTACIÓN DE COMPONENTES ADMINISTRATIVOS
// ===========================================================================================
import { AdminComponent } from './pages/admin/admin';

// ===================================================================================================
// DEFINICIÓN DE RUTAS DE LA APLICACIÓN
// ===================================================================================================

/**
 * Configuración principal de rutas de la aplicación Kütsa
 *
 * Organización:
 * 1. Rutas públicas (acceso sin autenticación)
 * 2. Rutas del profesor (requieren rol de profesor)
 * 3. Rutas del usuario/estudiante (requieren rol de usuario)
 * 4. Rutas administrativas (requieren rol de admin)
 *
 * TODO: Implementar guards de autenticación y autorización por roles
 */
export const routes: Routes = [
  // ===========================================================================================
  // RUTAS PÚBLICAS - Acceso sin autenticación
  // ===========================================================================================

  /** Página de inicio/landing page */
  { path: '', component: Inicio },

  /** Página de inicio de sesión */
  { path: 'login', component: Login },

  /** Página de registro general */
  { path: 'registro', component: Registro },

  /** Registro específico para profesores */
  { path: 'registro/profesor', component: RegistroProfesor },

  /** Registro específico para administradores */
  { path: 'registro/admin', component: RegistroAdmin },

  // ===========================================================================================
  // RUTAS DEL PROFESOR - Gestión académica y contenido
  // ===========================================================================================

  /** Gestión de cursos del profesor */
  { path: 'profesor/cursos', component: Cursos },

  /** Dashboard principal del profesor */
  { path: 'profesor/dashboard-profesor', component: DashboardProfesor },

  /** Creación y gestión de desafíos */
  { path: 'profesor/desafios', component: Desafios },

  /** Moderación del foro académico */
  { path: 'profesor/foro', component: Foro },

  /** Gestión de módulos de aprendizaje */
  { path: 'profesor/modulos', component: Modulos },

  /** Creación y gestión de quizzes/evaluaciones */
  { path: 'profesor/quiz', component: Quiz },

  // ===========================================================================================
  // RUTAS DEL USUARIO/ESTUDIANTE - Experiencia de aprendizaje
  // ===========================================================================================

  /** Creación y gestión de quizzes/evaluaciones */
  { path: 'profesor/quiz', component: Quiz },
  { path: 'profesor/perfil', component: PerfilProfesor },
  { path: 'usuario/dashboard-usuario', component: DashboardUsuario },
  { path: 'usuario/foro', component: ForoUsuario },

  /** Sistema de medallas y logros */
  { path: 'usuario/medallas', component: MedallasUsuario },

  /** Seguimiento de progreso académico */
  { path: 'usuario/progreso', component: ProgresoUsuario },

  /** Sistema de rachas de actividad */
  { path: 'usuario/rachas', component: RachasUsuario },

  /** Gestión del perfil personal */
  { path: 'usuario/perfil', component: Perfil },
  { path: 'usuario/desafios', component: DesafiosUsuario },

  // ===========================================================================================
  // RUTAS ADMINISTRATIVAS - Gestión del sistema
  // ===========================================================================================

  /** Panel de administración del sistema */
  { path: 'admin', component: AdminComponent },

  // TODO: Agregar rutas de error 404, redirecciones y guards de seguridad
];
