import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService, Hilo } from '../../../services/foro.service';

@Component({
  selector: 'app-foro-profesores',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class Foro implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private foroService = inject(ForoService);

  tituloPost: string = '';
  contenidoPost: string = '';

  // Estados de carga
  cargando = false;
  cargandoHilos = false;
  errorCarga = '';

  // Estados de operaciones
  guardando = false;
  eliminando = false;
  mensajeConfirmacion = '';

  currentUser: any = null;

  // Usar la interfaz Hilo directamente
  publicaciones: Hilo[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    console.log('🔄 Iniciando componente foro profesor...');
    this.loadCurrentUser();
    this.cargarHilos();
  }

  private loadCurrentUser(): void {
    try {
      this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error loading user:', error);
      this.currentUser = { nombre: 'Profesor' };
    }
  }

  // Cargar hilos desde la API
  private cargarHilos(): void {
    console.log('🔄 Cargando hilos del foro...');
    this.cargandoHilos = true;
    this.errorCarga = '';

    this.foroService.getHilosAPI().subscribe({
      next: (hilos) => {
        console.log('✅ Hilos obtenidos desde API:', hilos);

        // Asignar directamente los hilos desde la API
        this.publicaciones = hilos.map((hilo) => ({
          ...hilo,
          autor: hilo.autor || 'Usuario Anónimo',
        }));

        // Fallback a datos locales si la API no devuelve datos
        if (this.publicaciones.length === 0) {
          console.log('⚠️ API no devolvió hilos, usando datos locales');
          this.publicaciones = this.foroService.getHilos() || [];
        }

        console.log('Publicaciones procesadas:', this.publicaciones);
        this.cargandoHilos = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar hilos desde API:', error);
        this.errorCarga = 'Error al cargar hilos desde la API';
        this.cargandoHilos = false;

        // Fallback a datos locales en caso de error
        console.log('🔄 Cargando datos locales como fallback...');
        this.publicaciones = this.foroService.getHilos() || [];
      },
    });
  }

  // Crear nueva publicación
  publicarPost(): void {
    if (!this.validarFormulario()) {
      return;
    }

    console.log('🔄 Creando nuevo hilo...');
    this.guardando = true;

    const nuevoHilo: Hilo = {
      titulo: this.tituloPost,
      contenido: this.contenidoPost,
      autor: this.currentUser?.nombre || 'Profesor',
    };

    this.foroService.agregarHiloAPI(nuevoHilo).subscribe({
      next: (response) => {
        console.log('✅ Hilo creado exitosamente:', response);

        if (response) {
          this.limpiarFormulario();
          this.cargarHilos(); // Recargar lista
          this.guardando = false;
          this.mensajeConfirmacion = 'Publicación creada exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          this.foroService.agregarHilo(nuevoHilo);
          this.publicaciones = this.foroService.getHilos() || [];
          this.limpiarFormulario();
          this.guardando = false;
          this.mensajeConfirmacion = 'Publicación creada (modo local)';
        }
      },
      error: (error) => {
        console.error('❌ Error al crear hilo:', error);

        // Fallback a método local
        this.foroService.agregarHilo(nuevoHilo);
        this.publicaciones = this.foroService.getHilos() || [];
        this.limpiarFormulario();
        this.guardando = false;
        this.mensajeConfirmacion = 'Publicación creada (modo local)';
      },
    });
  }

  private validarFormulario(): boolean {
    if (!this.tituloPost.trim() || !this.contenidoPost.trim()) {
      this.mensajeConfirmacion = 'Por favor completa el título y contenido de tu publicación';
      return false;
    }
    return true;
  }

  private limpiarFormulario(): void {
    this.tituloPost = '';
    this.contenidoPost = '';
  }

  // Eliminar publicación
  eliminarPost(publicacion: Hilo, index: number): void {
    if (!publicacion.id) {
      // Eliminar localmente si no tiene ID de API
      this.publicaciones.splice(index, 1);
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      console.log('🔄 Eliminando hilo...', publicacion.id);

      this.foroService.eliminarHiloAPI(publicacion.id).subscribe({
        next: (eliminado) => {
          console.log('✅ Resultado eliminación:', eliminado);

          if (eliminado) {
            this.publicaciones.splice(index, 1);
            this.mensajeConfirmacion = 'Publicación eliminada exitosamente';
          } else {
            // Fallback a eliminación local
            console.log('⚠️ API falló, usando método local');
            this.publicaciones.splice(index, 1);
            this.mensajeConfirmacion = 'Publicación eliminada (modo local)';
          }
        },
        error: (error) => {
          console.error('❌ Error al eliminar hilo:', error);
          // Fallback a eliminación local
          this.publicaciones.splice(index, 1);
          this.mensajeConfirmacion = 'Publicación eliminada (modo local)';
        },
      });
    }
  }

  // Cerrar mensaje de confirmación
  cerrarConfirmacion(): void {
    this.mensajeConfirmacion = '';
  }

  // Obtener tiempo relativo
  getTiempoRelativo(fecha?: string): string {
    if (!fecha) return 'Hace un momento';

    const ahora = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferencia = ahora.getTime() - fechaPublicacion.getTime();

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${dias} días`;
  }

  // Obtener imagen por defecto del usuario
  getImagenUsuario(): string {
    return 'https://img.freepik.com/vector-premium/entrenador-fitness-imagen-vectorial-icono-femenino-puede-usar-profesiones_120816-263153.jpg?w=740';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/profesor/dashboard-profesor']);
  }
}
