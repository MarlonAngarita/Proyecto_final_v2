import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  router = inject(Router);
  private authService = inject(AuthService);

  mostrarConfirmacion = false;
  errorConfirmacion = false;
  errorRegistro = '';
  cargando = false;

  // Propiedades para personalización (con valores por defecto)
  tituloFormulario = 'Registro de Usuario';
  textoBoton = 'Registrarse';

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

    // Solo registrar como usuario normal (estudiante)
    const nuevoUsuario = {
      username: valores.email, // El username será igual al email
      email: valores.email,
      nombre: `${valores.nombre} ${valores.apellido}`.trim(), // Combinar nombre y apellido
      password: contrasena,
    };

    this.authService.registrar(nuevoUsuario).subscribe({
      next: (response) => {
        this.cargando = false;
        this.mostrarConfirmacion = true;
        form.resetForm();
        console.log('Usuario registrado:', response);

        // Redirigir automáticamente al dashboard del usuario después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/usuario/dashboard-usuario']);
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
          this.errorRegistro = error.error?.detail || 'Error al registrar usuario';
        }
        console.error('Error de registro:', error);
      },
    });
  }

  cerrarModal(): void {
    this.mostrarConfirmacion = false;
    // Navegar inmediatamente al dashboard del usuario cuando se cierra el modal
    this.router.navigate(['/usuario/dashboard-usuario']);
  }
}
