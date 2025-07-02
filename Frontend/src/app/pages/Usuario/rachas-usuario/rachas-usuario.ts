// ===================================================================================================
// IMPORTACIONES Y DEPENDENCIAS
// ===================================================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MedallasService } from '../../../services/medallas.service';
import { Subscription } from 'rxjs';

// ===================================================================================================
// INTERFACES DE TIPOS DE DATOS
// ===================================================================================================

/**
 * Interface que define la estructura de un objetivo de racha
 * Representa una meta que el usuario puede alcanzar manteniendo su racha
 */
interface Objetivo {
  dias: number; // Número de días requeridos para completar el objetivo
  descripcion: string; // Descripción detallada del objetivo
  icono: string; // Emoji o icono que representa el objetivo
  titulo: string; // Título descriptivo del objetivo
  recompensa: string; // Descripción de la recompensa al completar el objetivo
  completado: boolean; // Estado de completado del objetivo
  progreso: number; // Porcentaje de progreso hacia el objetivo (0-100)
}

/**
 * Interface que define las estadísticas completas de racha del usuario
 * Contiene toda la información sobre el estado actual y histórico de las rachas
 */
interface EstadisticaRacha {
  rachaActual: number; // Días consecutivos actuales de la racha
  rachaMaxima: number; // Máximo número de días consecutivos alcanzados
  totalDias: number; // Total de días activos acumulados
  fechaUltimaActividad: Date | null; // Fecha de la última actividad registrada
  proteccionesDisponibles: number; // Número de protecciones disponibles para usar
  proteccionesUsadas: number; // Número de protecciones ya utilizadas
  recuperacionesUsadas: number; // Número de recuperaciones ya utilizadas
}

// ===================================================================================================
// COMPONENTE PRINCIPAL DE RACHAS
// ===================================================================================================

/**
 * Componente RachasUsuario
 *
 * Gestiona el sistema completo de rachas del usuario, incluyendo:
 * - Tracking de actividad diaria y rachas consecutivas
 * - Sistema de objetivos gamificados con recompensas
 * - Mecánicas de protección y recuperación de rachas
 * - Integración con sistema de medallas
 * - Persistencia de datos en localStorage
 * - Interfaz visual moderna y responsive
 *
 * @author Sistema Kütsa
 * @version 2.0 - Sistema gamificado avanzado
 */
@Component({
  selector: 'app-rachas-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rachas-usuario.html',
  styleUrl: './rachas-usuario.css',
})
export class RachasUsuario implements OnInit, OnDestroy {
  // ===================================================================================================
  // PROPIEDADES DE ESTADO DE CARGA
  // ===================================================================================================

  /** Indica si el componente está cargando datos */
  cargando = false;

  /** Mensaje de error si ocurre algún problema durante la carga */
  errorCarga = '';

  // ===================================================================================================
  // DATOS PRINCIPALES DEL SISTEMA DE RACHAS
  // ===================================================================================================

  /**
   * Estadísticas completas de la racha del usuario
   * Se inicializa con valores por defecto y se actualiza con datos reales
   */
  estadisticas: EstadisticaRacha = {
    rachaActual: 0,
    rachaMaxima: 0,
    totalDias: 0,
    fechaUltimaActividad: null,
    proteccionesDisponibles: 3, // Valor inicial por defecto
    proteccionesUsadas: 0,
    recuperacionesUsadas: 0,
  };

  // ===================================================================================================
  // CONFIGURACIÓN DE OBJETIVOS GAMIFICADOS
  // ===================================================================================================

  /**
   * Array de objetivos de racha definidos en el sistema
   * Cada objetivo representa una meta progresiva que motiva al usuario
   * a mantener su racha por períodos específicos de tiempo
   */
  objetivos: Objetivo[] = [
    {
      dias: 3,
      titulo: 'Primer Impulso',
      descripcion: '¡Mantén la racha por 3 días consecutivos!',
      icono: '🌱', // Icono que representa crecimiento inicial
      recompensa: '+50 puntos', // Recompensa básica para motivar inicio
      completado: false,
      progreso: 0,
    },
    {
      dias: 7,
      titulo: 'Una Semana Fuerte',
      descripcion: '¡Una semana completa de actividad continua!',
      icono: '🔥', // Icono de fuego para representar constancia
      recompensa: '+100 puntos + Protección', // Incluye power-up de protección
      completado: false,
      progreso: 0,
    },
    {
      dias: 14,
      titulo: 'Dos Semanas Imparable',
      descripcion: '¡Dos semanas seguidas aprendiendo!',
      icono: '💪', // Icono de fuerza para representar resistencia
      recompensa: '+200 puntos + Medalla', // Incluye reconocimiento con medalla
      completado: false,
      progreso: 0,
    },
    {
      dias: 30,
      titulo: 'Mes Legendario',
      descripcion: '¡Un mes completo de racha increíble!',
      icono: '🏆', // Trofeo para logro significativo
      recompensa: '+500 puntos + Recuperación', // Incluye power-up de recuperación
      completado: false,
      progreso: 0,
    },
    {
      dias: 60,
      titulo: 'Maestro de la Constancia',
      descripcion: '¡Dos meses sin fallar ni un día!',
      icono: '🌟', // Estrella para nivel de maestría
      recompensa: '+1000 puntos + Título', // Recompensa premium con título
      completado: false,
      progreso: 0,
    },
    {
      dias: 100,
      titulo: 'Leyenda Centenaria',
      descripcion: '¡100 días de constancia absoluta!',
      icono: '💎', // Diamante para el logro más alto
      recompensa: '+2000 puntos + Medalla Especial', // Máxima recompensa
      completado: false,
      progreso: 0,
    },
  ];

  // ===================================================================================================
  // ESTADOS DE INTERFAZ Y MODALES
  // ===================================================================================================

  /** Control de visibilidad del modal de estadísticas detalladas */
  modalRachaActivo = false;

  /** Control de visibilidad del modal de confirmación de protección */
  modalProteccionActivo = false;

  /** Control de visibilidad del modal de confirmación de recuperación */
  modalRecuperacionActivo = false;

  /** Control de visibilidad del modal de mensajes de confirmación */
  modalConfirmacionActivo = false;

  /** Mensaje que se muestra en el modal de confirmación */
  mensajeConfirmacion = '';

  // ===================================================================================================
  // ESTADOS DE MECÁNICAS DE PROTECCIÓN Y RECUPERACIÓN
  // ===================================================================================================

  /** Indica si el usuario puede usar una protección de racha actualmente */
  puedeUsarProteccion = false;

  /** Indica si el usuario puede usar una recuperación de racha actualmente */
  puedeUsarRecuperacion = false;

  /** Indica si la racha actual está en peligro de perderse */
  rachaEnPeligro = false;

  // ===================================================================================================
  // GESTIÓN DE SUBSCRIPCIONES REACTIVE
  // ===================================================================================================

  /** Subscription para manejar observables y evitar memory leaks */
  private subscription: Subscription = new Subscription();

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del componente
   * Inyecta los servicios necesarios para el funcionamiento del sistema de rachas
   *
   * @param userService - Servicio para gestión de datos del usuario
   * @param medallasService - Servicio para gestión del sistema de medallas
   * @param router - Router de Angular para navegación
   */
  constructor(
    private userService: UserService,
    private medallasService: MedallasService,
    private router: Router,
  ) {}

  // ===================================================================================================
  // MÉTODOS DEL CICLO DE VIDA DEL COMPONENTE
  // ===================================================================================================

  /**
   * Método de inicialización del componente
   * Se ejecuta automáticamente cuando el componente se carga
   * Inicia todos los procesos necesarios para el sistema de rachas
   */
  ngOnInit(): void {
    console.log('🔥 Iniciando sistema de rachas...');
    this.cargarDatosRacha(); // Carga datos desde localStorage y userService
    this.verificarEstadoRacha(); // Analiza el estado actual de la racha
    this.actualizarObjetivos(); // Actualiza progreso de objetivos
  }

  /**
   * Método de limpieza del componente
   * Se ejecuta automáticamente cuando el componente se destruye
   * Limpia las subscripciones para evitar memory leaks
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ===================================================================================================
  // MÉTODOS DE CARGA Y GESTIÓN DE DATOS
  // ===================================================================================================

  /**
   * Carga los datos de racha desde múltiples fuentes
   * Combina datos del userService con datos persistidos en localStorage
   * Maneja estados de carga y errores de forma robusta
   */
  cargarDatosRacha(): void {
    this.cargando = true;
    this.errorCarga = '';

    try {
      // Obtener datos del usuario actual desde el servicio
      const user = this.userService.getUsuarioActual();

      // Obtener datos adicionales de racha desde localStorage
      const datosRacha = this.obtenerDatosRachaLocalStorage();

      // Combinar datos de ambas fuentes en el objeto de estadísticas
      this.estadisticas = {
        rachaActual: user.rachaDias || 0, // Racha actual del usuario
        rachaMaxima: datosRacha.rachaMaxima || user.rachaDias || 0, // Máxima racha alcanzada
        totalDias: datosRacha.totalDias || user.rachaDias || 0, // Total de días activos
        fechaUltimaActividad: datosRacha.fechaUltimaActividad // Última fecha de actividad
          ? new Date(datosRacha.fechaUltimaActividad)
          : null,
        proteccionesDisponibles: datosRacha.proteccionesDisponibles || 3, // Protecciones disponibles
        proteccionesUsadas: datosRacha.proteccionesUsadas || 0, // Protecciones ya usadas
        recuperacionesUsadas: datosRacha.recuperacionesUsadas || 0, // Recuperaciones ya usadas
      };

      // Actualizar racha máxima si la actual es mayor (nuevo récord)
      if (this.estadisticas.rachaActual > this.estadisticas.rachaMaxima) {
        this.estadisticas.rachaMaxima = this.estadisticas.rachaActual;
        this.guardarDatosRacha(); // Persistir el nuevo récord
      }

      this.cargando = false;
      console.log('✅ Datos de racha cargados:', this.estadisticas);
    } catch (error) {
      console.error('❌ Error al cargar datos de racha:', error);
      this.errorCarga = 'Error al cargar los datos de racha';
      this.cargando = false;
    }
  }

  /**
   * Obtiene datos de racha persistidos en localStorage
   * Incluye verificación de compatibilidad con SSR (Server-Side Rendering)
   *
   * @returns Objeto con datos de racha o objeto vacío si no hay datos
   */
  private obtenerDatosRachaLocalStorage(): any {
    try {
      // Verificar disponibilidad de localStorage (no disponible en SSR)
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem('datosRacha') || '{}');
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  private guardarDatosRacha(): void {
    if (typeof localStorage !== 'undefined') {
      const datosRacha = {
        rachaMaxima: this.estadisticas.rachaMaxima,
        totalDias: this.estadisticas.totalDias,
        fechaUltimaActividad: this.estadisticas.fechaUltimaActividad?.toISOString(),
        proteccionesDisponibles: this.estadisticas.proteccionesDisponibles,
        proteccionesUsadas: this.estadisticas.proteccionesUsadas,
        recuperacionesUsadas: this.estadisticas.recuperacionesUsadas,
      };

      localStorage.setItem('datosRacha', JSON.stringify(datosRacha));
    }
  }

  private verificarEstadoRacha(): void {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    if (this.estadisticas.fechaUltimaActividad) {
      const fechaUltima = new Date(this.estadisticas.fechaUltimaActividad);
      const fechaUltimaLocal = new Date(
        fechaUltima.getFullYear(),
        fechaUltima.getMonth(),
        fechaUltima.getDate(),
      );

      const diferenciaDias = Math.floor(
        (hoy.getTime() - fechaUltimaLocal.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diferenciaDias === 1) {
        this.rachaEnPeligro = true;
        this.puedeUsarProteccion = this.estadisticas.proteccionesDisponibles > 0;
      } else if (diferenciaDias > 1) {
        this.puedeUsarRecuperacion = this.estadisticas.rachaActual > 0;
      }
    }
  }

  private actualizarObjetivos(): void {
    this.objetivos = this.objetivos.map((objetivo) => {
      const completado = this.estadisticas.rachaActual >= objetivo.dias;
      const progreso = Math.min((this.estadisticas.rachaActual / objetivo.dias) * 100, 100);

      return {
        ...objetivo,
        completado,
        progreso,
      };
    });
  }

  usarProteccionRacha(): void {
    if (!this.puedeUsarProteccion || this.estadisticas.proteccionesDisponibles <= 0) {
      this.mostrarMensaje('No tienes protecciones disponibles');
      return;
    }

    this.modalProteccionActivo = true;
  }

  confirmarProteccion(): void {
    this.estadisticas.proteccionesDisponibles--;
    this.estadisticas.proteccionesUsadas++;
    this.estadisticas.fechaUltimaActividad = new Date();

    // Actualizar user service
    this.userService.actualizarConexion();

    this.guardarDatosRacha();
    this.verificarEstadoRacha();

    this.modalProteccionActivo = false;
    this.mostrarMensaje('¡Protección de racha activada! Tu racha está a salvo.');

    console.log('🛡️ Protección de racha usada');
  }

  usarRecuperacionRacha(): void {
    if (!this.puedeUsarRecuperacion) {
      this.mostrarMensaje('No puedes usar recuperación en este momento');
      return;
    }

    this.modalRecuperacionActivo = true;
  }

  confirmarRecuperacion(): void {
    // Recuperar la mitad de la racha perdida (mínimo 1 día)
    const rachaRecuperada = Math.max(1, Math.floor(this.estadisticas.rachaMaxima / 2));

    this.estadisticas.rachaActual = rachaRecuperada;
    this.estadisticas.recuperacionesUsadas++;
    this.estadisticas.fechaUltimaActividad = new Date();

    // Actualizar user service
    const user = this.userService.getUsuarioActual();
    user.rachaDias = rachaRecuperada;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('usuario_actual', JSON.stringify(user));
    }

    this.guardarDatosRacha();
    this.verificarEstadoRacha();
    this.actualizarObjetivos();

    this.modalRecuperacionActivo = false;
    this.mostrarMensaje(`¡Racha recuperada! Vuelves a tener ${rachaRecuperada} días.`);

    console.log('💪 Recuperación de racha usada');
  }

  marcarActividadHoy(): void {
    const user = this.userService.getUsuarioActual();
    const nuevaRacha = this.estadisticas.rachaActual + 1;

    user.rachaDias = nuevaRacha;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('usuario_actual', JSON.stringify(user));
    }

    this.estadisticas.rachaActual = nuevaRacha;
    this.estadisticas.totalDias++;
    this.estadisticas.fechaUltimaActividad = new Date();

    if (nuevaRacha > this.estadisticas.rachaMaxima) {
      this.estadisticas.rachaMaxima = nuevaRacha;
    }

    this.guardarDatosRacha();
    this.actualizarObjetivos();
    this.verificarNuevasMedallas();

    this.mostrarMensaje('¡Actividad registrada! Tu racha continúa.');

    console.log('✅ Actividad del día registrada');
  }

  private verificarNuevasMedallas(): void {
    // Verificar si se desbloquearon nuevas medallas de racha
    const nuevasMedallas = this.medallasService.verificarNuevasMedallas();

    if (nuevasMedallas.length > 0) {
      const medallasRacha = nuevasMedallas.filter((m) => m.categoria === 'Racha');
      if (medallasRacha.length > 0) {
        this.mostrarMensaje(
          `¡Felicidades! Has obtenido ${medallasRacha.length} nueva(s) medalla(s) de racha!`,
        );
      }
    }
  }

  verDetalleRacha(): void {
    this.modalRachaActivo = true;
  }

  private mostrarMensaje(mensaje: string): void {
    this.mensajeConfirmacion = mensaje;
    this.modalConfirmacionActivo = true;

    setTimeout(() => {
      this.modalConfirmacionActivo = false;
      this.mensajeConfirmacion = '';
    }, 3000);
  }

  // Métodos para cerrar modales
  cerrarModalRacha(): void {
    this.modalRachaActivo = false;
  }

  cerrarModalProteccion(): void {
    this.modalProteccionActivo = false;
  }

  cerrarModalRecuperacion(): void {
    this.modalRecuperacionActivo = false;
  }

  // Métodos de utilidad para el template
  obtenerColorProgreso(progreso: number): string {
    if (progreso >= 100) return '#4caf50';
    if (progreso >= 75) return '#8bc34a';
    if (progreso >= 50) return '#ff9800';
    if (progreso >= 25) return '#2196f3';
    return '#9e9e9e';
  }

  obtenerDiasRestantes(objetivo: Objetivo): number {
    return Math.max(0, objetivo.dias - this.estadisticas.rachaActual);
  }

  formatearFecha(fecha: Date | null): string {
    if (!fecha) return 'Nunca';

    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getTiempoSinActividad(): string {
    if (!this.estadisticas.fechaUltimaActividad) return 'Sin actividad previa';

    const ahora = new Date();
    const diferencia = ahora.getTime() - this.estadisticas.fechaUltimaActividad.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    return 'Hoy';
  }

  calcularRecuperacion(): number {
    return Math.max(1, Math.floor(this.estadisticas.rachaMaxima / 2));
  }

  volverAlDashboard(): void {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }

  // Método para debugging
  debugRachas(): void {
    console.log('Estado actual del sistema de rachas:', {
      estadisticas: this.estadisticas,
      objetivos: this.objetivos.map((o) => ({
        titulo: o.titulo,
        completado: o.completado,
        progreso: o.progreso,
      })),
      estados: {
        rachaEnPeligro: this.rachaEnPeligro,
        puedeUsarProteccion: this.puedeUsarProteccion,
        puedeUsarRecuperacion: this.puedeUsarRecuperacion,
      },
    });
  }
}
