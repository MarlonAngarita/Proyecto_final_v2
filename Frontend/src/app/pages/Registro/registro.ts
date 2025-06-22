import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  mostrarConfirmacion = false;

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.mostrarConfirmacion = true;
      form.resetForm();

      setTimeout(() => {
        this.mostrarConfirmacion = false;
      }, 5000);
    } else {
      // Marca todos los campos como tocados para que se muestren advertencias si las tienes configuradas en el HTML
      Object.values(form.controls).forEach(control => control?.markAsTouched());
    }
  }

  cerrarModal(): void {
    this.mostrarConfirmacion = false;
  }
}
