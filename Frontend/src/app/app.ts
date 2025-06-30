/*
===================================================================================================
COMPONENTE PRINCIPAL DE LA APLICACIÓN - APP.TS
===================================================================================================

Este es el componente raíz de la aplicación Angular Kütsa.
Gestiona la navegación global, el navbar condicional y el scroll automático.

Características principales:
- Componente standalone con importaciones modernas
- Control dinámico de visibilidad del navbar
- Scroll automático a fragmentos de URL
- Compatibilidad con Server-Side Rendering (SSR)

@author Sistema Kütsa
@version 2.0 - Aplicación Angular moderna
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { navbar } from './navbar/navbar';
import { Router, NavigationEnd } from '@angular/router';

/**
 * Componente principal de la aplicación Kütsa
 * 
 * Funcionalidades:
 * - Gestión del layout principal con RouterOutlet
 * - Control condicional del navbar según la ruta
 * - Navegación automática a fragmentos de URL (#section)
 * - Compatibilidad SSR con verificaciones de browser
 * 
 * Rutas especiales:
 * - /login y /registro: Muestran el navbar
 * - Otras rutas: Ocultan el navbar (gestionado por componentes específicos)
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  
  /**
   * Controla la visibilidad del navbar según la ruta actual
   * true: Mostrar navbar | false: Ocultar navbar
   */
  mostrarNavbar = true;

  /**
   * Constructor del componente principal
   * Configura la lógica de navegación y control del navbar
   * 
   * @param router - Servicio de enrutamiento de Angular
   */
  constructor(private router: Router) {
    // Suscripción a eventos de navegación para controlar el navbar
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Rutas que deben mostrar el navbar (páginas públicas)
        const rutasConNavbar = ['/login', '/registro'];
        this.mostrarNavbar = rutasConNavbar.includes(event.urlAfterRedirects);
        
        // Gestión de scroll automático a fragmentos de URL
        // Solo ejecutar en el navegador (compatibilidad SSR)
        if (typeof window !== 'undefined' && event.urlAfterRedirects.startsWith('/') && window.location.hash) {
          const fragment = window.location.hash.replace('#', '');
          
          // Timeout para asegurar que el DOM esté renderizado
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              // Scroll suave al elemento objetivo
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              
              // Limpiar el fragmento de la URL después del scroll para UX limpia
              history.replaceState(null, '', window.location.pathname);
            }
          }, 100); // Espera a que el DOM esté listo
        }
      }
    });
  }
}
