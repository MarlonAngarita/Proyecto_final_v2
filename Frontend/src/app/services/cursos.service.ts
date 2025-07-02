// ===================================================================================================
// SERVICIO DE CURSOS - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio de Cursos para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Gestión completa de cursos (CRUD)
 * - Integración con API REST del backend
 * - Autenticación automática con JWT
 * - Manejo de errores robusto
 * - Datos de prueba para desarrollo
 * - Filtrado y búsqueda de cursos
 *
 * Este servicio actúa como intermediario entre los componentes
 * y la API del backend, proporcionando métodos para todas las
 * operaciones relacionadas con cursos y contenido educativo.
 *
 * @author Sistema Kütsa
 * @version 2.0 - Servicio completo con API y datos locales
 */
@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private http = inject(HttpClient);

  // ===================================================================================================
  // CONFIGURACIÓN DEL SERVICIO
  // ===================================================================================================

  /** URL base de la API para operaciones de cursos */
  private apiUrl = environment.apiUrl + 'cursos/';

  // ===================================================================================================
  // DATOS DE PRUEBA PARA DESARROLLO
  // ===================================================================================================

  /** Datos locales para desarrollo y testing */
  private cursos = [
    {
      id: 1,
      nombre: 'Lógica retro básica',
      descripcion: 'Curso introductorio con enfoque clásico 8-bit',
      categoria: 'Programación',
      activo: true,
      modulos: ['Módulo 1: Patrones clásicos', 'Módulo 2: Secuencias numéricas'],
      desafios: [1, 2], // IDs de desafíos asociados
    },
    {
      id: 2,
      nombre: 'Estética y diseño pixelado',
      descripcion: 'Diseño web con estilo arcade y tipografías tipo consola',
      categoria: 'Diseño',
      activo: false,
      modulos: ['Módulo 1: Tipografías retro'],
      desafios: [3], // IDs de desafíos asociados
    },
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del servicio de cursos
   *
   * @param http - Cliente HTTP de Angular para peticiones a la API
   */
  constructor() {}

  // ===================================================================================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ===================================================================================================

  /**
   * Obtiene el ID del usuario actual desde localStorage
   *
   * @returns ID del usuario actual o 1 como valor por defecto
   */
  private getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 1;
  }

  // ===================================================================================================
  // MÉTODOS DE API REST
  // ===================================================================================================

  /**
   * Obtiene todos los cursos desde la API
   *
   * @returns Observable con la lista de cursos
   */
  getTodosAPI(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo curso en la API
   *
   * @param curso - Datos del curso a crear
   * @returns Observable con el curso creado
   */
  agregarAPI(curso: any): Observable<any> {
    // Mapear los datos del frontend al formato esperado por el backend
    const cursoData = {
      nombre_curso: curso.nombre,
      descripcion_curso: curso.descripcion,
      fecha_inicio: curso.fecha_inicio || new Date().toISOString().split('T')[0],
      fecha_fin: curso.fecha_fin || new Date().toISOString().split('T')[0],
      fecha_creacion: new Date().toISOString().split('T')[0],
      id_profesor: this.getCurrentUserId(),
    };

    return this.http.post<any>(this.apiUrl, cursoData);
  }

  /**
   * Actualiza un curso existente en la API
   *
   * @param curso - Datos actualizados del curso
   * @returns Observable con el curso actualizado
   */
  actualizarAPI(curso: any): Observable<any> {
    const cursoData = {
      nombre_curso: curso.nombre,
      descripcion_curso: curso.descripcion,
      fecha_inicio: curso.fecha_inicio,
      fecha_fin: curso.fecha_fin,
      id_profesor: this.getCurrentUserId(),
    };

    // Usar id_curso que es la clave primaria en el backend
    const cursoId = curso.id_curso || curso.id;
    return this.http.put<any>(`${this.apiUrl}${cursoId}/`, cursoData);
  }

  /**
   * Elimina un curso de la API
   *
   * @param id - ID del curso a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  eliminarAPI(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  /**
   * Obtiene un curso específico por ID desde la API
   *
   * @param id - ID del curso a obtener
   * @returns Observable con los datos del curso
   */
  obtenerPorIdAPI(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  // ===================================================================================================
  // MÉTODOS LOCALES PARA DESARROLLO Y FALLBACK
  // ===================================================================================================

  /**
   * Obtiene todos los cursos locales
   * Método de fallback para cuando la API no está disponible
   *
   * @returns Array con todos los cursos locales
   */
  getTodos(): any[] {
    return this.cursos;
  }

  /**
   * Obtiene solo los cursos activos
   *
   * @returns Array con cursos marcados como activos
   */
  getActivos(): any[] {
    return this.cursos.filter((c) => c.activo);
  }

  /**
   * Agrega un nuevo curso al array local
   *
   * @param curso - Datos del curso a agregar
   */
  agregar(curso: any): void {
    const nuevo = { ...curso, id: Date.now(), modulos: [], desafios: [] };
    this.cursos.push(nuevo);
  }

  /**
   * Actualiza un curso en el array local
   *
   * @param curso - Datos actualizados del curso
   */
  actualizar(curso: any): void {
    const index = this.cursos.findIndex((c) => c.id === curso.id);
    if (index !== -1) {
      this.cursos[index] = { ...curso };
    }
  }

  /**
   * Elimina un curso del array local
   *
   * @param id - ID del curso a eliminar
   */
  eliminar(id: number): void {
    this.cursos = this.cursos.filter((c) => c.id !== id);
  }

  /**
   * Asigna desafíos a un curso específico
   *
   * @param cursoId - ID del curso
   * @param desafiosIds - Array de IDs de desafíos a asignar
   */
  asignarDesafios(cursoId: number, desafiosIds: number[]): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.desafios = [...desafiosIds];
    }
  }

  /**
   * Asigna módulos a un curso específico
   *
   * @param cursoId - ID del curso
   * @param modulos - Array de nombres de módulos a asignar
   */
  asignarModulos(cursoId: number, modulos: string[]): void {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (curso) {
      curso.modulos = [...modulos];
    }
  }
}
