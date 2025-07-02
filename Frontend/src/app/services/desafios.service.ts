import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

/**
 * Interfaz que define la estructura de un Desafío en el sistema de gamificación
 *
 * @interface Desafio
 * @description Representa un desafío o reto que los usuarios pueden completar
 *              para obtener recompensas y puntos en el sistema
 *
 * @property {number} id - Identificador único del desafío (opcional para nuevos desafíos)
 * @property {string} nombre_desafio - Nombre o título del desafío
 * @property {string} descripcion - Descripción detallada del desafío y sus objetivos
 * @property {number} recompensa - Puntos o recompensa que se obtiene al completar el desafío
 * @property {'facil' | 'intermedio' | 'dificil'} dificultad - Nivel de dificultad del desafío
 * @property {boolean} activo - Indica si el desafío está activo y disponible (opcional)
 */
export interface Desafio {
  id?: number;
  nombre_desafio: string;
  descripcion: string;
  recompensa: number;
  dificultad: 'facil' | 'intermedio' | 'dificil';
  activo?: boolean;
}

/**
 * Servicio de gestión de Desafíos del sistema de gamificación
 *
 * @class DesafiosService
 * @description Maneja todas las operaciones CRUD relacionadas con desafíos y retos.
 *              Parte fundamental del sistema de gamificación que permite a los usuarios
 *              participar en retos para obtener recompensas y puntos.
 *
 * Funcionalidades principales:
 * - Gestión completa de desafíos (CRUD)
 * - Integración con API REST del backend Django
 * - Sistema de fallback con datos locales
 * - Autenticación JWT automática
 * - Filtrado por estado activo/inactivo
 * - Sistema de recompensas y niveles de dificultad
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class DesafiosService {
  private http = inject(HttpClient);

  /** URL base de la API REST para desafíos */
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1/desafios/'
    : 'http://4.203.104.63:8000/api/v1/desafios/';

  /** Opciones HTTP con headers por defecto incluyendo autenticación JWT */
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    }),
  };

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
   * Actualiza las opciones HTTP con el token de autenticación actual
   * @private
   * @description Obtiene el token más reciente del localStorage y actualiza los headers
   *              Debe llamarse antes de cada petición HTTP para asegurar autenticación válida
   */
  private updateHttpOptions(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      }),
    };
  }

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

  // ===================================
  // MÉTODOS DE API REST
  // ===================================

  /**
   * Obtiene todos los desafíos desde la API
   * @returns {Observable<Desafio[]>} Observable con array de todos los desafíos
   * @description Realiza petición GET a /api/v1/desafios/ para obtener todos los desafíos disponibles
   *              Incluye manejo de errores y logging
   */
  getTodosAPI(): Observable<Desafio[]> {
    this.updateHttpOptions();
    return this.http.get<Desafio[]>(this.apiUrl, this.httpOptions).pipe(
      tap((desafios) => console.log('Desafíos obtenidos desde API:', desafios)),
      catchError(this.handleError<Desafio[]>('getTodosAPI', [])),
    );
  }

  /**
   * Obtiene un desafío específico por su ID desde la API
   * @param {number} id - ID del desafío a obtener
   * @returns {Observable<Desafio | null>} Observable con el desafío encontrado o null
   * @description Realiza petición GET a /api/v1/desafios/{id}/ para obtener un desafío específico
   */
  obtenerPorIdAPI(id: number): Observable<Desafio | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Desafio>(url, this.httpOptions).pipe(
      tap((desafio) => console.log('Desafío obtenido por ID desde API:', desafio)),
      catchError(this.handleError<Desafio | null>('obtenerPorIdAPI', null)),
    );
  }

  /**
   * Crea un nuevo desafío en la API
   * @param {Desafio} desafio - Datos del desafío a crear (sin ID)
   * @returns {Observable<Desafio | null>} Observable con el desafío creado o null si falla
   * @description Realiza petición POST a /api/v1/desafios/ con los datos del nuevo desafío
   */
  agregarAPI(desafio: Desafio): Observable<Desafio | null> {
    this.updateHttpOptions();
    return this.http.post<Desafio>(this.apiUrl, desafio, this.httpOptions).pipe(
      tap((nuevoDesafio) => console.log('Desafío agregado via API:', nuevoDesafio)),
      catchError(this.handleError<Desafio | null>('agregarAPI', null)),
    );
  }

  /**
   * Actualiza un desafío existente en la API
   * @param {number} id - ID del desafío a actualizar
   * @param {Desafio} desafio - Nuevos datos del desafío
   * @returns {Observable<Desafio | null>} Observable con el desafío actualizado o null si falla
   * @description Realiza petición PUT a /api/v1/desafios/{id}/ para actualizar datos del desafío
   */
  actualizarAPI(id: number, desafio: Desafio): Observable<Desafio | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<Desafio>(url, desafio, this.httpOptions).pipe(
      tap((desafioActualizado) => console.log('Desafío actualizado via API:', desafioActualizado)),
      catchError(this.handleError<Desafio | null>('actualizarAPI', null)),
    );
  }

  /**
   * Elimina un desafío de la API
   * @param {number} id - ID del desafío a eliminar
   * @returns {Observable<boolean>} Observable que indica si la eliminación fue exitosa
   * @description Realiza petición DELETE a /api/v1/desafios/{id}/ para eliminar el desafío
   */
  eliminarAPI(id: number): Observable<boolean> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => console.log('Desafío eliminado via API:', id)),
      map(() => true), // Mapea respuesta exitosa a true
      catchError(() => of(false)), // En caso de error retorna false
    );
  }

  // ===================================
  // MÉTODOS LOCALES (FALLBACK)
  // ===================================

  /**
   * Datos locales de desafíos para fallback y desarrollo
   * @description Array de desafíos predefinidos que se utilizan cuando la API no está disponible
   *              Incluye diferentes niveles de dificultad y estados
   */
  private desafios = [
    {
      id: 1,
      titulo: 'Operaciones retro',
      descripcion: 'Corrige un flujo lógico clásico',
      nivel: 'intermedio',
      activo: true,
    },
    {
      id: 2,
      titulo: 'Secuencia misteriosa',
      descripcion: 'Adivina la regla de la serie',
      nivel: 'básico',
      activo: true,
    },
    {
      id: 3,
      titulo: 'Desafío bloqueado',
      descripcion: 'Visible solo si completas anteriores',
      nivel: 'avanzado',
      activo: false,
    },
  ];

  /**
   * Obtiene todos los desafíos locales
   * @returns {any[]} Array con todos los desafíos almacenados localmente
   * @description Método de fallback que retorna los datos locales cuando la API no está disponible
   */
  getTodos(): any[] {
    return this.desafios;
  }

  /**
   * Obtiene solo los desafíos activos (datos locales)
   * @returns {any[]} Array con desafíos que tienen activo = true
   * @description Filtra los desafíos locales para mostrar solo los disponibles para los usuarios
   */
  getActivos(): any[] {
    return this.desafios.filter((d) => d.activo);
  }

  /**
   * Agrega un nuevo desafío a los datos locales
   * @param {any} desafio - Desafío a agregar (sin ID)
   * @description Genera un ID único basado en timestamp y agrega el desafío al array local
   */
  agregar(desafio: any): void {
    this.desafios.push({ ...desafio, id: Date.now() }); // ID único basado en timestamp
  }

  /**
   * Actualiza un desafío existente en los datos locales
   * @param {any} editado - Desafío con datos actualizados (debe incluir ID)
   * @description Busca el desafío por ID y reemplaza sus datos completamente
   */
  actualizar(editado: any): void {
    const index = this.desafios.findIndex((d) => d.id === editado.id);
    if (index !== -1) {
      this.desafios[index] = { ...editado };
    }
  }

  /**
   * Elimina un desafío de los datos locales
   * @param {number} id - ID del desafío a eliminar
   * @description Filtra el array removiendo el desafío con el ID especificado
   */
  eliminar(id: number): void {
    this.desafios = this.desafios.filter((d) => d.id !== id);
  }
}
