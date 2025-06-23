import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desafios.html',
  styleUrls: ['./desafios.css'],
})
export class Desafios {
  // Lista inicial de desafíos simulados
  desafios = [
    {
      id: 1,
      titulo: 'Misión lógica básica',
      descripcion: 'Resuelve el acertijo de patrones',
      nivel: 'básico',
      activo: true,
    },
    {
      id: 2,
      titulo: 'Operaciones retro',
      descripcion: 'Encuentra errores en un flujo de código antiguo',
      nivel: 'intermedio',
      activo: false,
    },
  ];

  // Modelo de formulario para crear un nuevo desafío
  nuevoDesafio = {
    titulo: '',
    descripcion: '',
    nivel: '',
    activo: false,
  };

  // Referencia al desafío seleccionado para edición
  desafioEditando: any = null;

  // Referencia al desafío seleccionado para eliminación
  desafioEliminar: any = null;

  // Texto del mensaje de confirmación (para submodal)
  mensajeConfirmacion = '';

  // Agrega un nuevo desafío a la lista y limpia el formulario
  crearDesafio() {
    const nuevo = {
      ...this.nuevoDesafio,
      id: Date.now(),
    };
    this.desafios.push(nuevo);
    this.nuevoDesafio = {
      titulo: '',
      descripcion: '',
      nivel: '',
      activo: false,
    };
  }

  // Carga una copia del desafío en edición
  editarDesafio(desafio: any) {
    this.desafioEditando = { ...desafio };
  }

  // Aplica los cambios editados al desafío original
  guardarEdicion() {
    const index = this.desafios.findIndex(d => d.id === this.desafioEditando.id);
    if (index !== -1) {
      this.desafios[index] = { ...this.desafioEditando };
    }
    this.desafioEditando = null;
    this.mensajeConfirmacion = 'Desafío actualizado exitosamente';
  }

  // Cancela la edición y cierra el modal
  cancelarEdicion() {
    this.desafioEditando = null;
  }

  // Abre el modal de confirmación para eliminar un desafío
  eliminarDesafio(desafio: any) {
    this.desafioEliminar = desafio;
  }

  // Elimina el desafío confirmado y muestra mensaje
  confirmarEliminar() {
    this.desafios = this.desafios.filter(d => d.id !== this.desafioEliminar.id);
    this.desafioEliminar = null;
    this.mensajeConfirmacion = 'Desafío eliminado exitosamente';
  }

  // Cancela la eliminación
  cancelarEliminar() {
    this.desafioEliminar = null;
  }

  // Cierra el submodal de confirmación y cualquier otro modal abierto
  cerrarConfirmacion() {
    this.mensajeConfirmacion = '';
    this.desafioEditando = null;
    this.desafioEliminar = null;
  }
}
