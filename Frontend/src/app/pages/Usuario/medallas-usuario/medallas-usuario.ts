import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MedallasService, Medalla, NotificacionMedalla } from '../../../services/medallas.service';

@Component({
  selector: 'app-medallas-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medallas-usuario.html',
  styleUrls: ['./medallas-usuario.css'],
})
export class MedallasUsuario implements OnInit, OnDestroy {
  private medallasService = inject(MedallasService);
  private router = inject(Router);

  // Suscripciones
  private suscripciones: Subscription[] = [];

  // Estados de carga
  cargando = false;
  errorCarga = '';

  // Datos de medallas
  medallas: Medalla[] = [];
  medallasObtenidas: Medalla[] = [];
  medallasPorCategoria: any = {};

  // Notificaciones
  notificacionesRecientes: NotificacionMedalla[] = [];
  mostrarNotificaciones = false;

  // Estadísticas
  estadisticas: any = {};
  estadoUsuario: any = {};

  // Filtros
  categoriaSeleccionada: string = 'Todas';
  dificultadSeleccionada: string = 'Todas';
  soloObtenidas: boolean = false;

  // Modales
  modalMedallaActivo = false;
  medallaSeleccionada: Medalla | null = null;

  categorias = ['Todas', 'Racha', 'Desafíos', 'Cursos', 'Especiales'];
  dificultades = ['Todas', 'bronce', 'plata', 'oro', 'diamante'];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    console.log('🏅 Iniciando medallero del usuario...');
    this.cargarMedallas();
    this.verificarNuevasMedallas();
    this.configurarSuscripciones();
    this.cargarNotificaciones();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach((sub) => sub.unsubscribe());
  }

  private configurarSuscripciones(): void {
    // Suscripción a nuevas medallas
    const suscripcionNuevas = this.medallasService.nuevaMedalla$.subscribe(
      (notificacion: NotificacionMedalla) => {
        console.log('🎉 Nueva medalla obtenida:', notificacion.medalla.nombre);
        this.notificacionesRecientes.unshift(notificacion);
        this.mostrarNotificacionMedalla(notificacion.medalla);
      },
    );
    this.suscripciones.push(suscripcionNuevas);

    // Suscripción a medallas obtenidas
    const suscripcionObtenidas = this.medallasService.medallasObtenidas$.subscribe(
      (medallas: Medalla[]) => {
        this.medallasObtenidas = medallas;
        this.estadisticas = this.medallasService.obtenerEstadisticas();
      },
    );
    this.suscripciones.push(suscripcionObtenidas);
  }

  private cargarNotificaciones(): void {
    this.notificacionesRecientes = this.medallasService.obtenerNotificacionesRecientes();
  }

  private cargarMedallas(): void {
    this.cargando = true;
    this.errorCarga = '';

    try {
      // Obtener estado actual del usuario
      this.estadoUsuario = this.medallasService.obtenerEstadoUsuario();

      // Obtener medallas con estado actual
      this.medallas = this.medallasService.obtenerMedallas(this.estadoUsuario);

      // Filtrar medallas obtenidas
      this.medallasObtenidas = this.medallas.filter((m) => m.obtenida);

      // Agrupar por categoría
      this.agruparPorCategoria();

      // Obtener estadísticas
      this.estadisticas = this.medallasService.obtenerEstadisticas();

      this.cargando = false;
      console.log('✅ Medallas cargadas:', {
        total: this.medallas.length,
        obtenidas: this.medallasObtenidas.length,
        estado: this.estadoUsuario,
      });
    } catch (error) {
      console.error('❌ Error al cargar medallas:', error);
      this.errorCarga = 'Error al cargar las medallas';
      this.cargando = false;
    }
  }

  private agruparPorCategoria(): void {
    this.medallasPorCategoria = {};

    this.categorias.slice(1).forEach((categoria) => {
      this.medallasPorCategoria[categoria] = this.medallas.filter((m) => m.categoria === categoria);
    });
  }

  private verificarNuevasMedallas(): void {
    const nuevasMedallas = this.medallasService.verificarNuevasMedallas();

    if (nuevasMedallas.length > 0) {
      console.log('🎉 ¡Nuevas medallas obtenidas!', nuevasMedallas);
      // Aquí podrías mostrar una notificación o modal de celebración
    }
  }

  get medallasFiltradas(): Medalla[] {
    let filtradas = this.medallas;

    // Filtrar por categoría
    if (this.categoriaSeleccionada !== 'Todas') {
      filtradas = filtradas.filter((m) => m.categoria === this.categoriaSeleccionada);
    }

    // Filtrar por dificultad
    if (this.dificultadSeleccionada !== 'Todas') {
      filtradas = filtradas.filter((m) => m.dificultad === this.dificultadSeleccionada);
    }

    // Filtrar solo obtenidas
    if (this.soloObtenidas) {
      filtradas = filtradas.filter((m) => m.obtenida);
    }

    return filtradas;
  }

  verDetalleMedalla(medalla: Medalla): void {
    this.medallaSeleccionada = medalla;
    this.modalMedallaActivo = true;
  }

  cerrarModalMedalla(): void {
    this.modalMedallaActivo = false;
    this.medallaSeleccionada = null;
  }

  obtenerClaseDificultad(dificultad: string): string {
    const clases: { [key: string]: string } = {
      bronce: 'dificultad-bronce',
      plata: 'dificultad-plata',
      oro: 'dificultad-oro',
      diamante: 'dificultad-diamante',
    };
    return clases[dificultad] || '';
  }

  obtenerColorProgreso(progreso: number): string {
    if (progreso >= 75) return '#4caf50';
    if (progreso >= 50) return '#ff9800';
    if (progreso >= 25) return '#2196f3';
    return '#9e9e9e';
  }

  recargarMedallas(): void {
    console.log('🔄 Recargando medallas...');
    this.cargarMedallas();
  }

  volverAlDashboard(): void {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }

  // Métodos de utilidad para el template
  getNumeroMedallasObtenidas(): number {
    return this.medallasObtenidas.length;
  }

  getNumeroMedallasTotal(): number {
    return this.medallas.length;
  }

  getPorcentajeProgreso(): number {
    return this.estadisticas.porcentaje || 0;
  }

  getMedallasMasRecientes(): Medalla[] {
    return this.medallasObtenidas
      .filter((m) => m.fechaObtencion)
      .sort((a, b) => new Date(b.fechaObtencion!).getTime() - new Date(a.fechaObtencion!).getTime())
      .slice(0, 3);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '';

    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return '';
    }
  }

  formatearTimestamp(timestamp: number): string {
    try {
      return new Date(timestamp).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  }

  // Método para debugging
  debugMedallas(): void {
    console.log('Estado actual del medallero:', {
      estadoUsuario: this.estadoUsuario,
      medallas: this.medallas.length,
      obtenidas: this.medallasObtenidas.length,
      estadisticas: this.estadisticas,
      filtros: {
        categoria: this.categoriaSeleccionada,
        dificultad: this.dificultadSeleccionada,
        soloObtenidas: this.soloObtenidas,
      },
    });
  }

  // Métodos para notificaciones
  mostrarNotificacionMedalla(medalla: Medalla): void {
    // Crear notificación visual temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-medalla';
    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        <span class="notificacion-icono">${medalla.icono}</span>
        <div class="notificacion-texto">
          <h4>¡Nueva medalla!</h4>
          <p>${medalla.nombre}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notificacion);

    // Animar entrada
    setTimeout(() => notificacion.classList.add('mostrar'), 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      notificacion.classList.remove('mostrar');
      setTimeout(() => document.body.removeChild(notificacion), 300);
    }, 4000);
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  marcarNotificacionLeida(notificacion: NotificacionMedalla): void {
    this.medallasService.marcarNotificacionLeida(notificacion.timestamp);
    const index = this.notificacionesRecientes.findIndex(
      (n) => n.timestamp === notificacion.timestamp,
    );
    if (index !== -1) {
      this.notificacionesRecientes.splice(index, 1);
    }
  }

  getNotificacionesNoLeidas(): number {
    return this.notificacionesRecientes.length;
  }
}
