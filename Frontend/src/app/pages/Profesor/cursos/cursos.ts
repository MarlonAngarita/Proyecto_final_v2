import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos implements OnInit {
  modalCrearActivo = false;
  modalDetallesActivo = false;
  modalEdicionActivo = false;
  modalConfirmacionActivo = false;
  cursoSeleccionado: any = null;
  materialApoyo: File | null = null;
  cargando = false;

  userRole: string = '';
  mostrarSidebar = false;
  mostrarFooter = false;

  cursosCreados: any[] = [];

  nuevoCurso = {
    nombre: '',
    descripcion: '',
    categoria: '',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
    modulos: [],
    desafios: [],
  };

  constructor(
    private router: Router,
    private cursosService: CursosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const paginasConNavbarFooter = ['inicio', 'registro', 'nosotros', 'login'];
    const rutaActual = this.router.url.split('/')[1];
    this.mostrarSidebar = !paginasConNavbarFooter.includes(rutaActual);
    this.mostrarFooter = paginasConNavbarFooter.includes(rutaActual);

    // Cargar cursos desde la API o localmente
    this.cargarCursos();
  }

  cargarCursos() {
    this.cargando = true;
    console.log('Iniciando carga de cursos...');

    this.cursosService.getTodosAPI().subscribe({
      next: (cursos) => {
        console.log('Respuesta de la API:', cursos);

        // Verificar si la respuesta es un array
        if (Array.isArray(cursos)) {
          // Normalizar los datos que vienen de la API
          this.cursosCreados = cursos.map((curso) => ({
            ...curso,
            // El backend usa id_curso como clave primaria
            id: curso.id_curso || curso.id || curso.pk,
            nombre: curso.nombre_curso || curso.nombre,
            descripcion: curso.descripcion_curso || curso.descripcion,
            // Mantener también los campos originales
            nombre_curso: curso.nombre_curso,
            descripcion_curso: curso.descripcion_curso,
            id_curso: curso.id_curso,
          }));
        } else {
          console.warn('La respuesta de la API no es un array:', cursos);
          this.cursosCreados = [];
        }

        console.log('Cursos procesados:', this.cursosCreados);

        // IMPORTANTE: Establecer cargando = false ANTES de detectChanges
        this.cargando = false;

        // Verificar que cdr existe antes de usar detectChanges
        if (this.cdr) {
          this.cdr.detectChanges();
          console.log('Detectando cambios con ChangeDetectorRef');
        } else {
          // Alternativa con setTimeout si ChangeDetectorRef no está disponible
          setTimeout(() => {
            console.log('Forzando actualización de vista con setTimeout');
            // Forzar una actualización adicional del estado
            this.cargando = false;
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error al cargar cursos desde API:', error);
        console.log('Usando datos locales como respaldo');

        // Fallback a datos locales
        this.cursosCreados = this.cursosService.getTodos();
        console.log('Cursos locales cargados:', this.cursosCreados);
        this.cargando = false;

        // Verificar que cdr existe antes de usar detectChanges
        if (this.cdr) {
          this.cdr.detectChanges();
        } else {
          // Alternativa con setTimeout si ChangeDetectorRef no está disponible
          setTimeout(() => {
            console.log('Forzando actualización de vista con setTimeout');
          }, 0);
        }
      },
    });
  }

  abrirModalCrear() {
    console.log('Abriendo modal crear curso');
    this.modalCrearActivo = true;
  }

  cerrarModalCrear() {
    console.log('Cerrando modal crear curso');
    this.modalCrearActivo = false;
    // Reset del formulario al cerrar
    this.nuevoCurso = {
      nombre: '',
      descripcion: '',
      categoria: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: true,
      modulos: [],
      desafios: [],
    };
  }

  crearCurso() {
    if (
      this.nuevoCurso.nombre.trim() &&
      this.nuevoCurso.descripcion.trim() &&
      this.nuevoCurso.fecha_inicio &&
      this.nuevoCurso.fecha_fin
    ) {
      // Validar que la fecha de fin sea posterior a la de inicio
      if (new Date(this.nuevoCurso.fecha_fin) <= new Date(this.nuevoCurso.fecha_inicio)) {
        alert('La fecha de finalización debe ser posterior a la fecha de inicio');
        return;
      }

      this.cargando = true;
      console.log('Creando curso:', this.nuevoCurso);

      this.cursosService.agregarAPI(this.nuevoCurso).subscribe({
        next: (response) => {
          console.log('Curso creado exitosamente en API:', response);

          // Cerrar modal de creación inmediatamente
          this.modalCrearActivo = false;

          // Limpiar formulario
          this.nuevoCurso = {
            nombre: '',
            descripcion: '',
            categoria: '',
            fecha_inicio: '',
            fecha_fin: '',
            activo: true,
            modulos: [],
            desafios: [],
          };

          // Recargar cursos desde la API para obtener los datos más recientes
          this.cargarCursos();

          // Mostrar modal de confirmación después de cargar
          setTimeout(() => {
            this.modalConfirmacionActivo = true;
          }, 500); // Pequeño delay para que se vea la actualización

          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al crear curso en API:', error);

          // Fallback: agregar localmente
          console.log('Intentando agregar localmente...');
          this.cursosService.agregar(this.nuevoCurso);

          // Actualizar la vista con datos locales
          this.cursosCreados = this.cursosService.getTodos();
          console.log('Curso agregado localmente, lista actualizada:', this.cursosCreados);

          // Cerrar modal y mostrar confirmación
          this.modalCrearActivo = false;
          this.nuevoCurso = {
            nombre: '',
            descripcion: '',
            categoria: '',
            fecha_inicio: '',
            fecha_fin: '',
            activo: true,
            modulos: [],
            desafios: [],
          };

          this.modalConfirmacionActivo = true;
          this.cargando = false;

          // Verificar que cdr existe antes de usar detectChanges
          if (this.cdr) {
            this.cdr.detectChanges();
          } else {
            // Alternativa con setTimeout si ChangeDetectorRef no está disponible
            setTimeout(() => {
              console.log('Forzando actualización de vista con setTimeout después de crear curso');
            }, 0);
          }
        },
      });
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  }

  cerrarModalConfirmacion() {
    console.log('Cerrando modal de confirmación');
    this.modalConfirmacionActivo = false;
  }

  abrirModalDetalles(curso: any) {
    this.cursoSeleccionado = {
      ...curso,
      // Asegurar que los campos estén mapeados correctamente
      id: curso.id_curso || curso.id || curso.pk,
      id_curso: curso.id_curso || curso.id,
      nombre: curso.nombre_curso || curso.nombre,
      descripcion: curso.descripcion_curso || curso.descripcion,
    };
    this.modalDetallesActivo = true;
    console.log('Curso seleccionado:', this.cursoSeleccionado);
  }

  cerrarModalDetalles() {
    this.modalDetallesActivo = false;
    this.cursoSeleccionado = null;
  }

  eliminarCurso(curso: any) {
    // Verificar que el curso tenga un ID válido
    const cursoId = curso.id_curso || curso.id || curso.pk;

    if (!cursoId) {
      console.error('No se puede eliminar: ID del curso no encontrado', curso);
      alert('Error: No se puede eliminar el curso. ID no válido.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.cargando = true;
      this.cursosService.eliminarAPI(cursoId).subscribe({
        next: () => {
          console.log('Curso eliminado exitosamente');
          this.cargarCursos(); // Recargar la lista desde la API
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al eliminar curso desde API, usando método local:', error);
          // Fallback al método local si falla la API
          this.cursosService.eliminar(cursoId);
          this.cursosCreados = this.cursosService.getTodos();
          this.cargando = false;
        },
      });
    }
  }

  editarCurso(curso: any) {
    this.cursoSeleccionado = {
      ...curso,
      // Mapear los campos que vienen de la API a los campos esperados en el formulario
      id: curso.id_curso || curso.id || curso.pk,
      id_curso: curso.id_curso || curso.id,
      nombre: curso.nombre_curso || curso.nombre,
      descripcion: curso.descripcion_curso || curso.descripcion,
      fecha_inicio: curso.fecha_inicio,
      fecha_fin: curso.fecha_fin,
    };
    this.modalEdicionActivo = true;
    this.modalDetallesActivo = false;
  }

  guardarEdicionCurso() {
    this.cargando = true;
    this.cursosService.actualizarAPI(this.cursoSeleccionado).subscribe({
      next: () => {
        console.log('Curso actualizado exitosamente');
        this.cargarCursos(); // Recargar la lista desde la API
        this.modalEdicionActivo = false;
        this.modalConfirmacionActivo = true;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar curso desde API, usando método local:', error);
        // Fallback al método local si falla la API
        this.cursosService.actualizar(this.cursoSeleccionado);
        this.cursosCreados = this.cursosService.getTodos();
        this.modalEdicionActivo = false;
        this.modalConfirmacionActivo = true;
        this.cargando = false;
      },
    });
  }

  cerrarModalEdicion() {
    this.modalEdicionActivo = false;
    this.modalDetallesActivo = true;
  }

  cerrarTodosLosModales() {
    this.modalConfirmacionActivo = false;
    this.modalDetallesActivo = false;
    this.modalEdicionActivo = false;
    this.modalCrearActivo = false;
    this.cursoSeleccionado = null;
  }

  agregarMaterial(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.materialApoyo = archivo;
      if (this.cursoSeleccionado) {
        this.cursoSeleccionado.material = archivo.name;
      }
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/profesor/dashboard-profesor']);
  }
}
