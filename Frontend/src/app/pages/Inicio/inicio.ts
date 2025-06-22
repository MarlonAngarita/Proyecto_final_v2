import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Inicio {
  mostrarConfirmacion = false;

  formulario = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    this.mostrarConfirmacion = true;

    // Resetea el formulario y el modelo
    form.resetForm();
    this.formulario = { nombre: '', email: '', mensaje: '' };

    setTimeout(() => {
      this.mostrarConfirmacion = false;
    }, 5000);
  }

  cerrarModal(): void {
    this.mostrarConfirmacion = false;
  }
}

