import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  contenido_modulo: string;
  id_curso: number;
}

@Injectable({ providedIn: 'root' })
export class ModulosService {
  private apiUrl = 'http://localhost:8000/api/modulos/'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getModulosPorCurso(id_curso: number): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}?id_curso=${id_curso}`);
  }
}
