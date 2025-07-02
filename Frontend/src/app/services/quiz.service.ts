import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

/**
 * Interfaz que define la estructura de un Quiz/Pregunta en el sistema
 *
 * @interface Quiz
 * @description Representa una pregunta de opción múltiple con 4 alternativas (A, B, C, D)
 *              utilizada en la evaluación de módulos de cursos
 *
 * @property {number} id - Identificador único del quiz (opcional para nuevas preguntas)
 * @property {string} pregunta - Texto de la pregunta a responder
 * @property {string} opcion_a - Primera opción de respuesta (A)
 * @property {string} opcion_b - Segunda opción de respuesta (B)
 * @property {string} opcion_c - Tercera opción de respuesta (C)
 * @property {string} opcion_d - Cuarta opción de respuesta (D)
 * @property {'A' | 'B' | 'C' | 'D'} respuesta_correcta - Letra de la respuesta correcta
 * @property {number} id_modulo - ID del módulo al que pertenece este quiz
 * @property {string} fecha_creacion - Fecha de creación del quiz (opcional)
 * @property {number} id_profesor - ID del profesor que creó el quiz (opcional)
 */
export interface Quiz {
  id?: number;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  respuesta_correcta: 'A' | 'B' | 'C' | 'D';
  id_modulo: number;
  fecha_creacion?: string;
  id_profesor?: number;
}

/**
 * Servicio de gestión de Quizzes/Preguntas
 *
 * @class QuizService
 * @description Maneja todas las operaciones CRUD relacionadas con quizzes/preguntas de opción múltiple.
 *              Proporciona métodos tanto para API REST como para datos locales (fallback).
 *
 * Funcionalidades principales:
 * - Gestión completa de preguntas de opción múltiple
 * - Integración con API REST del backend Django
 * - Sistema de fallback con datos locales
 * - Autenticación JWT automática
 * - Filtrado por módulo
 * - Gestión de profesores y fecha de creación
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private http = inject(HttpClient);

  /** URL base de la API REST para quizzes */
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1/quiz/'
    : 'http://4.203.104.63:8000/api/v1/quiz/';

  /** Opciones HTTP con headers por defecto incluyendo autenticación JWT */
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    }),
  };

  /**
   * Datos locales de quizzes para fallback
   * @description Array de preguntas predefinidas que se utilizan cuando la API no está disponible
   *              o como datos de ejemplo para desarrollo
   */
  private quizzes: Quiz[] = [
    {
      id: 1,
      pregunta: '¿Qué significa HTML?',
      opcion_a: 'Hyper Text Markup Language',
      opcion_b: 'High Tech Modern Language',
      opcion_c: 'Home Tool Markup Language',
      opcion_d: 'Hyperlink and Text Markup Language',
      respuesta_correcta: 'A',
      id_modulo: 1,
      fecha_creacion: '2024-01-15',
    },
    {
      id: 2,
      pregunta: '¿Cuál es la función principal de CSS?',
      opcion_a: 'Crear bases de datos',
      opcion_b: 'Estilizar páginas web',
      opcion_c: 'Programar lógica',
      opcion_d: 'Gestionar servidores',
      respuesta_correcta: 'B',
      id_modulo: 1,
      fecha_creacion: '2024-01-16',
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

  /**
   * Obtiene el ID del profesor actual desde el localStorage
   * @private
   * @returns {number} ID del profesor logueado o 1 por defecto
   * @description Extrae el ID del usuario actual almacenado en localStorage
   *              Usado para asignar autoría a las preguntas creadas
   */
  private getCurrentProfesorId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de profesor:', error);
      return 1;
    }
  }

  // ===================================
  // MÉTODOS DE API REST
  // ===================================
  /**
   * Obtiene todos los quizzes desde la API
   * @returns {Observable<Quiz[]>} Observable con array de todos los quizzes
   * @description Realiza petición GET a /api/v1/quiz/ para obtener todos los quizzes disponibles
   *              Incluye manejo de errores y logging
   */
  getTodosAPI(): Observable<Quiz[]> {
    this.updateHttpOptions();
    return this.http.get<Quiz[]>(this.apiUrl, this.httpOptions).pipe(
      tap((quizzes) => console.log('Quizzes obtenidos desde API:', quizzes)),
      catchError(this.handleError<Quiz[]>('getTodosAPI', [])),
    );
  }

  /**
   * Obtiene un quiz específico por su ID desde la API
   * @param {number} id - ID del quiz a obtener
   * @returns {Observable<Quiz | null>} Observable con el quiz encontrado o null
   * @description Realiza petición GET a /api/v1/quiz/{id}/ para obtener un quiz específico
   */
  obtenerPorIdAPI(id: number): Observable<Quiz | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Quiz>(url, this.httpOptions).pipe(
      tap((quiz) => console.log('Quiz obtenido por ID desde API:', quiz)),
      catchError(this.handleError<Quiz | null>('obtenerPorIdAPI', null)),
    );
  }

  /**
   * Obtiene todos los quizzes de un módulo específico desde la API
   * @param {number} idModulo - ID del módulo cuyos quizzes se quieren obtener
   * @returns {Observable<Quiz[]>} Observable con array de quizzes del módulo
   * @description Realiza petición GET con query parameter id_modulo para filtrar quizzes
   */
  obtenerPorModuloAPI(idModulo: number): Observable<Quiz[]> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}?id_modulo=${idModulo}`;
    return this.http.get<Quiz[]>(url, this.httpOptions).pipe(
      tap((quizzes) => console.log('Quizzes obtenidos por módulo desde API:', quizzes)),
      catchError(this.handleError<Quiz[]>('obtenerPorModuloAPI', [])),
    );
  }

  /**
   * Crea un nuevo quiz en la API
   * @param {Quiz} quiz - Datos del quiz a crear (sin ID)
   * @returns {Observable<Quiz | null>} Observable con el quiz creado o null si falla
   * @description Realiza petición POST a /api/v1/quiz/ con los datos del nuevo quiz
   *              Automáticamente asigna fecha de creación e ID del profesor actual
   */
  agregarAPI(quiz: Quiz): Observable<Quiz | null> {
    this.updateHttpOptions();
    const quizData = {
      ...quiz,
      fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      id_profesor: this.getCurrentProfesorId(), // ID del profesor logueado
    };

    return this.http.post<Quiz>(this.apiUrl, quizData, this.httpOptions).pipe(
      tap((nuevoQuiz) => console.log('Quiz agregado via API:', nuevoQuiz)),
      catchError(this.handleError<Quiz | null>('agregarAPI', null)),
    );
  }

  /**
   * Actualiza un quiz existente en la API
   * @param {number} id - ID del quiz a actualizar
   * @param {Quiz} quiz - Nuevos datos del quiz
   * @returns {Observable<Quiz | null>} Observable con el quiz actualizado o null si falla
   * @description Realiza petición PUT a /api/v1/quiz/{id}/ para actualizar datos del quiz
   */
  actualizarAPI(id: number, quiz: Quiz): Observable<Quiz | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<Quiz>(url, quiz, this.httpOptions).pipe(
      tap((quizActualizado) => console.log('Quiz actualizado via API:', quizActualizado)),
      catchError(this.handleError<Quiz | null>('actualizarAPI', null)),
    );
  }

  /**
   * Elimina un quiz de la API
   * @param {number} id - ID del quiz a eliminar
   * @returns {Observable<boolean>} Observable que indica si la eliminación fue exitosa
   * @description Realiza petición DELETE a /api/v1/quiz/{id}/ para eliminar el quiz
   */
  eliminarAPI(id: number): Observable<boolean> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => console.log('Quiz eliminado via API:', id)),
      map(() => true), // Mapea respuesta exitosa a true
      catchError(() => of(false)), // En caso de error retorna false
    );
  }

  // ===================================
  // MÉTODOS LOCALES (FALLBACK)
  // ===================================
  /**
   * Obtiene todos los quizzes locales
   * @returns {Quiz[]} Array con todos los quizzes almacenados localmente
   * @description Método de fallback que retorna los datos locales cuando la API no está disponible
   */
  getTodos(): Quiz[] {
    return this.quizzes;
  }

  /**
   * Obtiene quizzes filtrados por módulo (datos locales)
   * @param {number} idModulo - ID del módulo a filtrar
   * @returns {Quiz[]} Array con quizzes del módulo especificado
   * @description Filtra los quizzes locales por id_modulo
   */
  obtenerPorModulo(idModulo: number): Quiz[] {
    return this.quizzes.filter((q) => q.id_modulo === idModulo);
  }

  /**
   * Agrega un nuevo quiz a los datos locales
   * @param {Quiz} quiz - Quiz a agregar (sin ID)
   * @description Genera un ID único basado en timestamp y asigna fecha de creación actual
   */
  agregar(quiz: Quiz): void {
    const nuevoQuiz = {
      ...quiz,
      id: Date.now(), // ID único basado en timestamp
      fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual
    };
    this.quizzes.push(nuevoQuiz);
  }

  /**
   * Actualiza un quiz existente en los datos locales
   * @param {Quiz} quiz - Quiz con datos actualizados (debe incluir ID)
   * @description Busca el quiz por ID y reemplaza sus datos completamente
   */
  actualizar(quiz: Quiz): void {
    const index = this.quizzes.findIndex((q) => q.id === quiz.id);
    if (index !== -1) {
      this.quizzes[index] = { ...quiz };
    }
  }

  /**
   * Elimina un quiz de los datos locales
   * @param {number} id - ID del quiz a eliminar
   * @description Filtra el array removiendo el quiz con el ID especificado
   */
  eliminar(id: number): void {
    this.quizzes = this.quizzes.filter((q) => q.id !== id);
  }

  /**
   * Obtiene un quiz específico por ID (datos locales)
   * @param {number} id - ID del quiz a buscar
   * @returns {Quiz | undefined} Quiz encontrado o undefined si no existe
   * @description Busca un quiz específico en los datos locales por su ID
   */
  obtenerPorId(id: number): Quiz | undefined {
    return this.quizzes.find((q) => q.id === id);
  }
}
