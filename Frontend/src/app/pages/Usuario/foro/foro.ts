import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService, Hilo, Respuesta } from '../../../services/foro.service';

@Component({
  selector: 'app-foro',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoUsuario implements OnInit {
  // Estados de carga
  cargando = false;
  cargandoHilos = false;
  cargandoRespuesta = false;
  errorCarga = '';

  // Datos del formulario
  tituloPost: string = '';
  contenidoPost: string = '';

  // Lista de hilos y respuestas
  publicaciones: Hilo[] = [];
  hiloSeleccionado: Hilo | null = null;
  respuestas: Respuesta[] = [];
  nuevaRespuesta = '';

  // Estados de modales
  modalRespuestasActivo = false;
  modalEliminarActivo = false;
  modalConfirmacionActivo = false;
  mensajeConfirmacion = '';

  // Datos para eliminación
  postAEliminar: { post: Hilo; index: number } | null = null;

  constructor(
    private router: Router,
    private foroService: ForoService,
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando componente de foro...');
    this.cargarHilos();
  }

  // Cargar hilos desde la API
  private cargarHilos(): void {
    console.log('🔄 Cargando hilos del foro...');
    this.cargandoHilos = true;
    this.errorCarga = '';

    this.foroService.getHilosAPI().subscribe({
      next: (hilos) => {
        console.log('✅ Hilos obtenidos desde API:', hilos);

        if (Array.isArray(hilos)) {
          this.publicaciones = hilos.map((hilo) => ({
            ...hilo,
            autor: hilo.autor || 'Usuario Anónimo',
            respuestas: hilo.respuestas || [],
          }));
        } else {
          console.warn('La respuesta de hilos no es un array:', hilos);
          this.usarDatosLocales();
        }

        this.cargandoHilos = false;

        // Fallback si no hay datos
        if (this.publicaciones.length === 0) {
          console.log('⚠️ API no devolvió hilos, usando datos locales');
          this.usarDatosLocales();
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar hilos desde API:', error);
        this.errorCarga = 'Error al cargar hilos. Mostrando datos locales.';
        this.usarDatosLocales();
        this.cargandoHilos = false;
      },
    });
  }

  private usarDatosLocales(): void {
    this.publicaciones = this.foroService.getHilos() || [];
  }

  publicarPost(): void {
    if (!this.validarFormulario()) {
      return;
    }

    console.log('🔄 Creando nuevo hilo...');
    this.cargando = true;

    const nuevoHilo: Hilo = {
      titulo: this.tituloPost.trim(),
      contenido: this.contenidoPost.trim(),
      fecha_publicacion: new Date().toISOString(),
      autor: this.obtenerNombreUsuario(),
      respuestas: [],
    };

    this.foroService.agregarHiloAPI(nuevoHilo).subscribe({
      next: (response) => {
        console.log('✅ Hilo creado exitosamente:', response);

        if (response) {
          // Agregar al inicio de la lista
          this.publicaciones.unshift(response);
        } else {
          // Fallback local
          this.publicaciones.unshift({
            ...nuevoHilo,
            id: Date.now(),
          });
        }

        this.limpiarFormulario();
        this.mostrarMensaje('¡Publicación creada exitosamente!');
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error al crear hilo:', error);

        // Fallback local
        this.publicaciones.unshift({
          ...nuevoHilo,
          id: Date.now(),
        });

        this.limpiarFormulario();
        this.mostrarMensaje('Publicación creada (modo local)');
        this.cargando = false;
      },
    });
  }

  private validarFormulario(): boolean {
    if (!this.tituloPost.trim() || !this.contenidoPost.trim()) {
      alert('Por favor completa el título y contenido de tu publicación');
      return false;
    }
    return true;
  }

  private limpiarFormulario(): void {
    this.tituloPost = '';
    this.contenidoPost = '';
  }

  private mostrarMensaje(mensaje: string): void {
    this.mensajeConfirmacion = mensaje;
    this.modalConfirmacionActivo = true;

    setTimeout(() => {
      this.modalConfirmacionActivo = false;
      this.mensajeConfirmacion = '';
    }, 3000);
  }

  cerrarModalRespuestas(): void {
    this.modalRespuestasActivo = false;
    this.hiloSeleccionado = null;
    this.respuestas = [];
    this.nuevaRespuesta = '';
  }

  cerrarModalEliminar(): void {
    this.modalEliminarActivo = false;
    this.postAEliminar = null;
  }

  recargarPublicaciones(): void {
    console.log('🔄 Recargando publicaciones...');
    this.cargarHilos();
  }

  eliminarPost(publicacion: Hilo, index: number): void {
    this.postAEliminar = { post: publicacion, index };
    this.modalEliminarActivo = true;
  }

  confirmarEliminar(): void {
    if (!this.postAEliminar) return;

    const { post, index } = this.postAEliminar;
    this.cargando = true;

    if (post.id) {
      this.foroService.eliminarHiloAPI(post.id).subscribe({
        next: (eliminado) => {
          console.log('✅ Resultado eliminación:', eliminado);

          if (eliminado) {
            this.publicaciones.splice(index, 1);
            this.mostrarMensaje('Publicación eliminada exitosamente');
          } else {
            this.mostrarMensaje('Error al eliminar la publicación');
          }

          this.cerrarModalEliminar();
          this.cargando = false;
        },
        error: (error) => {
          console.error('❌ Error al eliminar hilo:', error);

          // Fallback local
          this.publicaciones.splice(index, 1);
          this.mostrarMensaje('Publicación eliminada (modo local)');
          this.cerrarModalEliminar();
          this.cargando = false;
        },
      });
    } else {
      // Eliminar localmente
      this.publicaciones.splice(index, 1);
      this.mostrarMensaje('Publicación eliminada');
      this.cerrarModalEliminar();
      this.cargando = false;
    }
  }

  verRespuestas(hilo: Hilo): void {
    this.hiloSeleccionado = hilo;
    this.respuestas = hilo.respuestas || [];
    this.modalRespuestasActivo = true;
    console.log('Mostrando respuestas para hilo:', hilo.titulo);
  }

  agregarRespuesta(): void {
    if (!this.nuevaRespuesta.trim() || !this.hiloSeleccionado) {
      this.mostrarMensaje('Por favor escribe una respuesta');
      return;
    }

    this.cargandoRespuesta = true;

    const respuesta: Respuesta = {
      contenido: this.nuevaRespuesta.trim(),
      fecha_respuesta: new Date().toISOString(),
      autor: this.obtenerNombreUsuario(),
      id_hilo: this.hiloSeleccionado.id,
    };

    // Simular agregar respuesta (aquí usarías un servicio de respuestas)
    setTimeout(() => {
      // Agregar respuesta al hilo actual
      this.respuestas.push(respuesta);

      // Actualizar el hilo en la lista de publicaciones
      const hiloIndex = this.publicaciones.findIndex((p) => p.id === this.hiloSeleccionado!.id);
      if (hiloIndex !== -1) {
        this.publicaciones[hiloIndex].respuestas = [...this.respuestas];
      }

      this.nuevaRespuesta = '';
      this.cargandoRespuesta = false;
      this.mostrarMensaje('Respuesta agregada exitosamente');

      console.log('Respuesta agregada:', respuesta);
    }, 1000);
  }

  private obtenerNombreUsuario(): string {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.nombre || 'Usuario';
    } catch (error) {
      return 'Usuario';
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }

  // Métodos de utilidad para el template
  getNumeroPublicaciones(): number {
    return this.publicaciones.length;
  }

  getNumeroRespuestasTotal(): number {
    return this.publicaciones.reduce((total, p) => total + (p.respuestas?.length || 0), 0);
  }

  // Método de utilidad para obtener tiempo relativo
  getTiempoRelativo(fecha?: string): string {
    if (!fecha) return 'Hace un momento';

    try {
      const ahora = new Date();
      const fechaPublicacion = new Date(fecha);
      const diferencia = ahora.getTime() - fechaPublicacion.getTime();

      const minutos = Math.floor(diferencia / (1000 * 60));
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      if (minutos < 1) return 'Hace un momento';
      if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
      if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
      return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    } catch (error) {
      return 'Hace un momento';
    }
  }
}
