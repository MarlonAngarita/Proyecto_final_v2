// ===================================================================================================
// SERVICIO DE MÓDULOS - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Interfaz para definir la estructura de un módulo educativo
 */
export interface Modulo {
  /** ID único del módulo */
  id_modulo?: number;
  /** Nombre descriptivo del módulo */
  nombre_modulo: string;
  /** Contenido educativo del módulo */
  contenido_modulo: string;
  /** ID del curso al que pertenece */
  id_curso: number;
  /** Nombre del curso (para mostrar en UI) */
  nombre_curso?: string;
  /** Fecha de creación del módulo */
  fecha_creacion?: string;
  /** ID del profesor que creó el módulo */
  id_profesor?: number;
}

/**
 * Servicio de Módulos para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Gestión completa de módulos educativos (CRUD)
 * - Integración con API REST del backend
 * - Autenticación automática con JWT
 * - Manejo de errores robusto
 * - Organización de contenido por cursos
 * - Filtrado y ordenamiento de módulos
 *
 * Los módulos son las unidades básicas de contenido educativo
 * organizadas dentro de cursos. Este servicio permite a los
 * profesores crear, editar y gestionar el contenido de aprendizaje.
 *
 * @author Sistema Kütsa
 * @version 2.0 - Servicio completo con API REST
 */
@Injectable({ providedIn: 'root' })
export class ModulosService {
  private http = inject(HttpClient);

  // ===================================================================================================
  // CONFIGURACIÓN DEL SERVICIO
  // ===================================================================================================

  /** URL base de la API para operaciones de módulos */
  private apiUrl = 'http://127.0.0.1:8000/api/v1/modulos/';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del servicio de módulos
   *
   * @param http - Cliente HTTP de Angular para peticiones a la API
   */
  constructor() {}

  // ===================================================================================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ===================================================================================================

  /**
   * Genera headers HTTP con autenticación JWT
   * Obtiene el token del localStorage y lo incluye en las peticiones
   *
   * @returns HttpHeaders con token de autorización y content-type
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Obtiene el ID del usuario actual desde localStorage
   *
   * @returns ID del usuario actual o 1 como valor por defecto
   */
  private getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de usuario:', error);
      return 1; // Valor por defecto
    }
  }

  /**
   * Maneja errores de peticiones HTTP
   *
   * @param error - Error recibido de la petición HTTP
   * @returns Observable con el error formateado
   */
  private handleError = (error: any) => {
    console.error('Error en ModulosService:', error);
    return throwError(() => error);
  };

  // ===================================================================================================
  // MÉTODOS DE API REST
  // ===================================================================================================

  /**
   * Obtiene todos los módulos desde la API
   *
   * @returns Observable con la lista de módulos
   */
  getTodosAPI(): Observable<Modulo[]> {
    return this.http
      .get<Modulo[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  agregarAPI(modulo: Modulo): Observable<Modulo> {
    try {
      const moduloData = {
        nombre_modulo: modulo.nombre_modulo,
        contenido_modulo: modulo.contenido_modulo,
        id_curso: modulo.id_curso,
        fecha_creacion: new Date().toISOString().split('T')[0],
        id_profesor: this.getCurrentUserId(),
      };

      return this.http
        .post<Modulo>(this.apiUrl, moduloData, { headers: this.getAuthHeaders() })
        .pipe(catchError(this.handleError));
    } catch (error) {
      console.error('Error preparando datos del módulo:', error);
      return throwError(() => error);
    }
  }

  /**
   * Actualiza un módulo existente en la API
   *
   * @param modulo - Datos actualizados del módulo
   * @returns Observable con el módulo actualizado
   */
  actualizarAPI(modulo: Modulo): Observable<Modulo> {
    const moduloData = {
      nombre_modulo: modulo.nombre_modulo,
      contenido_modulo: modulo.contenido_modulo,
      id_curso: modulo.id_curso,
    };

    return this.http
      .put<Modulo>(`${this.apiUrl}${modulo.id_modulo}/`, moduloData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un módulo de la API
   *
   * @param id - ID del módulo a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarAPI(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  obtenerPorIdAPI(id: number): Observable<Modulo> {
    return this.http
      .get<Modulo>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getModulosPorCurso(id_curso: number): Observable<Modulo[]> {
    return this.http
      .get<Modulo[]>(`${this.apiUrl}?id_curso=${id_curso}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
}
