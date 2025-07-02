// ===================================================================================================
// SERVICIO DE MEDALLAS Y GAMIFICACIÓN - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

// ===================================================================================================
// INTERFACES DE TIPOS DE DATOS
// ===================================================================================================

/**
 * Interface para definir la estructura de una medalla en el sistema
 * Contiene información completa de logros y gamificación
 */
export interface Medalla {
  /** ID único de la medalla */
  id: number;
  /** Nombre descriptivo de la medalla */
  nombre: string;
  /** Descripción detallada del logro */
  descripcion: string;
  /** Emoji o icono representativo */
  icono: string;
  /** Categoría temática de la medalla */
  categoria: string;
  /** Nivel de dificultad para obtener la medalla */
  dificultad: 'bronce' | 'plata' | 'oro' | 'diamante';
  /** Función que evalúa si se cumple la condición para obtener la medalla */
  condicion: (estado: any) => boolean;
  /** Flag indicando si el usuario ya obtuvo esta medalla */
  obtenida?: boolean;
  /** Fecha en que se obtuvo la medalla */
  fechaObtencion?: string;
  /** Progreso actual hacia obtener la medalla (0-100) */
  progreso?: number;
}

/**
 * Interface para notificaciones de nuevas medallas obtenidas
 * Usado para mostrar alertas y mensajes de felicitación
 */
export interface NotificacionMedalla {
  /** Datos completos de la medalla obtenida */
  medalla: Medalla;
  /** Timestamp de cuando se obtuvo la medalla */
  timestamp: number;
}

// ===================================================================================================
// SERVICIO PRINCIPAL DE MEDALLAS
// ===================================================================================================

/**
 * Servicio de medallas y gamificación para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Gestión completa del sistema de medallas
 * - Evaluación automática de condiciones de logros
 * - Notificaciones reactivas de nuevas medallas
 * - Categorización y estadísticas de progreso
 * - Persistencia de datos en localStorage
 * - Sistema de recompensas y motivación
 *
 * El servicio evalúa constantemente el progreso del usuario
 * y otorga medallas automáticamente cuando se cumplen las condiciones.
 *
 * @author Sistema Kütsa
 * @version 2.0 - Sistema de gamificación avanzado
 */
@Injectable({
  providedIn: 'root',
})
export class MedallasService {
  // ===================================================================================================
  // SUBJECTS REACTIVOS PARA NOTIFICACIONES
  // ===================================================================================================

  /** Subject para emitir notificaciones de nuevas medallas */
  private nuevaMedallaSubject = new Subject<NotificacionMedalla>();
  /** Observable público para suscribirse a nuevas medallas */
  public nuevaMedalla$ = this.nuevaMedallaSubject.asObservable();

  /** Subject para manejar la lista de medallas obtenidas */
  private medallasObtenidasSubject = new BehaviorSubject<Medalla[]>([]);
  /** Observable público para suscribirse a cambios en medallas obtenidas */
  public medallasObtenidas$ = this.medallasObtenidasSubject.asObservable();

  // ===================================================================================================
  // DEFINICIÓN COMPLETA DE MEDALLAS DEL SISTEMA
  // ===================================================================================================

  /** Array con todas las medallas disponibles en el sistema */
  private todasLasMedallas: Medalla[] = [
    // ===========================================================================================
    // MEDALLAS DE RACHA - Logros por consistencia diaria
    // ===========================================================================================
    {
      id: 1,
      nombre: 'Primer Paso',
      descripcion: 'Inicia tu primera racha de aprendizaje',
      icono: '🌱',
      categoria: 'Racha',
      dificultad: 'bronce',
      condicion: (estado: any) => estado.rachaDias >= 1,
    },
    {
      id: 2,
      nombre: 'Constancia',
      descripcion: 'Mantén una racha de 3 días consecutivos',
      icono: '🔥',
      categoria: 'Racha',
      dificultad: 'bronce',
      condicion: (estado: any) => estado.rachaDias >= 3,
    },
    {
      id: 3,
      nombre: 'Dedicación',
      descripcion: 'Mantén una racha de 7 días consecutivos',
      icono: '⚡',
      categoria: 'Racha',
      dificultad: 'plata',
      condicion: (estado: any) => estado.rachaDias >= 7,
    },
    {
      id: 4,
      nombre: 'Imparable',
      descripcion: 'Mantén una racha de 15 días consecutivos',
      icono: '🏆',
      categoria: 'Racha',
      dificultad: 'oro',
      condicion: (estado: any) => estado.rachaDias >= 15,
    },
    {
      id: 5,
      nombre: 'Leyenda',
      descripcion: 'Mantén una racha de 30 días consecutivos',
      icono: '💎',
      categoria: 'Racha',
      dificultad: 'diamante',
      condicion: (estado: any) => estado.rachaDias >= 30,
    },

    // Medallas de Desafíos
    {
      id: 6,
      nombre: 'Explorador',
      descripcion: 'Completa tu primer desafío',
      icono: '🎯',
      categoria: 'Desafíos',
      dificultad: 'bronce',
      condicion: (estado: any) => estado.desafiosResueltos >= 1,
    },
    {
      id: 7,
      nombre: 'Desafiante',
      descripcion: 'Resuelve 5 desafíos',
      icono: '🎪',
      categoria: 'Desafíos',
      dificultad: 'plata',
      condicion: (estado: any) => estado.desafiosResueltos >= 5,
    },
    {
      id: 8,
      nombre: 'Maestro de Desafíos',
      descripcion: 'Resuelve 15 desafíos',
      icono: '�',
      categoria: 'Desafíos',
      dificultad: 'oro',
      condicion: (estado: any) => estado.desafiosResueltos >= 15,
    },
    {
      id: 9,
      nombre: 'Campeón',
      descripcion: 'Resuelve 25 desafíos',
      icono: '👑',
      categoria: 'Desafíos',
      dificultad: 'diamante',
      condicion: (estado: any) => estado.desafiosResueltos >= 25,
    },

    // Medallas de Cursos
    {
      id: 10,
      nombre: 'Estudiante',
      descripcion: 'Inscríbete en tu primer curso',
      icono: '📚',
      categoria: 'Cursos',
      dificultad: 'bronce',
      condicion: (estado: any) => estado.cursosInscritos >= 1,
    },
    {
      id: 11,
      nombre: 'Graduado',
      descripcion: 'Completa tu primer curso',
      icono: '🎓',
      categoria: 'Cursos',
      dificultad: 'plata',
      condicion: (estado: any) => estado.cursosCompletados >= 1,
    },
    {
      id: 12,
      nombre: 'Erudito',
      descripcion: 'Completa 3 cursos',
      icono: '📖',
      categoria: 'Cursos',
      dificultad: 'oro',
      condicion: (estado: any) => estado.cursosCompletados >= 3,
    },
    {
      id: 13,
      nombre: 'Sabio',
      descripcion: 'Completa 5 cursos',
      icono: '🧠',
      categoria: 'Cursos',
      dificultad: 'diamante',
      condicion: (estado: any) => estado.cursosCompletados >= 5,
    },

    // Medallas Especiales
    {
      id: 14,
      nombre: 'Protección Activada',
      descripcion: 'Usa protección de racha al menos una vez',
      icono: '🛡️',
      categoria: 'Especiales',
      dificultad: 'plata',
      condicion: (estado: any) => estado.usoProteccionRacha >= 1,
    },
    {
      id: 15,
      nombre: 'Recuperación Lograda',
      descripcion: 'Recupera una racha perdida',
      icono: '💪',
      categoria: 'Especiales',
      dificultad: 'oro',
      condicion: (estado: any) => estado.recuperacionesUsadas >= 1,
    },
    {
      id: 16,
      nombre: 'Comunicador',
      descripcion: 'Participa en el foro creando 3 publicaciones',
      icono: '💬',
      categoria: 'Especiales',
      dificultad: 'plata',
      condicion: (estado: any) => estado.publicacionesForo >= 3,
    },
    {
      id: 17,
      nombre: 'Colaborador',
      descripcion: 'Responde 10 veces en el foro',
      icono: '🤝',
      categoria: 'Especiales',
      dificultad: 'oro',
      condicion: (estado: any) => estado.respuestasForo >= 10,
    },
    {
      id: 18,
      nombre: 'Veterano',
      descripcion: 'Lleva más de 30 días registrado',
      icono: '⭐',
      categoria: 'Especiales',
      dificultad: 'diamante',
      condicion: (estado: any) => estado.diasRegistrado >= 30,
    },
  ];

  obtenerMedallas(estadoUsuario: any): Medalla[] {
    const medallasObtenidas = this.obtenerMedallasObtenidas();

    return this.todasLasMedallas.map((medalla) => {
      const obtenida = medalla.condicion(estadoUsuario);
      const medallaObtenida = medallasObtenidas.find((m) => m.id === medalla.id);

      return {
        ...medalla,
        obtenida,
        fechaObtencion: medallaObtenida?.fechaObtencion,
        progreso: this.calcularProgreso(medalla, estadoUsuario),
      };
    });
  }

  private calcularProgreso(medalla: Medalla, estado: any): number {
    // Calcular progreso para medallas no obtenidas
    if (medalla.obtenida) return 100;

    switch (medalla.id) {
      case 1:
        return Math.min((estado.rachaDias / 1) * 100, 100);
      case 2:
        return Math.min((estado.rachaDias / 3) * 100, 100);
      case 3:
        return Math.min((estado.rachaDias / 7) * 100, 100);
      case 4:
        return Math.min((estado.rachaDias / 15) * 100, 100);
      case 5:
        return Math.min((estado.rachaDias / 30) * 100, 100);
      case 6:
        return Math.min((estado.desafiosResueltos / 1) * 100, 100);
      case 7:
        return Math.min((estado.desafiosResueltos / 5) * 100, 100);
      case 8:
        return Math.min((estado.desafiosResueltos / 15) * 100, 100);
      case 9:
        return Math.min((estado.desafiosResueltos / 25) * 100, 100);
      case 10:
        return Math.min((estado.cursosInscritos / 1) * 100, 100);
      case 11:
        return Math.min((estado.cursosCompletados / 1) * 100, 100);
      case 12:
        return Math.min((estado.cursosCompletados / 3) * 100, 100);
      case 13:
        return Math.min((estado.cursosCompletados / 5) * 100, 100);
      case 16:
        return Math.min((estado.publicacionesForo / 3) * 100, 100);
      case 17:
        return Math.min((estado.respuestasForo / 10) * 100, 100);
      case 18:
        return Math.min((estado.diasRegistrado / 30) * 100, 100);
      default:
        return 0;
    }
  }

  marcarMedallaObtenida(medallaId: number): void {
    const medallasObtenidas = this.obtenerMedallasObtenidas();

    if (!medallasObtenidas.find((m) => m.id === medallaId)) {
      medallasObtenidas.push({
        id: medallaId,
        fechaObtencion: new Date().toISOString(),
      });

      localStorage.setItem('medallasObtenidas', JSON.stringify(medallasObtenidas));
    }
  }

  private obtenerMedallasObtenidas(): any[] {
    try {
      return JSON.parse(localStorage.getItem('medallasObtenidas') || '[]');
    } catch (error) {
      return [];
    }
  }

  obtenerEstadisticas(): any {
    const medallas = this.obtenerMedallas(this.obtenerEstadoUsuario());
    const obtenidas = medallas.filter((m) => m.obtenida);

    return {
      total: medallas.length,
      obtenidas: obtenidas.length,
      porcentaje: Math.round((obtenidas.length / medallas.length) * 100),
      porCategoria: this.obtenerEstadisticasPorCategoria(medallas),
    };
  }

  private obtenerEstadisticasPorCategoria(medallas: Medalla[]): any {
    const categorias = ['Racha', 'Desafíos', 'Cursos', 'Especiales'];
    const stats: any = {};

    categorias.forEach((categoria) => {
      const medallasCategoria = medallas.filter((m) => m.categoria === categoria);
      const obtenidas = medallasCategoria.filter((m) => m.obtenida);

      stats[categoria] = {
        total: medallasCategoria.length,
        obtenidas: obtenidas.length,
        porcentaje:
          medallasCategoria.length > 0
            ? Math.round((obtenidas.length / medallasCategoria.length) * 100)
            : 0,
      };
    });

    return stats;
  }

  obtenerEstadoUsuario(): any {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const cursosInscritos = JSON.parse(localStorage.getItem('cursosInscritos') || '[]');
      const desafiosCompletados = JSON.parse(localStorage.getItem('desafiosCompletados') || '[]');

      // Calcular días registrado
      const fechaRegistro = user.fechaRegistro ? new Date(user.fechaRegistro) : new Date();
      const diasRegistrado = Math.floor(
        (Date.now() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        rachaDias: user.rachaDias || 0,
        desafiosResueltos: desafiosCompletados.length || 0,
        cursosInscritos: cursosInscritos.length || 0,
        cursosCompletados: user.cursosCompletados || 0,
        usoProteccionRacha: user.proteccionesUsadas || 0,
        recuperacionesUsadas: user.recuperacionesUsadas || 0,
        publicacionesForo: user.publicacionesForo || 0,
        respuestasForo: user.respuestasForo || 0,
        diasRegistrado,
      };
    } catch (error) {
      return {
        rachaDias: 0,
        desafiosResueltos: 0,
        cursosInscritos: 0,
        cursosCompletados: 0,
        usoProteccionRacha: 0,
        recuperacionesUsadas: 0,
        publicacionesForo: 0,
        respuestasForo: 0,
        diasRegistrado: 0,
      };
    }
  }

  verificarNuevasMedallas(): Medalla[] {
    const estado = this.obtenerEstadoUsuario();
    const medallas = this.obtenerMedallas(estado);
    const nuevasMedallas: Medalla[] = [];

    medallas.forEach((medalla) => {
      if (medalla.obtenida && !medalla.fechaObtencion) {
        this.marcarMedallaObtenida(medalla.id);
        nuevasMedallas.push(medalla);

        // Emitir notificación de nueva medalla
        this.nuevaMedallaSubject.next({
          medalla: medalla,
          timestamp: Date.now(),
        });
      }
    });

    // Actualizar el subject de medallas obtenidas
    const todasObtenidas = medallas.filter((m) => m.obtenida);
    this.medallasObtenidasSubject.next(todasObtenidas);

    return nuevasMedallas;
  }

  // Método para obtener todas las notificaciones recientes
  obtenerNotificacionesRecientes(): NotificacionMedalla[] {
    const notificaciones = localStorage.getItem('notificaciones_medallas');
    if (!notificaciones) return [];

    const parsed = JSON.parse(notificaciones);
    // Mantener solo las últimas 10 notificaciones de los últimos 7 días
    const hace7Dias = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return parsed.filter((n: NotificacionMedalla) => n.timestamp > hace7Dias).slice(-10);
  }

  // Método para guardar notificación
  private guardarNotificacion(notificacion: NotificacionMedalla): void {
    const notificaciones = this.obtenerNotificacionesRecientes();
    notificaciones.push(notificacion);
    localStorage.setItem('notificaciones_medallas', JSON.stringify(notificaciones));
  }

  // Método para marcar notificación como leída
  marcarNotificacionLeida(timestamp: number): void {
    const notificaciones = this.obtenerNotificacionesRecientes();
    const index = notificaciones.findIndex((n) => n.timestamp === timestamp);
    if (index !== -1) {
      notificaciones.splice(index, 1);
      localStorage.setItem('notificaciones_medallas', JSON.stringify(notificaciones));
    }
  }
}
