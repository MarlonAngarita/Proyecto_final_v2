import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Hilo {
  id?: number;
  titulo: string;
  contenido: string;
  fecha_publicacion?: string;
  id_usuario?: number;
  autor?: string;
  respuestas?: Respuesta[];
}

export interface Respuesta {
  id?: number;
  contenido: string;
  fecha_respuesta?: string;
  id_usuario?: number;
  id_hilo?: number;
  autor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForoService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/foro/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
    })
  };
  
  private hilos = [
    {
      id: 1,
      titulo: '¿Cómo resolvieron la misión lógica?',
      autor: 'usuario1',
      contenido: 'Necesito ayuda con el último desafío',
      fecha_publicacion: '2024-01-15',
      respuestas: [
        { autor: 'usuario2', contenido: 'Usé un patrón XOR básico.' },
        { autor: 'usuario3', contenido: '¡Yo también! Fue un reto genial.' }
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

  private getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de usuario:', error);
      return 1;
    }
  }

  // Métodos API
  getHilosAPI(): Observable<Hilo[]> {
    this.updateHttpOptions();
    return this.http.get<Hilo[]>(this.apiUrl, this.httpOptions)
      .pipe(
        tap(hilos => console.log('Hilos obtenidos desde API:', hilos)),
        catchError(this.handleError<Hilo[]>('getHilosAPI', []))
      );
  }

  obtenerHiloPorIdAPI(id: number): Observable<Hilo | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Hilo>(url, this.httpOptions)
      .pipe(
        tap(hilo => console.log('Hilo obtenido por ID desde API:', hilo)),
        catchError(this.handleError<Hilo | null>('obtenerHiloPorIdAPI', null))
      );
  }

  agregarHiloAPI(hilo: Hilo): Observable<Hilo | null> {
    this.updateHttpOptions();
    const hiloData = {
      titulo: hilo.titulo,
      contenido: hilo.contenido,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      id_usuario: this.getCurrentUserId()
    };
    
    return this.http.post<Hilo>(this.apiUrl, hiloData, this.httpOptions)
      .pipe(
        tap(nuevoHilo => console.log('Hilo agregado via API:', nuevoHilo)),
        catchError(this.handleError<Hilo | null>('agregarHiloAPI', null))
      );
  }

  eliminarHiloAPI(id: number): Observable<boolean> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        tap(() => console.log('Hilo eliminado via API:', id)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  // Métodos locales para compatibilidad (mantener como fallback)
  getHilos(): any[] {
    return this.hilos;
  }

  agregarHilo(hilo: any): void {
    this.hilos.push({ ...hilo, id: Date.now(), respuestas: [] });
  }

  responder(hiloId: number, respuesta: any): void {
    const hilo = this.hilos.find(h => h.id === hiloId);
    if (hilo) {
      hilo.respuestas.push({ ...respuesta });
    }
  }

  eliminarHilo(id: number): void {
    this.hilos = this.hilos.filter(h => h.id !== id);
  }
}
