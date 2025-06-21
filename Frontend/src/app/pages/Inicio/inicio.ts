import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio {
  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
