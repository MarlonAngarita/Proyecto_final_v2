import { Routes } from '@angular/router';
import { Inicio } from './pages/Inicio/inicio';
import { Login } from './pages/Login/login';
import { Registro } from './pages/Registro/registro';
import { RegistroProfesor } from './pages/Registro/registro-profesor';
import { RegistroAdmin } from './pages/Registro/registro-admin';
// Importar las páginas del profesor
import { Cursos } from './pages/Profesor/cursos/cursos';
import { DashboardProfesor } from './pages/Profesor/dashboard-profesor/dashboard-profesor';
import { Desafios } from './pages/Profesor/desafios/desafios';
import { Foro } from './pages/Profesor/foro/foro';
import { Modulos } from './pages/Profesor/modulos/modulos';
// Importar las páginas del usuario 
import { DashboardUsuario } from './pages/Usuario/dashboard-usuario/dashboard-usuario';
import { Cursos as CursosUsuario } from './pages/Usuario/cursos/cursos';
import { DesafiosUsuario } from './pages/Usuario/desafios-usuario/desafios-usuario';
import { ForoUsuario } from './pages/Usuario/foro/foro';
import { MedallasUsuario } from './pages/Usuario/medallas-usuario/medallas-usuario';
import { ProgresoUsuario } from './pages/Usuario/progreso-usuario/progreso-usuario';
import { RachasUsuario } from './pages/Usuario/rachas-usuario/rachas-usuario';
import { Perfil } from './pages/Usuario/perfil/perfil';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'registro/profesor', component: RegistroProfesor },
  { path: 'registro/admin', component: RegistroAdmin },
  // Rutas del profesor
  { path: 'profesor/cursos', component: Cursos },
  { path: 'profesor/dashboard-profesor', component: DashboardProfesor },
  { path: 'profesor/desafios', component: Desafios },
  { path: 'profesor/foro', component: Foro },
  { path: 'profesor/modulos', component: Modulos },
  // Rutas del usuario
  { path: 'usuario/dashboard-usuario', component: DashboardUsuario },
  { path: 'usuario/cursos', component: CursosUsuario },
  { path: 'usuario/desafios', component: DesafiosUsuario },
  { path: 'usuario/foro', component: ForoUsuario },
  { path: 'usuario/medallas', component: MedallasUsuario },
  { path: 'usuario/progreso', component: ProgresoUsuario },
  { path: 'usuario/rachas', component: RachasUsuario },
  { path: 'usuario/perfil', component: Perfil }
];
