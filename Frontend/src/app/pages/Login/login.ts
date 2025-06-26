import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  errorLogin = '';
  cargando = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit(form: NgForm): void {
    const valores = form.value;

    if (!form.valid) {
      Object.values(form.controls).forEach(control => control?.markAsTouched());
      return;
    }

    this.cargando = true;
    this.errorLogin = '';

    const credentials = {
      email: valores.email,
      password: valores.password
    };

    console.log('Login - Enviando credenciales para:', credentials.email);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.cargando = false;
        console.log('Login Component - Login exitoso:', response);
        console.log('Login Component - Usuario recibido:', response.user);
        console.log('Login Component - Rol recibido:', response.user.rol);
        
        // Esperar un momento para que se guarden los datos
        setTimeout(() => {
          // Verificar el estado de autenticación
          console.log('Login Component - ¿Está autenticado?', this.authService.isAuthenticated());
          
          // Verificar usuario almacenado
          const storedUser = this.authService.getCurrentUser();
          console.log('Login Component - Usuario almacenado:', storedUser);
          console.log('Login Component - Rol almacenado:', storedUser?.rol);
          
          // Verificar cada tipo de rol
          console.log('Login Component - ¿Es admin?', this.authService.isAdmin());
          console.log('Login Component - ¿Es profesor?', this.authService.isProfesor());
          console.log('Login Component - ¿Es estudiante?', this.authService.isEstudiante());
          
          // Redirigir según el rol
          this.redirectUserByRole();
        }, 200); // Pequeño delay para asegurar que se procesó todo
      },
      error: (error) => {
        this.cargando = false;
        console.error('Login - Error completo:', error);
        console.error('Login - Status:', error.status);
        console.error('Login - Error body:', error.error);
        
        // Manejo mejorado de errores
        if (error.status === 0) {
          this.errorLogin = 'No se puede conectar con el servidor. Verifica que el backend esté funcionando en http://localhost:8000';
        } else if (error.status === 401) {
          this.errorLogin = 'Email o contraseña incorrectos';
        } else if (error.error?.detail) {
          this.errorLogin = error.error.detail;
        } else {
          this.errorLogin = 'Error al iniciar sesión. Intenta nuevamente';
        }
      }
    });
  }

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

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}
