import { Routes } from '@angular/router';
import { Inicio } from './pages/Inicio/inicio';
import { Login } from './pages/Login/login';
import { Registro } from './pages/Registro/registro';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
];
