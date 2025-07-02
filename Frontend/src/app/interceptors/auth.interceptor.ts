// ===================================================================================================
// INTERCEPTOR DE AUTENTICACIÓN - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor de HTTP para manejo automático de autenticación
 *
 * Funcionalidades principales:
 * - Inyecta automáticamente el token JWT en todas las peticiones HTTP
 * - Maneja errores de autenticación (401) de forma centralizada
 * - Redirige al login cuando el token expira
 * - Cierra sesión automáticamente en caso de token inválido
 *
 * Este interceptor se aplica a TODAS las peticiones HTTP de la aplicación,
 * garantizando que las peticiones autenticadas siempre tengan el token correcto
 * y manejando los errores de autenticación de forma consistente.
 *
 * @author Sistema Kütsa
 * @version 2.0 - Interceptor robusto para autenticación JWT
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del interceptor
   *
   * @param authService - Servicio de autenticación para obtener tokens
   * @param router - Router de Angular para redirecciones
   */
  constructor() {}

  /**
   * Intercepta todas las peticiones HTTP salientes
   *
   * Proceso de intercepción:
   * 1. Verifica si existe un token de acceso
   * 2. Si existe, clona la petición y agrega el header Authorization
   * 3. Continúa con la petición modificada
   * 4. Maneja errores de autenticación (401) automáticamente
   *
   * @param req - Petición HTTP original
   * @param next - Siguiente handler en la cadena de interceptores
   * @returns Observable con el evento HTTP procesado
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No agregar token a rutas públicas
    const publicUrls = ['/login', '/register', '/register/', '/registro'];
    const isPublic = publicUrls.some((url) => req.url.includes(url));
    const token = this.authService.getAccessToken();

    // Log para depuración: mostrar URL y token
    console.log('[AuthInterceptor] URL:', req.url);
    console.log('[AuthInterceptor] Token:', token);

    if (token && !isPublic) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el token expiró o es inválido (401 Unauthorized)
        if (error.status === 401) {
          // Cerrar sesión automáticamente
          this.authService.logout();
          // Redirigir al login
          this.router.navigate(['/login']);
        }

        // Propagar el error para que otros interceptores o componentes lo manejen
        return throwError(() => error);
      }),
    );
  }
}
