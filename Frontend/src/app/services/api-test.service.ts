import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio de pruebas de conectividad con la API
 *
 * @class ApiTestService
 * @description Servicio utilitario para probar la conectividad y funcionalidad
 *              básica de la API del backend. Útil para debugging y verificación
 *              de que el servidor está respondiendo correctamente.
 *
 * Funcionalidades principales:
 * - Prueba de conexión básica con el backend
 * - Verificación del endpoint de usuarios
 * - Prueba directa del sistema de autenticación
 * - Útil para diagnóstico de problemas de conectividad
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Injectable({
  providedIn: 'root',
})
export class ApiTestService {
  private http = inject(HttpClient);

  /** URL base de la API para las pruebas de conectividad */
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:8000/api/v1'
      : 'http://4.203.104.63:8000/api/v1';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del servicio
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones de prueba
   */
  constructor() {}

  /**
   * Prueba la conexión básica con el backend
   * @returns {Observable<any>} Observable con la respuesta del endpoint de usuarios
   * @description Realiza una petición GET al endpoint /usuarios/ para verificar
   *              que el backend está activo y respondiendo correctamente.
   *              No requiere autenticación para esta prueba básica.
   */
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/`);
  }

  /**
   * Prueba directa del sistema de autenticación
   * @param {string} email - Email del usuario para la prueba de login
   * @param {string} password - Contraseña del usuario para la prueba de login
   * @returns {Observable<any>} Observable con la respuesta del endpoint de login
   * @description Realiza una petición POST directa al endpoint /login/ para verificar
   *              que el sistema de autenticación está funcionando correctamente.
   *              Útil para debugging de problemas de login.
   */
  testLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { email, password });
  }
}
