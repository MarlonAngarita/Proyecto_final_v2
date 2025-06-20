import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Update the import path to the correct relative location of NavbarComponent
import { navbar } from './navbar/navbar'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarNavbar = true;

  constructor () {
    if (typeof window !== 'undefined') {
      const rutasConNavbar = [ '/login', '/registro'];
      this.mostrarNavbar = rutasConNavbar.includes(window.location.pathname);
    }
  }
}
