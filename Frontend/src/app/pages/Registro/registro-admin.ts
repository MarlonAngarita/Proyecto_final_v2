// ===================================================================================================
// COMPONENTE DE REGISTRO DE ADMINISTRADOR - SISTEMA KÜTSA
// ===================================================================================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Registro de Administrador para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Formulario especializado para registro de administradores
 * - Validación de contraseñas con confirmación
 * - Manejo de errores específicos de registro
 * - Estados de carga y feedback visual
 * - Modal de confirmación exitosa
 * - Navegación y redireccionamiento
 *
 * Este componente permite crear nuevas cuentas de administrador
 * con permisos elevados en el sistema. Incluye validaciones
 * adicionales y un flujo de registro específico para este rol.
 *
 * @author Sistema Kütsa
 * @version 2.0 - Registro de administrador con validaciones robustas
 */
@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroAdmin {
  router = inject(Router);
  private authService = inject(AuthService);

  // ===================================================================================================
  // PROPIEDADES DEL COMPONENTE
  // ===================================================================================================

  /** Flag para mostrar el modal de confirmación exitosa */
  mostrarConfirmacion = false;

  /** Flag para mostrar error de confirmación de contraseña */
  errorConfirmacion = false;

  /** Mensaje de error de registro para mostrar al usuario */
  errorRegistro = '';

  /** Estado de carga durante el proceso de registro */
  cargando = false;

  // Personalización específica para administrador
  /** Título personalizado del formulario */
  tituloFormulario = 'Registro de Administrador';

  /** Texto personalizado del botón de envío */
  textoBoton = 'Registrar Administrador';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del componente de registro de administrador
   *
   * @param router - Router de Angular para navegación
   * @param authService - Servicio de autenticación para registro
   */
  constructor() {}

  // ===================================================================================================
  // MÉTODOS DE NAVEGACIÓN Y UI
  // ===================================================================================================

  /**
   * Navega suavemente a una sección específica de la página
   *
   * @param id - ID del elemento HTML al que navegar
   */
  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===================================================================================================
  // MÉTODO PRINCIPAL DE REGISTRO
  // ===================================================================================================

  /**
   * Maneja el envío del formulario de registro de administrador
   *
   * Proceso completo:
   * 1. Valida el formulario y campos requeridos
   * 2. Verifica que las contraseñas coincidan
   * 3. Prepara los datos del administrador
   * 4. Llama al servicio de registro específico para admin
   * 5. Maneja respuesta exitosa o errores
   * 6. Muestra modal de confirmación
   *
   * @param form - Formulario de Angular con los datos del administrador
   */
  onSubmit(form: NgForm): void {
    const valores = form.value;
    const contrasena = valores.password;
    const confirmar = valores.confirmar;

    // Validación del formulario
    if (!form.valid) {
      Object.values(form.controls).forEach((control) => control?.markAsTouched());
      return;
    }

    // Validación de confirmación de contraseña
    if (contrasena !== confirmar) {
      this.errorConfirmacion = true;
      return;
    }

    // Reset de estados de error
    this.errorConfirmacion = false;
    this.cargando = true;
    this.errorRegistro = '';

    // Preparar datos del administrador
    const nuevoAdmin = {
      username: valores.email, // El username será igual al email
      email: valores.email,
      nombre: `${valores.nombre} ${valores.apellido}`.trim(), // Combinar nombre y apellido
      password: contrasena,
    };

    // Usar endpoint específico para registro de administradores
    this.authService.registrarAdmin(nuevoAdmin).subscribe({
      next: (response) => {
        this.cargando = false;
        this.mostrarConfirmacion = true;
        form.resetForm();
        console.log('Administrador registrado exitosamente:', response);

        // Redirigir automáticamente al inicio después de 2 segundos
        // TODO: Cambiar a dashboard de admin cuando esté implementado
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.cargando = false;

        // Manejo detallado de errores del servidor
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
          this.errorRegistro = error.error?.detail || 'Error al registrar administrador';
        }
        console.error('Error de registro de administrador:', error);
      },
    });
  }

  // ===================================================================================================
  // MÉTODOS DE GESTIÓN DE MODAL
  // ===================================================================================================

  /**
   * Cierra el modal de confirmación y redirige al inicio
   *
   * TODO: Cambiar redirección a dashboard de admin cuando esté implementado
   */
  cerrarModal(): void {
    this.mostrarConfirmacion = false;
    // Navegar inmediatamente al inicio cuando se cierra el modal
    this.router.navigate(['/']);
  }
}
