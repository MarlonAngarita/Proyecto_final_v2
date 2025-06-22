import { Routes } from '@angular/router';
import { Inicio } from './pages/Inicio/inicio';
import { Login } from './pages/Login/login';
import { Registro } from './pages/Registro/registro';
// Importar las páginas del profesor
import { Cursos } from './pages/Profesor/cursos/cursos';
import { DashboardProfesor } from './pages/Profesor/dashboard-profesor/dashboard-profesor';
import { Desafios } from './pages/Profesor/desafios/desafios';
import { Foro } from './pages/Profesor/foro/foro';
import { Modulos } from './pages/Profesor/modulos/modulos';
// Importar las páginas del usuario 

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  // Rutas del profesor
  { path: 'profesor/cursos', component: Cursos },
  { path: 'profesor/dashboard-profesor', component: DashboardProfesor },
  { path: 'profesor/desafios', component: Desafios },
  { path: 'profesor/foro', component: Foro },
  { path: 'profesor/modulos', component: Modulos },
  // Rutas del usuario
];
