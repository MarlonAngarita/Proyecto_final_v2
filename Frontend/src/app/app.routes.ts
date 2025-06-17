import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio';
import { Login } from './pages/login';
import { Registro } from './pages/registro';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
];
