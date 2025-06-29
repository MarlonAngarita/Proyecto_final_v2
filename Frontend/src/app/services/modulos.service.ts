import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Modulo {
  id_modulo?: number;
  nombre_modulo: string;
  contenido_modulo: string;
  id_curso: number;
  nombre_curso?: string;
  fecha_creacion?: string;
  id_profesor?: number;
}

@Injectable({ providedIn: 'root' })
export class ModulosService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/modulos/';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de usuario:', error);
      return 1; // Valor por defecto
    }
  }

  private handleError = (error: any) => {
    console.error('Error en ModulosService:', error);
    return throwError(() => error);
  };

  getTodosAPI(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  agregarAPI(modulo: Modulo): Observable<Modulo> {
    try {
      const moduloData = {
        nombre_modulo: modulo.nombre_modulo,
        contenido_modulo: modulo.contenido_modulo,
        id_curso: modulo.id_curso,
        fecha_creacion: new Date().toISOString().split('T')[0],
        id_profesor: this.getCurrentUserId()
      };
      
      return this.http.post<Modulo>(this.apiUrl, moduloData, { headers: this.getAuthHeaders() })
        .pipe(
          catchError(this.handleError)
        );
    } catch (error) {
      console.error('Error preparando datos del módulo:', error);
      return throwError(() => error);
    }
  }

  actualizarAPI(modulo: Modulo): Observable<Modulo> {
    const moduloData = {
      nombre_modulo: modulo.nombre_modulo,
      contenido_modulo: modulo.contenido_modulo,
      id_curso: modulo.id_curso
    };
    
    return this.http.put<Modulo>(`${this.apiUrl}${modulo.id_modulo}/`, moduloData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminarAPI(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerPorIdAPI(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getModulosPorCurso(id_curso: number): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}?id_curso=${id_curso}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}
