import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForoService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/foro/';
  
  private hilos = [
    {
      id: 1,
      titulo: '¿Cómo resolvieron la misión lógica?',
      autor: 'usuario1',
      respuestas: [
        { autor: 'usuario2', mensaje: 'Usé un patrón XOR básico.' },
        { autor: 'usuario3', mensaje: '¡Yo también! Fue un reto genial.' }
      ],
    },
    {
      id: 2,
      titulo: 'Dudas sobre estilo retro en CSS',
      autor: 'usuario2',
      respuestas: [],
    },
  ];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 1;
  }

  // Métodos API
  getHilosAPI(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  agregarHiloAPI(hilo: any): Observable<any> {
    const hiloData = {
      titulo: hilo.titulo,
      contenido: hilo.contenido,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      id_usuario: this.getCurrentUserId()
    };
    
    return this.http.post<any>(this.apiUrl, hiloData, { headers: this.getAuthHeaders() });
  }

  eliminarHiloAPI(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  obtenerHiloPorIdAPI(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  // Métodos locales existentes (mantienen la funcionalidad actual)
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
