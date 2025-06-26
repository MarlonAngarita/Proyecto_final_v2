import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-profesor',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-profesor.html',
  styleUrl: './dashboard-profesor.css',
})
export class DashboardProfesor implements OnInit {
  // Datos del usuario autenticado
  currentUser: any = null;
  emailProfesor = '';
  
  // Datos existentes
  nombreProfesor = 'Profe Sandra';
  avatarURL = 'https://api.dicebear.com/9.x/fun-emoji/svg';

  // Constructor para inyectar AuthService
  constructor(private authService: AuthService, private router: Router) {}

  // Método ngOnInit para cargar datos del usuario
  ngOnInit() {
    console.log('DashboardProfesor - Inicializando componente');
    this.loadUserData();
  }

  // Método para cargar datos del usuario autenticado
  private loadUserData() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('DashboardProfesor - Usuario actual:', this.currentUser);
    
    if (this.currentUser) {
      this.nombreProfesor = this.currentUser.nombre || 'Profesor';
      this.emailProfesor = this.currentUser.email || '';
      console.log('DashboardProfesor - Nombre del profesor:', this.nombreProfesor);
      console.log('DashboardProfesor - Email del profesor:', this.emailProfesor);
    } else {
      console.error('DashboardProfesor - No hay usuario autenticado');
    }
  }

  // Método para cerrar sesión
  logout() {
    console.log('DashboardProfesor - Cerrando sesión');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cursosAsignados = [
    {
      id: 1,
      nombre: 'Lógica Computacional',
      estudiantes: ['Carlos', 'Ana', 'Luis'],
    },
    {
      id: 2,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 3,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 3,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 4,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
  ];

  progresoEstudiantes = [
    {
      nombre: 'Carlos',
      curso: 'Lógica Computacional',
      modulo: 'Intro',
      porcentaje: 85,
    },
    {
      nombre: 'Ana',
      curso: 'Lógica Computacional',
      modulo: 'Condicionales',
      porcentaje: 60,
    },
    {
      nombre: 'Pedro',
      curso: 'Pensamiento Algorítmico',
      modulo: 'Bucles',
      porcentaje: 40,
    },
  ];
}
