import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/cursos/';
  private cursos = [
    {
      id: 1,
      nombre: 'Lógica retro básica',
      descripcion: 'Curso introductorio con enfoque clásico 8-bit',
      categoria: 'Programación',
      activo: true,
      modulos: ['Módulo 1: Patrones clásicos', 'Módulo 2: Secuencias numéricas'],
      desafios: [1, 2] // IDs de desafíos
    },
    {
      id: 2,
      nombre: 'Estética y diseño pixelado',
      descripcion: 'Diseño web con estilo arcade y tipografías tipo consola',
      categoria: 'Diseño',
      activo: false,
      modulos: ['Módulo 1: Tipografías retro'],
      desafios: [3]
    }
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
  getTodosAPI(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  agregarAPI(curso: any): Observable<any> {
    const cursoData = {
      nombre_curso: curso.nombre,
      descripcion_curso: curso.descripcion,
      fecha_inicio: curso.fecha_inicio || new Date().toISOString().split('T')[0],
      fecha_fin: curso.fecha_fin || new Date().toISOString().split('T')[0],
      fecha_creacion: new Date().toISOString().split('T')[0],
      id_profesor: this.getCurrentUserId()
    };
    
    return this.http.post<any>(this.apiUrl, cursoData, { headers: this.getAuthHeaders() });
  }

  actualizarAPI(curso: any): Observable<any> {
    const cursoData = {
      nombre_curso: curso.nombre,
      descripcion_curso: curso.descripcion,
      fecha_inicio: curso.fecha_inicio,
      fecha_fin: curso.fecha_fin,
      id_profesor: this.getCurrentUserId()
    };
    
    // Usar id_curso que es la clave primaria en el backend
    const cursoId = curso.id_curso || curso.id;
    return this.http.put<any>(`${this.apiUrl}${cursoId}/`, cursoData, { headers: this.getAuthHeaders() });
  }

  eliminarAPI(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  obtenerPorIdAPI(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  // Métodos locales existentes (mantienen la funcionalidad actual)
  getTodos(): any[] {
    return this.cursos;
  }

  getActivos(): any[] {
    return this.cursos.filter(c => c.activo);
  }

  agregar(curso: any): void {
    const nuevo = { ...curso, id: Date.now(), modulos: [], desafios: [] };
    this.cursos.push(nuevo);
  }

  actualizar(curso: any): void {
    const index = this.cursos.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      this.cursos[index] = { ...curso };
    }
  }

  eliminar(id: number): void {
    this.cursos = this.cursos.filter(c => c.id !== id);
  }

  asignarDesafios(cursoId: number, desafiosIds: number[]): void {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.desafios = [...desafiosIds];
    }
  }

  asignarModulos(cursoId: number, modulos: string[]): void {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.modulos = [...modulos];
    }
  }
}
