import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Interfaz que define la estructura de un Hilo del foro
 *
 * @interface Hilo
 * @description Representa un hilo de conversación en el foro comunitario
 *              donde los usuarios pueden hacer preguntas y compartir conocimiento
 *
 * @property {number} id - Identificador único del hilo (opcional para nuevos hilos)
 * @property {string} titulo - Título o asunto del hilo
 * @property {string} contenido - Contenido principal del mensaje del hilo
 * @property {string} fecha_publicacion - Fecha de creación del hilo (opcional)
 * @property {number} id_usuario - ID del usuario que creó el hilo (opcional)
 * @property {string} autor - Nombre del autor del hilo (opcional)
 * @property {Respuesta[]} respuestas - Array de respuestas al hilo (opcional)
 */
export interface Hilo {
  id?: number;
  titulo: string;
  contenido: string;
  fecha_publicacion?: string;
  id_usuario?: number;
  autor?: string;
  respuestas?: Respuesta[];
}

/**
 * Interfaz que define la estructura de una Respuesta en el foro
 *
 * @interface Respuesta
 * @description Representa una respuesta a un hilo del foro
 *
 * @property {number} id - Identificador único de la respuesta (opcional)
 * @property {string} contenido - Contenido de la respuesta
 * @property {string} fecha_respuesta - Fecha de la respuesta (opcional)
 * @property {number} id_usuario - ID del usuario que escribió la respuesta (opcional)
 * @property {number} id_hilo - ID del hilo al que pertenece la respuesta (opcional)
 * @property {string} autor - Nombre del autor de la respuesta (opcional)
 */
export interface Respuesta {
  id?: number;
  contenido: string;
  fecha_respuesta?: string;
  id_usuario?: number;
  id_hilo?: number;
  autor?: string;
}

/**
 * Servicio de gestión del Foro comunitario
 *
 * @class ForoService
 * @description Maneja todas las operaciones relacionadas con el foro de la plataforma.
 *              Permite a los usuarios crear hilos de discusión, responder a otros usuarios
 *              y participar en la comunidad de aprendizaje.
 *
 * Funcionalidades principales:
 * - Gestión de hilos de conversación (CRUD)
 * - Sistema de respuestas anidadas
 * - Integración con API REST del backend Django
 * - Sistema de fallback con datos locales
 * - Autenticación JWT automática
 * - Asociación automática con usuarios
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class ForoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  /** URL base de la API REST para el foro */
  private apiUrl = environment.apiUrl + 'foro/';

  /**
   * Datos locales de hilos para fallback y desarrollo
   * @description Array de hilos predefinidos que se utilizan cuando la API no está disponible
   *              Incluye ejemplos de hilos con respuestas para testing
   */
  private hilos = [
    {
      id: 1,
      titulo: '¿Cómo resolvieron la misión lógica?',
      autor: 'usuario1',
      contenido: 'Necesito ayuda con el último desafío',
      fecha_publicacion: '2024-01-15',
      respuestas: [
        { autor: 'usuario2', contenido: 'Usé un patrón XOR básico.' },
        { autor: 'usuario3', contenido: '¡Yo también! Fue un reto genial.' },
      ],
    },
    {
      id: 2,
      titulo: 'Dudas sobre estilo retro en CSS',
      autor: 'usuario2',
      contenido: '¿Alguien puede ayudarme con los estilos retro?',
      fecha_publicacion: '2024-01-14',
      respuestas: [],
    },
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del servicio
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor() {}

  // ===================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ===================================

  /**
   * Manejador genérico de errores HTTP
   * @private
   * @template T
   * @param {string} operation - Nombre de la operación que falló
   * @param {T} result - Valor por defecto a retornar en caso de error
   * @returns {Function} Función que maneja el error y retorna un Observable con el resultado por defecto
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  /**
   * Obtiene el ID del usuario actual desde el localStorage
   * @private
   * @returns {number} ID del usuario logueado o 1 por defecto
   * @description Extrae el ID del usuario actual almacenado en localStorage
   *              Usado para asociar hilos y respuestas con sus autores
   */
  private getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de usuario:', error);
      return 1;
    }
  }

  // ===================================
  // MÉTODOS DE API REST
  // ===================================
  /**
   * Obtiene todos los hilos del foro desde la API
   * @returns {Observable<Hilo[]>} Observable con array de todos los hilos
   * @description Realiza petición GET a /api/v1/foro/ para obtener todos los hilos del foro
   *              Incluye manejo de errores y logging
   */
  getHilosAPI(): Observable<Hilo[]> {
    const token = this.auth.getAccessToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<Hilo[]>(this.apiUrl, { headers }).pipe(
      tap((hilos) => console.log('Hilos obtenidos desde API:', hilos)),
      catchError(this.handleError<Hilo[]>('getHilosAPI', [])),
    );
  }

  /**
   * Obtiene un hilo específico por su ID desde la API
   * @param {number} id - ID del hilo a obtener
   * @returns {Observable<Hilo | null>} Observable con el hilo encontrado o null
   * @description Realiza petición GET a /api/v1/foro/{id}/ para obtener un hilo específico
   *              Útil para mostrar el detalle completo del hilo con sus respuestas
   */
  obtenerPorIdAPI(id: number): Observable<Hilo | null> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Hilo>(url).pipe(
      tap((hilo) => console.log('Hilo obtenido por ID desde API:', hilo)),
      catchError(this.handleError<Hilo | null>('obtenerPorIdAPI', null)),
    );
  }

  /**
   * Crea un nuevo hilo en el foro a través de la API
   * @param {Hilo} hilo - Datos del hilo a crear (título y contenido)
   * @returns {Observable<Hilo | null>} Observable con el hilo creado o null si falla
   * @description Realiza petición POST a /api/v1/foro/ con los datos del nuevo hilo
   *              Automáticamente asigna fecha de publicación e ID del usuario actual
   */
  agregarAPI(hilo: Hilo): Observable<Hilo | null> {
    const token = this.auth.getAccessToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post<Hilo>(this.apiUrl, hilo, { headers }).pipe(
      tap((nuevoHilo) => console.log('Hilo agregado via API:', nuevoHilo)),
      catchError(this.handleError<Hilo | null>('agregarAPI', null)),
    );
  }

  /**
   * Actualiza un hilo existente en el foro a través de la API
   * @param {number} id - ID del hilo a actualizar
   * @param {Hilo} hilo - Nuevos datos del hilo (título y contenido)
   * @returns {Observable<Hilo | null>} Observable con el hilo actualizado o null si falla
   * @description Realiza petición PUT a /api/v1/foro/{id}/ con los datos actualizados del hilo
   *              Solo debería permitirse al autor del hilo o administradores
   */
  actualizarAPI(id: number, hilo: Hilo): Observable<Hilo | null> {
    const url = `${this.apiUrl}${id}/`;
    const token = this.auth.getAccessToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.put<Hilo>(url, hilo, { headers }).pipe(
      tap((hiloActualizado) => console.log('Hilo actualizado via API:', hiloActualizado)),
      catchError(this.handleError<Hilo | null>('actualizarAPI', null)),
    );
  }

  /**
   * Elimina un hilo del foro a través de la API
   * @param {number} id - ID del hilo a eliminar
   * @returns {Observable<boolean>} Observable que indica si la eliminación fue exitosa
   * @description Realiza petición DELETE a /api/v1/foro/{id}/ para eliminar el hilo
   *              Solo debería permitirse al autor del hilo o administradores
   */
  eliminarAPI(id: number): Observable<boolean> {
    const url = `${this.apiUrl}${id}/`;
    const token = this.auth.getAccessToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(url, { headers }).pipe(
      tap(() => console.log('Hilo eliminado via API:', id)),
      map(() => true),
      catchError(() => of(false)),
    );
  }

  // ===================================
  // MÉTODOS LOCALES (FALLBACK)
  // ===================================
  /**
   * Obtiene todos los hilos locales
   * @returns {any[]} Array con todos los hilos almacenados localmente
   * @description Método de fallback que retorna los datos locales cuando la API no está disponible
   */
  getHilos(): any[] {
    return this.hilos;
  }

  /**
   * Agrega un nuevo hilo a los datos locales
   * @param {any} hilo - Hilo a agregar (título y contenido)
   * @description Genera un ID único basado en timestamp e inicializa array de respuestas vacío
   */
  agregarHilo(hilo: any): void {
    this.hilos.push({
      ...hilo,
      id: Date.now(), // ID único basado en timestamp
      respuestas: [], // Inicializa array de respuestas vacío
    });
  }

  /**
   * Agrega una respuesta a un hilo específico (datos locales)
   * @param {number} hiloId - ID del hilo al que se responde
   * @param {any} respuesta - Contenido de la respuesta
   * @description Busca el hilo por ID y agrega la respuesta a su array de respuestas
   */
  responder(hiloId: number, respuesta: any): void {
    const hilo = this.hilos.find((h) => h.id === hiloId);
    if (hilo) {
      hilo.respuestas.push({ ...respuesta });
    }
  }

  /**
   * Elimina un hilo de los datos locales
   * @param {number} id - ID del hilo a eliminar
   * @description Filtra el array removiendo el hilo con el ID especificado
   */
  eliminarHilo(id: number): void {
    this.hilos = this.hilos.filter((h) => h.id !== id);
  }

  // Métodos API REST para compatibilidad con componentes
  agregarHiloAPI(hilo: Hilo): Observable<Hilo | null> {
    return this.agregarAPI(hilo);
  }

  eliminarHiloAPI(id: number): Observable<boolean> {
    return this.eliminarAPI(id);
  }
}
