import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Usuario {
  id?: number;
  username: string;
  email: string;
  nombre: string;
  rol?: string;
  id_rol?: number;
  id_avatar?: number;
  id_tipo_documento?: number;
}

export interface AuthResponse {
  detail: string;
  user: Usuario;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface RegistroData {
  username: string;
  email: string;
  nombre: string;
  password: string;
  id_rol?: number;
  id_avatar?: number;
  id_tipo_documento?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCurrentUser();
  }

  registrar(userData: RegistroData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, userData)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
        })
      );
  }

  // Registro específico para profesor
  registrarProfesor(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/profesor/`, userData)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
        })
      );
  }

  // Registro específico para administrador
  registrarAdmin(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/admin/`, userData)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    console.log('AuthService - Enviando login a:', `${this.apiUrl}/login/`);
    console.log('AuthService - Credenciales:', { email: credentials.email, password: '***masked***' });
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log('AuthService - Respuesta del servidor:', response);
          this.storeAuthData(response);
        })
      );
  }

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

  getCurrentUser(): Usuario | null {
    if (!this.isBrowser) {
      return null;
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando admin, usuario:', user);
    return user?.rol === 'admin' || user?.rol === 'administrador' || user?.rol === 'Administrador';
  }

  isProfesor(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando profesor, usuario:', user);
    console.log('AuthService - Rol del usuario:', user?.rol);
    return user?.rol === 'profesor' || user?.rol === 'Profesor';
  }

  isEstudiante(): boolean {
    const user = this.getCurrentUser();
    console.log('AuthService - Verificando estudiante, usuario:', user);
    console.log('AuthService - Rol del usuario:', user?.rol);
    return user?.rol === 'estudiante' || user?.rol === 'Estudiante' || !user?.rol;
  }

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

  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
