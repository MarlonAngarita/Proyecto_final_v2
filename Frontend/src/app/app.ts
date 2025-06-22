import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { navbar } from './navbar/navbar';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mostrarNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rutasConNavbar = ['/login', '/registro'];
        this.mostrarNavbar = rutasConNavbar.includes(event.urlAfterRedirects);
        // Solo ejecutar en navegador
        if (typeof window !== 'undefined' && event.urlAfterRedirects.startsWith('/') && window.location.hash) {
          const fragment = window.location.hash.replace('#', '');
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Limpiar el fragmento de la URL después del scroll
              history.replaceState(null, '', window.location.pathname);
            }
          }, 100); // Espera a que el DOM esté listo
        }
      }
    });
  }
}
