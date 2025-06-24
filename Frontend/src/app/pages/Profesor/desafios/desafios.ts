import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesafiosService } from '../../../services/desafios.service'; // Ruta relativa

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desafios.html',
  styleUrls: ['./desafios.css'],
})
export class Desafios {
  // Lista de desafíos cargada desde el servicio
  desafios: any[] = [];

  // Objeto base para crear un nuevo desafío
  nuevoDesafio = {
    titulo: '',
    descripcion: '',
    nivel: '',
    activo: false,
  };

  // Referencia al desafío en edición
  desafioEditando: any = null;

  // Referencia al desafío que se desea eliminar
  desafioEliminar: any = null;

  // Mensaje que se muestra en el submodal de confirmación
  mensajeConfirmacion = '';

  // Inyección del servicio de desafíos
  constructor(private desafiosService: DesafiosService) {}

  // Al iniciar el componente se cargan los desafíos desde el servicio
  ngOnInit(): void {
    this.desafios = this.desafiosService.getTodos();
  }

  // Crea un nuevo desafío y actualiza la lista visible
  crearDesafio(): void {
    this.desafiosService.agregar(this.nuevoDesafio);
    this.desafios = this.desafiosService.getTodos();
    this.nuevoDesafio = {
      titulo: '',
      descripcion: '',
      nivel: '',
      activo: false,
    };
  }

  // Abre el modal de edición con una copia del desafío seleccionado
  editarDesafio(desafio: any): void {
    this.desafioEditando = { ...desafio };
  }

  // Guarda los cambios del desafío editado y actualiza la lista
  guardarEdicion(): void {
    this.desafiosService.actualizar(this.desafioEditando);
    this.desafios = this.desafiosService.getTodos();
    this.desafioEditando = null;
    this.mensajeConfirmacion = 'Desafío actualizado exitosamente';
  }

  // Cancela la edición y cierra el modal
  cancelarEdicion(): void {
    this.desafioEditando = null;
  }

  // Abre el modal de confirmación para eliminar un desafío
  eliminarDesafio(desafio: any): void {
    this.desafioEliminar = desafio;
  }

  // Confirma y ejecuta la eliminación del desafío
  confirmarEliminar(): void {
    this.desafiosService.eliminar(this.desafioEliminar.id);
    this.desafios = this.desafiosService.getTodos();
    this.desafioEliminar = null;
    this.mensajeConfirmacion = 'Desafío eliminado exitosamente';
  }

  // Cancela la eliminación y cierra el modal
  cancelarEliminar(): void {
    this.desafioEliminar = null;
  }

  // Cierra el submodal de confirmación y limpia estados
  cerrarConfirmacion(): void {
    this.mensajeConfirmacion = '';
    this.desafioEditando = null;
    this.desafioEliminar = null;
  }
}
