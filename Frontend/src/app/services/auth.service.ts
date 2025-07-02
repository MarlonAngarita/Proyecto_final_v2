// ===================================================================================================
// SERVICIO DE AUTENTICACIÓN - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// ===================================================================================================
// INTERFACES DE TIPOS DE DATOS
// ===================================================================================================

/**
 * Interface para definir la estructura de un usuario en el sistema
 * Contiene información básica del usuario y roles
 */
export interface Usuario {
  /** ID único del usuario en la base de datos */
  id?: number;
  /** Nombre de usuario único para login */
  username: string;
  /** Email del usuario, también usado para login */
  email: string;
  /** Nombre completo del usuario */
  nombre: string;
  /** Rol del usuario en texto (admin, profesor, estudiante) */
  rol?: string;
  /** ID del rol en la base de datos */
  id_rol?: number;
  /** ID del avatar asignado al usuario */
  id_avatar?: number;
  /** ID del tipo de documento del usuario */
  id_tipo_documento?: number;
}

/**
 * Interface para la respuesta de autenticación del servidor
 * Contiene los tokens JWT y datos del usuario
 */
export interface AuthResponse {
  /** Mensaje de respuesta del servidor */
  detail: string;
  /** Información completa del usuario autenticado */
  user: Usuario;
  /** Tokens JWT para autenticación */
  tokens: {
    /** Token de refresh para renovar la sesión */
    refresh: string;
    /** Token de acceso para hacer peticiones autenticadas */
    access: string;
  };
}

/**
 * Interface para los datos necesarios en el registro de usuarios
 * Contiene toda la información requerida para crear una cuenta
 */
export interface RegistroData {
  /** Nombre de usuario único */
  username: string;
  /** Email del usuario */
  email: string;
  /** Nombre completo */
  nombre: string;
  /** Contraseña en texto plano (se hashea en el servidor) */
  password: string;
  /** ID del rol a asignar (opcional) */
  id_rol?: number;
  /** ID del avatar seleccionado (opcional) */
  id_avatar?: number;
  /** ID del tipo de documento (opcional) */
  id_tipo_documento?: number;
}

// ===================================================================================================
// SERVICIO PRINCIPAL DE AUTENTICACIÓN
// ===================================================================================================

/**
 * Servicio de autenticación para la plataforma Kütsa
 *
 * Maneja todas las operaciones relacionadas con autenticación:
 * - Login y logout de usuarios
 * - Registro de diferentes tipos de usuarios (estudiante, profesor, admin)
 * - Gestión de tokens JWT (acceso y refresh)
 * - Verificación de roles y permisos
 * - Persistencia de datos de usuario en localStorage
 * - Compatibilidad con SSR (Server-Side Rendering)
 *
 * @author Sistema Kütsa
 * @version 2.0 - Sistema de autenticación robusto
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // ===================================================================================================
  // PROPIEDADES DEL SERVICIO
  // ===================================================================================================

  /** URL base de la API del backend */
  private apiUrl = 'http://localhost:8000/api/v1';

  /** Subject para manejar el estado reactivo del usuario actual */
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);

  /** Observable público para suscribirse a cambios del usuario actual */
  public currentUser$ = this.currentUserSubject.asObservable();

  /** Flag para verificar si estamos en el browser (compatibilidad SSR) */
  private isBrowser: boolean;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // ===================================================================================================
  // CONSTRUCTOR E INICIALIZACIÓN
  // ===================================================================================================

  /**
   * Constructor del servicio de autenticación
   * Inicializa la verificación de plataforma y carga el usuario actual si existe
   *
   * @param http - Cliente HTTP de Angular para peticiones a la API
   * @param platformId - ID de la plataforma para verificar SSR
   */
  constructor() {
    const platformId = inject<Object>(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCurrentUser();
  }

  // ===================================================================================================
  // MÉTODOS DE REGISTRO DE USUARIOS
  // ===================================================================================================

  /**
   * Registra un nuevo usuario general en el sistema
   * Maneja el registro estándar de estudiantes
   *
   * @param userData - Datos del usuario a registrar
   * @returns Observable con la respuesta de autenticación
   */
  registrar(userData: RegistroData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, userData).pipe(
      tap((response) => {
        this.storeAuthData(response);
      }),
    );
  }

  /**
   * Registra un nuevo profesor en el sistema
   * Endpoint específico para profesores con permisos elevados
   *
   * @param userData - Datos del profesor a registrar
   * @returns Observable con la respuesta de autenticación
   */
  registrarProfesor(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/profesor/`, userData).pipe(
      tap((response) => {
        this.storeAuthData(response);
      }),
    );
  }

  /**
   * Registra un nuevo administrador en el sistema
   * Endpoint específico para administradores con permisos máximos
   *
   * @param userData - Datos del administrador a registrar
   * @returns Observable con la respuesta de autenticación
   */
  registrarAdmin(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/admin/`, userData).pipe(
      tap((response) => {
        this.storeAuthData(response);
      }),
    );
  }

  // ===================================================================================================
  // MÉTODO DE LOGIN
  // ===================================================================================================

  /**
   * Autentica un usuario en el sistema
   * Acepta email y contraseña, retorna tokens JWT
   *
   * @param credentials - Credenciales de login (email y password)
   * @returns Observable con la respuesta de autenticación
   */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    console.log('AuthService - Enviando login a:', `${this.apiUrl}/login/`);
    console.log('AuthService - Credenciales:', {
      email: credentials.email,
      password: '***masked***',
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials, { headers }).pipe(
      tap((response) => {
        console.log('AuthService - Respuesta del servidor:', response);
        this.storeAuthData(response);
      }),
    );
  }

  // ===================================================================================================
  // MÉTODOS DE GESTIÓN DE SESIÓN
  // ===================================================================================================

  /**
   * Cierra la sesión del usuario actual
   * Elimina tokens del localStorage y resetea el estado del usuario
   */
  logout(): void {
    console.log('AuthService - Cerrando sesión');
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      console.log('AuthService - Datos eliminados del localStorage');
    }
    this.currentUserSubject.next(null);
    console.log('AuthService - Usuario desautenticado');
  }

  // ===================================================================================================
  // MÉTODOS GETTER PARA DATOS DEL USUARIO
  // ===================================================================================================

  /**
   * Obtiene el usuario actual desde localStorage
   * Compatible con SSR
   *
   * @returns Usuario actual o null si no hay sesión
   */
  getCurrentUser(): Usuario | null {
    if (!this.isBrowser) {
      return null;
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtiene el token de acceso JWT desde localStorage
   *
   * @returns Token de acceso o null si no existe
   */
  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  /**
   * Obtiene el token de refresh JWT desde localStorage
   *
   * @returns Token de refresh o null si no existe
   */
  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('refresh_token');
  }

  // ===================================================================================================
  // MÉTODOS DE VERIFICACIÓN DE ESTADO Y ROLES
  // ===================================================================================================

  /**
   * Verifica si el usuario está autenticado
   *
   * @returns true si tiene token de acceso, false en caso contrario
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Verifica si el usuario actual es administrador
   * Soporta múltiples variaciones del rol admin
   *
   * @returns true si es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando admin, usuario:', user);
    return user?.rol === 'admin' || user?.rol === 'administrador' || user?.rol === 'Administrador';
  }

  /**
   * Verifica si el usuario actual es profesor
   * Soporta múltiples variaciones del rol profesor
   *
   * @returns true si es profesor, false en caso contrario
   */
  isProfesor(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando profesor, usuario:', user);
    console.log('AuthService - Rol del usuario:', user?.rol);
    return user?.rol === 'profesor' || user?.rol === 'Profesor';
  }

  /**
   * Verifica si el usuario actual es estudiante
   * Por defecto asume estudiante si no hay rol específico
   *
   * @returns true si es estudiante, false en caso contrario
   */
  isEstudiante(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando estudiante, usuario:', user);
    console.log('AuthService - Rol del usuario:', user?.rol);
    return user?.rol === 'estudiante' || user?.rol === 'Estudiante' || !user?.rol;
  }

  // ===================================================================================================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ===================================================================================================

  /**
   * Almacena los datos de autenticación en localStorage
   * Actualiza el estado reactivo del usuario
   *
   * @param response - Respuesta de autenticación del servidor
   */
  private storeAuthData(response: AuthResponse): void {
    console.log('AuthService - Almacenando datos de autenticación:', response);
    console.log('AuthService - Usuario recibido:', response.user);
    console.log('AuthService - Rol recibido:', response.user.rol);

    if (this.isBrowser) {
      localStorage.setItem('access_token', response.tokens.access);
      localStorage.setItem('refresh_token', response.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('AuthService - Datos guardados en localStorage');

      // Verificar que se guardó correctamente
      const savedUser = localStorage.getItem('user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      console.log('AuthService - Usuario verificado en localStorage:', parsedUser);
      console.log('AuthService - Rol verificado en localStorage:', parsedUser?.rol);
    }
    this.currentUserSubject.next(response.user);
    console.log('AuthService - CurrentUserSubject actualizado con:', response.user);
  }

  /**
   * Carga el usuario actual desde localStorage al inicializar el servicio
   * Se ejecuta automáticamente en el constructor
   */
  private loadCurrentUser(): void {
    if (this.isBrowser) {
      const user = this.getCurrentUser();
      if (user) {
        console.log('AuthService - Usuario cargado desde localStorage:', user);
        console.log('AuthService - Rol cargado:', user.rol);
        this.currentUserSubject.next(user);
      } else {
        console.log('AuthService - No hay usuario en localStorage');
      }
    }
  }

  // ===================================================================================================
  // MÉTODOS DE UTILIDAD PARA HTTP
  // ===================================================================================================

  /**
   * Genera headers HTTP con autenticación JWT
   * Útil para peticiones que requieren autenticación
   *
   * @returns HttpHeaders con token Bearer y Content-Type
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
