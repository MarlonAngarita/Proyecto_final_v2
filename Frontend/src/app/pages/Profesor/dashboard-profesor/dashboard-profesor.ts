import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CursosService } from '../../../services/cursos.service';

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

  // Estado de carga para cursos
  cargandoCursos = false;

  // Constructor para inyectar AuthService
  constructor(
    private authService: AuthService,
    private router: Router,
    private cursosService: CursosService,
  ) {}

  // Método ngOnInit para cargar datos del usuario
  ngOnInit() {
    console.log('DashboardProfesor - Inicializando componente');
    this.loadUserData();
    this.loadCursosProfesor();
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

  // Método para cargar cursos creados por el profesor
  private loadCursosProfesor() {
    this.cargandoCursos = true;
    console.log('DashboardProfesor - Cargando cursos del profesor');

    this.cursosService.getTodosAPI().subscribe({
      next: (cursos) => {
        console.log('DashboardProfesor - Cursos recibidos de la API:', cursos);

        // Verificar si la respuesta es un array
        if (Array.isArray(cursos)) {
          // Mapear los cursos de la API al formato del dashboard
          this.cursosAsignados = cursos.map((curso) => ({
            id: curso.id_curso || curso.id,
            nombre: curso.nombre_curso || curso.nombre,
            descripcion: curso.descripcion_curso || curso.descripcion,
            fecha_inicio: curso.fecha_inicio,
            fecha_fin: curso.fecha_fin,
            estudiantes: [], // Por ahora vacío, se puede llenar desde otra API
          }));
        } else {
          console.warn('DashboardProfesor - La respuesta de la API no es un array:', cursos);
          this.cursosAsignados = [];
        }

        console.log('DashboardProfesor - Cursos procesados:', this.cursosAsignados);
        this.cargandoCursos = false;
      },
      error: (error) => {
        console.error('DashboardProfesor - Error al cargar cursos desde API:', error);
        console.log('DashboardProfesor - Usando cursos de respaldo locales');

        // Fallback a cursos locales si falla la API
        const cursosLocales = this.cursosService.getTodos();
        this.cursosAsignados = cursosLocales.map((curso) => ({
          id: curso.id,
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          estudiantes: ['Estudiante 1', 'Estudiante 2'], // Datos de ejemplo
        }));

        this.cargandoCursos = false;
      },
    });
  }

  // Método para cerrar sesión
  logout() {
    console.log('DashboardProfesor - Cerrando sesión');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irAlPerfil() {
    this.router.navigate(['/profesor/perfil']);
  }

  cursosAsignados: any[] = [
    // Datos de respaldo (se reemplazarán con datos de la API)
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
      id: 4,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 5,
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
