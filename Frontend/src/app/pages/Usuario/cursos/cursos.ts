import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-cursos-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})

export class Cursos implements OnInit {
  vistaActual = 'disponibles';
  modalActivo = false;
  cursoSeleccionado: any = null;
  modalConfirmacionActivo = false;
  modalAlertaActivo = false;
  
  // Estados de carga y error
  cargando = false;
  error = '';

  cursosDisponibles: any[] = [];
  cursosInscritos: any[] = [];

  // Datos locales como fallback
  cursosLocales = [
    {
      id: 1,
      titulo: 'Angular Básico',
      nombre: 'Angular Básico',
      descripcion: 'Aprende lo esencial de Angular.',
      contenido: 'Introducción a componentes y servicios.',
      categoria: 'Programación',
      activo: true
    },
    {
      id: 2,
      titulo: 'CSS Avanzado',
      nombre: 'CSS Avanzado',
      descripcion: 'Domina animaciones y efectos.',
      contenido: 'Flexbox, Grid y Transiciones.',
      categoria: 'Diseño',
      activo: true
    },
    {
      id: 3,
      titulo: 'JavaScript Moderno',
      nombre: 'JavaScript Moderno',
      descripcion: 'Deep dive en ES6+.',
      contenido: 'Async/Await, Promesas y más.',
      categoria: 'Programación',
      activo: true
    },
  ];

  constructor(private router: Router, private cursosService: CursosService) {
    this.cargarCursosInscritos();
  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cargando = true;
    this.error = '';

    this.cursosService.getTodosAPI().subscribe({
      next: (cursos) => {
        this.cargando = false;
        if (cursos && cursos.length > 0) {
          // Transformar los datos de la API al formato esperado
          this.cursosDisponibles = cursos.map(curso => ({
            id: curso.id_curso || curso.id,
            titulo: curso.nombre_curso || curso.nombre || curso.titulo,
            nombre: curso.nombre_curso || curso.nombre || curso.titulo,
            descripcion: curso.descripcion_curso || curso.descripcion,
            contenido: curso.contenido || `Contenido del curso ${curso.nombre_curso || curso.nombre}`,
            categoria: curso.categoria || 'General',
            activo: true,
            fecha_inicio: curso.fecha_inicio,
            fecha_fin: curso.fecha_fin,
            id_profesor: curso.id_profesor
          }));
        } else {
          // Fallback a datos locales si la API no devuelve datos
          this.cursosDisponibles = [...this.cursosLocales];
        }
      },
      error: (error) => {
        this.cargando = false;
        this.error = 'Error al cargar cursos. Mostrando datos locales.';
        console.error('Error al cargar cursos:', error);
        // Fallback a datos locales en caso de error
        this.cursosDisponibles = [...this.cursosLocales];
      }
    });
  }

  cargarCursosInscritos(): void {
    const cursosGuardados = localStorage.getItem('cursosInscritos');
    if (cursosGuardados) {
      try {
        this.cursosInscritos = JSON.parse(cursosGuardados);
      } catch (error) {
        console.error('Error al cargar cursos inscritos desde localStorage:', error);
        this.cursosInscritos = [];
      }
    }
  }

  guardarCursosInscritos(): void {
    try {
      localStorage.setItem('cursosInscritos', JSON.stringify(this.cursosInscritos));
    } catch (error) {
      console.error('Error al guardar cursos inscritos en localStorage:', error);
    }
  }

  recargarCursos(): void {
    this.error = '';
    this.cargarCursos();
  }

  mostrarDisponibles() {
    this.vistaActual = 'disponibles';
  }

  mostrarInscritos() {
    this.vistaActual = 'inscritos';
  }

  abrirDetalles(curso: any) {
    this.cursoSeleccionado = curso;
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
    this.cursoSeleccionado = null;
  }

  verMasCurso() {
    console.log('Ver detalles del curso:', this.cursoSeleccionado);
    if (this.cursoSeleccionado) {
      this.router.navigate(['/usuario/detalle-curso'], {
        state: { curso: this.cursoSeleccionado },
      });
    }
  }

  inscribirseCurso() {
    if (!this.cursoSeleccionado) return;

    // Verificar si ya está inscrito usando el id del curso
    const yaInscrito = this.cursosInscritos.some(curso => 
      curso.id === this.cursoSeleccionado.id || 
      curso.titulo === this.cursoSeleccionado.titulo
    );

    if (yaInscrito) {
      this.modalAlertaActivo = true;
    } else {
      // Agregar curso a la lista de inscritos
      this.cursosInscritos.push({ ...this.cursoSeleccionado });
      
      // Persistir en localStorage
      this.guardarCursosInscritos();
      
      this.modalConfirmacionActivo = true;
    }
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
    this.modalActivo = false;
    this.cursoSeleccionado = null;
  }

  cerrarModalAlerta() {
    this.modalAlertaActivo = false;
  }
}
