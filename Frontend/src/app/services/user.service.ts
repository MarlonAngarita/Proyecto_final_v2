import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + 'usuarios/';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  getEstadisticas(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'rachas-usuario/estadisticas/');
  }

  // Métodos utilitarios para compatibilidad con componentes
  getUsuarioActual(): any {
    // Devuelve el usuario actual desde localStorage
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  actualizarUsuario(usuario: any): Observable<any> {
    // Actualiza el usuario en la API
    return this.http.put<any>(`${this.apiUrl}${usuario.id}/`, usuario);
  }

  actualizarConexion(): void {
    // Simulación: podrías implementar lógica de ping o actualización de timestamp
    // Aquí solo imprime en consola
    console.log('Conexión actualizada (simulado)');
  }

  rompioRacha(): boolean {
    // Simulación: podrías obtener este dato de la API o lógica local
    return false;
  }

  rachaAnterior(): number {
    // Simulación: podrías obtener este dato de la API o lógica local
    return 0;
  }
}
