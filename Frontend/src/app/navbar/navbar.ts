import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class navbar {
  constructor(private router: Router) {}

  // Redirige a la ruta 'home' con fragmento
  irASeccion(seccion: string): void {
    this.router.navigate(['/'], { fragment: seccion });
  }
  
    scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
