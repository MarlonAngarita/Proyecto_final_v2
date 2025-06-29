import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Curso {
  id_curso: number;
  nombre_curso: string;
}

interface Modulo {
  nombre_modulo: string;
  contenido_modulo: string;
  id_curso: number | null;
}

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulos.html',
  styleUrl: './modulos.css'
})
export class Modulos implements OnInit {
  modulo: Modulo = {
    nombre_modulo: '',
    contenido_modulo: '',
    id_curso: null
  };

  // Propiedades adicionales para la conexión API
  cargando = false;
  modulosCreados: any[] = [];
  private apiUrl = 'http://127.0.0.1:8000/api/v1/modulos/';

  cursos: Curso[] = [
    // Datos de respaldo
    { id_curso: 1, nombre_curso: 'Curso de ejemplo 1' },
    { id_curso: 2, nombre_curso: 'Curso de ejemplo 2' }
  ];

  constructor(
    private cursosService: CursosService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCursos();
    this.cargarModulos();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 1;
  }

  cargarCursos() {
    this.cargando = true;
    console.log('Cargando cursos para módulos...');

    this.cursosService.getTodosAPI().subscribe({
      next: (cursos) => {
        this.cursos = cursos.map(curso => ({
          id_curso: curso.id_curso || curso.id,
          nombre_curso: curso.nombre_curso || curso.nombre
        }));
        console.log('Cursos cargados para módulos:', this.cursos);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar cursos, usando datos locales:', error);
        // Los datos de respaldo ya están definidos arriba
        this.cargando = false;
      }
    });
  }

  cargarModulos() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (modulos) => {
        this.modulosCreados = modulos;
        console.log('Módulos cargados:', this.modulosCreados);
      },
      error: (error) => {
        console.error('Error al cargar módulos:', error);
        this.modulosCreados = [];
      }
    });
  }

  crearModuloAPI(modulo: Modulo): Observable<any> {
    const moduloData = {
      nombre_modulo: modulo.nombre_modulo,
      contenido_modulo: modulo.contenido_modulo,
      id_curso: modulo.id_curso,
      fecha_creacion: new Date().toISOString().split('T')[0],
      id_profesor: this.getCurrentUserId()
    };

    return this.http.post<any>(this.apiUrl, moduloData, { headers: this.getAuthHeaders() });
  }

  onSubmit() {
    if (this.modulo.nombre_modulo && this.modulo.contenido_modulo && this.modulo.id_curso) {
      this.cargando = true;
      console.log('Creando módulo:', this.modulo);

      this.crearModuloAPI(this.modulo).subscribe({
        next: (response) => {
          console.log('Módulo creado exitosamente:', response);
          alert('Módulo guardado correctamente');
          
          // Reiniciar formulario
          this.modulo = { 
            nombre_modulo: '', 
            contenido_modulo: '', 
            id_curso: null 
          };
          
          // Recargar módulos
          this.cargarModulos();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al crear módulo:', error);
          alert('Error al guardar el módulo. Inténtalo de nuevo.');
          this.cargando = false;
        }
      });
    } else {
      alert('Por favor completa todos los campos');
    }
  }

  eliminarModulo(modulo: any, index: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
      const moduloId = modulo.id || modulo.id_modulo;
      
      this.http.delete(`${this.apiUrl}${moduloId}/`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          console.log('Módulo eliminado exitosamente');
          this.cargarModulos();
        },
        error: (error) => {
          console.error('Error al eliminar módulo:', error);
          // Fallback: eliminar localmente
          this.modulosCreados.splice(index, 1);
        }
      });
    }
  }

  volverAlDashboard() {
    this.router.navigate(['/profesor/dashboard-profesor']);
  }
}
