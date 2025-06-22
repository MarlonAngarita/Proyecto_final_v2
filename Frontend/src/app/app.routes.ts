import { Routes } from '@angular/router';
import { Inicio } from './pages/Inicio/inicio';
import { Login } from './pages/Login/login';
import { Registro } from './pages/Registro/registro';
import { Cursos } from './pages/Profesor/cursos/cursos';
import { DashboardProfesor } from './pages/Profesor/dashboard-profesor/dashboard-profesor';
import { Desafios } from './pages/Profesor/desafios/desafios';
import { Foro } from './pages/Profesor/foro/foro';
import { Modulos } from './pages/Profesor/modulos/modulos';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'cursos', component: Cursos },
  { path: 'dashboard-profesor', component: DashboardProfesor },
  { path: 'desafios', component: Desafios },
  { path: 'foro', component: Foro },
  { path: 'modulos', component: Modulos },
];
