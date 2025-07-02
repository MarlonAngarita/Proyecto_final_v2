import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

/**
 * Componente de página de inicio/landing page
 *
 * @class Inicio
 * @description Componente principal que muestra la página de bienvenida de Kütsa.
 *              Incluye información sobre la plataforma, funcionalidades principales,
 *              formulario de contacto y navegación hacia el registro/login.
 *
 * Funcionalidades principales:
 * - Presentación visual de la plataforma
 * - Formulario de contacto con validación
 * - Navegación suave entre secciones (smooth scroll)
 * - Modal de confirmación para envío de formulario
 * - Enlaces a registro y login
 *
 * @author Sistema Kütsa
 * @version 1.0
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class Inicio {
  /** Controla la visibilidad del modal de confirmación */
  mostrarConfirmacion = false;

  /**
   * Modelo del formulario de contacto
   * @description Almacena los datos del formulario de contacto con la plataforma
   */
  formulario = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  /**
   * Realiza scroll suave a una sección específica de la página
   * @param {string} id - ID del elemento HTML al que hacer scroll
   * @description Implementa navegación suave dentro de la página usando scrollIntoView
   *              Mejora la experiencia del usuario al navegar entre secciones
   */
  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Maneja el envío del formulario de contacto
   * @param {NgForm} form - Referencia al formulario Angular
   * @description Valida el formulario, muestra confirmación y resetea los campos
   *              Simula el envío exitoso del mensaje de contacto
   */
  onSubmit(form: NgForm): void {
    if (!form.valid) return; // Validación de formulario

    this.mostrarConfirmacion = true; // Muestra modal de confirmación

    // Resetea el formulario y el modelo
    form.resetForm();
    this.formulario = { nombre: '', email: '', mensaje: '' };

    // Auto-cierra el modal después de 5 segundos
    setTimeout(() => {
      this.mostrarConfirmacion = false;
    }, 5000);
  }

  /**
   * Cierra el modal de confirmación manualmente
   * @description Permite al usuario cerrar el modal de confirmación antes del auto-cierre
   */
  cerrarModal(): void {
    this.mostrarConfirmacion = false;
  }
}
