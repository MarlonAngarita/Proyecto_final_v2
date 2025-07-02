import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente de barra de navegación principal
 *
 * @class navbar
 * @description Componente que proporciona la navegación principal de la aplicación.
 *              Incluye enlaces a las diferentes secciones de la landing page,
 *              navegación entre rutas y funcionalidades de scroll suave.
 *
 * Funcionalidades principales:
 * - Navegación entre rutas de la aplicación
 * - Redirección a secciones específicas con fragmentos
 * - Scroll suave a elementos dentro de la página
 * - Interfaz de navegación consistente en toda la app
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class navbar {
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor del componente navbar
   * @param {Router} router - Servicio de enrutamiento de Angular para navegación
   */
  constructor() {}

  /**
   * Navega a la página de inicio con un fragmento específico
   * @param {string} seccion - Nombre del fragmento/sección a la que navegar
   * @description Redirige a la ruta raíz '/' y establece un fragmento para hacer scroll
   *              automáticamente a la sección especificada en la landing page
   */
  irASeccion(seccion: string): void {
    this.router.navigate(['/'], { fragment: seccion });
  }

  /**
   * Realiza scroll suave a una sección específica de la página actual
   * @param {string} id - ID del elemento HTML al que hacer scroll
   * @description Implementa navegación suave dentro de la página usando scrollIntoView
   *              Útil para navegación dentro de una misma página sin cambiar la ruta
   */
  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
