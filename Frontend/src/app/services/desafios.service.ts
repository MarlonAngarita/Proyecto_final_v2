import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Desafio {
  id?: number;
  nombre_desafio: string;
  descripcion: string;
  recompensa: number;
  dificultad: 'facil' | 'intermedio' | 'dificil';
  activo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DesafiosService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/desafios/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
    })
  };
  constructor(private http: HttpClient) {}

  // Métodos para la API REST
  private updateHttpOptions(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  getTodosAPI(): Observable<Desafio[]> {
    this.updateHttpOptions();
    return this.http.get<Desafio[]>(this.apiUrl, this.httpOptions)
      .pipe(
        tap(desafios => console.log('Desafíos obtenidos desde API:', desafios)),
        catchError(this.handleError<Desafio[]>('getTodosAPI', []))
      );
  }

  obtenerPorIdAPI(id: number): Observable<Desafio | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Desafio>(url, this.httpOptions)
      .pipe(
        tap(desafio => console.log('Desafío obtenido por ID desde API:', desafio)),
        catchError(this.handleError<Desafio | null>('obtenerPorIdAPI', null))
      );
  }

  agregarAPI(desafio: Desafio): Observable<Desafio | null> {
    this.updateHttpOptions();
    return this.http.post<Desafio>(this.apiUrl, desafio, this.httpOptions)
      .pipe(
        tap(nuevoDesafio => console.log('Desafío agregado via API:', nuevoDesafio)),
        catchError(this.handleError<Desafio | null>('agregarAPI', null))
      );
  }

  actualizarAPI(id: number, desafio: Desafio): Observable<Desafio | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<Desafio>(url, desafio, this.httpOptions)
      .pipe(
        tap(desafioActualizado => console.log('Desafío actualizado via API:', desafioActualizado)),
        catchError(this.handleError<Desafio | null>('actualizarAPI', null))
      );
  }

  eliminarAPI(id: number): Observable<boolean> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        tap(() => console.log('Desafío eliminado via API:', id)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  // Métodos locales para compatibilidad (mantener como fallback)
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

  getTodos(): any[] {
    return this.desafios;
  }

  getActivos(): any[] {
    return this.desafios.filter(d => d.activo);
  }

  agregar(desafio: any): void {
    this.desafios.push({ ...desafio, id: Date.now() });
  }

  actualizar(editado: any): void {
    const index = this.desafios.findIndex(d => d.id === editado.id);
    if (index !== -1) {
      this.desafios[index] = { ...editado };
    }
  }

  eliminar(id: number): void {
    this.desafios = this.desafios.filter(d => d.id !== id);
  }
}
