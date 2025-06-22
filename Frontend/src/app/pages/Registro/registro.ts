import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  errorConfirmacion = false;

  constructor(public router: Router) {}

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit(form: NgForm): void {
    const valores = form.value;
    const contrasena = valores.password;
    const confirmar = valores.confirmar;

    if (!form.valid) {
      Object.values(form.controls).forEach(control => control?.markAsTouched());
      return;
    }

    if (contrasena !== confirmar) {
      this.errorConfirmacion = true;
      return;
    }

    this.errorConfirmacion = false;
    this.mostrarConfirmacion = true;
    form.resetForm();
  }

  cerrarModal(): void {
    this.mostrarConfirmacion = false;
    this.router.navigate(['/login']);
  }
}
