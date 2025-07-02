// ===================================================================================================
// GUARDS DE AUTENTICACIÓN - SISTEMA KÜTSA
// ===================================================================================================

import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ===================================================================================================
// GUARD PARA RUTAS DE ADMINISTRADOR
// ===================================================================================================

/**
 * Guard de seguridad para rutas de administrador
 *
 * Verifica que el usuario esté autenticado Y tenga rol de administrador
 * antes de permitir el acceso a rutas administrativas.
 *
 * Comportamiento:
 * - Si está autenticado y es admin: permite el acceso
 * - Si no está autenticado: redirige a /login
 * - Si está autenticado pero no es admin: redirige a /dashboard
 *
 * @author Sistema Kütsa
 * @version 2.0 - Guard de administrador robusto
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del guard de administrador
   *
   * @param authService - Servicio de autenticación para verificar estado
   * @param router - Router para redirecciones de seguridad
   */
  constructor() {}

  /**
   * Determina si la ruta puede ser activada
   *
   * @param route - Información de la ruta activada
   * @param state - Estado actual del router
   * @returns true si puede acceder, false si debe ser redirigido
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si está autenticado Y es administrador
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    // Redirigir al login si no está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      // Redirigir al dashboard si está autenticado pero no es admin
      this.router.navigate(['/dashboard']);
    }

    return false;
  }
}

// ===================================================================================================
// GUARD PARA RUTAS AUTENTICADAS GENERALES
// ===================================================================================================

/**
 * Guard de seguridad para rutas que requieren autenticación
 *
 * Verifica que el usuario esté autenticado antes de permitir
 * el acceso a cualquier ruta protegida del sistema.
 *
 * Comportamiento:
 * - Si está autenticado: permite el acceso
 * - Si no está autenticado: redirige a /login
 *
 * @author Sistema Kütsa
 * @version 2.0 - Guard de autenticación general
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del guard de autenticación
   *
   * @param authService - Servicio de autenticación para verificar estado
   * @param router - Router para redirecciones de seguridad
   */
  constructor() {}

  /**
   * Determina si la ruta puede ser activada
   *
   * @param route - Información de la ruta activada
   * @param state - Estado actual del router
   * @returns true si puede acceder, false si debe ser redirigido
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirigir al login si no está autenticado
    this.router.navigate(['/login']);
    return false;
  }
}
