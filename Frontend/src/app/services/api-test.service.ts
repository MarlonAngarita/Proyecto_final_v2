import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  // Método para probar si el backend está funcionando
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/`);
  }

  // Método para probar el endpoint de login directamente
  testLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { email, password });
  }
}
