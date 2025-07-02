import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroProfesor {
  router = inject(Router);
  private authService = inject(AuthService);

  mostrarConfirmacion = false;
  errorConfirmacion = false;
  errorRegistro = '';
  cargando = false;

  // Personalizar el título y texto para profesor
  tituloFormulario = 'Registro de Profesor';
  textoBoton = 'Registrar Profesor';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit(form: NgForm): void {
    const valores = form.value;
    const contrasena = valores.password;
    const confirmar = valores.confirmar;

    if (!form.valid) {
      Object.values(form.controls).forEach((control) => control?.markAsTouched());
      return;
    }

    if (contrasena !== confirmar) {
      this.errorConfirmacion = true;
      return;
    }

    this.errorConfirmacion = false;
    this.cargando = true;
    this.errorRegistro = '';

    const nuevoProfesor = {
      username: valores.email, // El username será igual al email
      email: valores.email,
      nombre: `${valores.nombre} ${valores.apellido}`.trim(), // Combinar nombre y apellido
      password: contrasena,
    };

    // Usar registrarProfesor en lugar de registrar
    this.authService.registrarProfesor(nuevoProfesor).subscribe({
      next: (response) => {
        this.cargando = false;
        this.mostrarConfirmacion = true;
        form.resetForm();
        console.log('Profesor registrado:', response);

        // Redirigir automáticamente al dashboard del profesor después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/profesor/dashboard-profesor']);
        }, 2000);
      },
      error: (error) => {
        this.cargando = false;
        if (error.error && typeof error.error === 'object') {
          const errores = [];
          for (const [campo, mensajes] of Object.entries(error.error)) {
            if (Array.isArray(mensajes)) {
              errores.push(...mensajes);
            } else {
              errores.push(mensajes);
            }
          }
          this.errorRegistro = errores.join('. ');
        } else {
          this.errorRegistro = error.error?.detail || 'Error al registrar profesor';
        }
        console.error('Error de registro:', error);
      },
    });
  }

  cerrarModal(): void {
    this.mostrarConfirmacion = false;
    // Navegar inmediatamente al dashboard del profesor cuando se cierra el modal
    this.router.navigate(['/profesor/dashboard-profesor']);
  }
}
