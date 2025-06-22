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
      }
    });
  }
}
