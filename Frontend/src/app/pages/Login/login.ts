// ===================================================================================================
// COMPONENTE DE LOGIN - SISTEMA KÜTSA
// ===================================================================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Login para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Formulario de autenticación con validación
 * - Manejo de credenciales (email y contraseña)
 * - Redirección automática según rol del usuario
 * - Manejo robusto de errores de autenticación
 * - Estados de carga y feedback visual
 * - Navegación suave entre secciones
 *
 * Flujo de autenticación:
 * 1. Usuario ingresa credenciales
 * 2. Validación de formulario
 * 3. Petición de login al backend
 * 4. Almacenamiento de tokens JWT
 * 5. Redirección según rol (admin, profesor, estudiante)
 *
 * @author Sistema Kütsa
 * @version 2.0 - Login con redirección inteligente por roles
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // ===================================================================================================
  // PROPIEDADES DEL COMPONENTE
  // ===================================================================================================

  /** Mensaje de error para mostrar al usuario */
  errorLogin = '';

  /** Estado de carga durante el proceso de autenticación */
  cargando = false;

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del componente de login
   *
   * @param router - Router de Angular para navegación
   * @param authService - Servicio de autenticación para login
   */
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

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
  // MÉTODO PRINCIPAL DE AUTENTICACIÓN
  // ===================================================================================================

  /**
   * Maneja el envío del formulario de login
   *
   * Proceso completo:
   * 1. Valida el formulario
   * 2. Extrae credenciales
   * 3. Llama al servicio de autenticación
   * 4. Maneja respuesta exitosa o errores
   * 5. Redirige según rol del usuario
   *
   * @param form - Formulario de Angular con las credenciales
   */
  onSubmit(form: NgForm): void {
    const valores = form.value;

    // Validación del formulario
    if (!form.valid) {
      Object.values(form.controls).forEach((control) => control?.markAsTouched());
      return;
    }

    // Activar estado de carga
    this.cargando = true;
    this.errorLogin = '';

    // Preparar credenciales para envío
    const credentials = {
      email: valores.email,
      password: valores.password,
    };

    console.log('Login - Enviando credenciales para:', credentials.email);

    // Realizar petición de login
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.cargando = false;
        console.log('Login Component - Login exitoso:', response);
        console.log('Login Component - Usuario recibido:', response.user);
        console.log('Login Component - Rol recibido:', response.user.rol);

        // Esperar un momento para que se guarden los datos en localStorage
        setTimeout(() => {
          // Verificar el estado de autenticación
          console.log('Login Component - ¿Está autenticado?', this.authService.isAuthenticated());

          // Verificar usuario almacenado
          const storedUser = this.authService.getCurrentUser();
          console.log('Login Component - Usuario almacenado:', storedUser);
          console.log('Login Component - Rol almacenado:', storedUser?.rol);

          // Verificar cada tipo de rol para debugging
          console.log('Login Component - ¿Es admin?', this.authService.isAdmin());
          console.log('Login Component - ¿Es profesor?', this.authService.isProfesor());
          console.log('Login Component - ¿Es estudiante?', this.authService.isEstudiante());

          // Redirigir según el rol del usuario
          this.redirectUserByRole();
        }, 200); // Pequeño delay para asegurar que se procesó todo correctamente
      },
      error: (error) => {
        this.cargando = false;
        console.error('Login - Error completo:', error);
        console.error('Login - Status:', error.status);
        console.error('Login - Error body:', error.error);

        // Manejo mejorado de errores con mensajes específicos
        if (error.status === 0) {
          this.errorLogin =
            'No se puede conectar con el servidor. Verifica que el backend esté funcionando en http://localhost:8000';
        } else if (error.status === 401) {
          this.errorLogin = 'Email o contraseña incorrectos';
        } else if (error.error?.detail) {
          this.errorLogin = error.error.detail;
        } else {
          this.errorLogin = 'Error al iniciar sesión. Intenta nuevamente';
        }
      },
    });
  }

  // ===================================================================================================
  // MÉTODOS DE REDIRECCIÓN POR ROLES
  // ===================================================================================================

  /**
   * Redirige al usuario a la página correspondiente según su rol
   *
   * Lógica de redirección:
   * - Administrador: / (página principal con acceso total)
   * - Profesor: /profesor/dashboard-profesor
   * - Estudiante: /usuario/dashboard-usuario
   * - Sin rol identificado: / (página principal)
   */
  private redirectUserByRole(): void {
    console.log('Login Component - Iniciando redirección...');

    if (this.authService.isAdmin()) {
      console.log('Login Component - Redirigiendo como admin');
      this.router.navigate(['/']);
    } else if (this.authService.isProfesor()) {
      console.log('Login Component - Redirigiendo como profesor');
      this.router.navigate(['/profesor/dashboard-profesor']);
    } else if (this.authService.isEstudiante()) {
      console.log('Login Component - Redirigiendo como estudiante');
      this.router.navigate(['/usuario/dashboard-usuario']);
    } else {
      console.log('Login Component - Rol no identificado, redirigiendo a inicio');
      console.log('Login Component - Usuario actual:', this.authService.getCurrentUser());
      this.router.navigate(['/']);
    }
  }

  // ===================================================================================================
  // MÉTODOS DE NAVEGACIÓN ADICIONALES
  // ===================================================================================================

  /**
   * Navega a la página de registro de nuevos usuarios
   */
  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  /**
   * Navega a la página de inicio
   */
  irAInicio(): void {
    this.router.navigate(['/']);
  }
}
