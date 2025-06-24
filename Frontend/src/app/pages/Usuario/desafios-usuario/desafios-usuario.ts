import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesafiosService } from '../../../services/desafios.service';

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desafios-usuario.html',
  styleUrls: ['./desafios-usuario.css'],
})
export class DesafiosUsuario {
  desafios: any[] = [];
  nuevoDesafio = {
    titulo: '',
    descripcion: '',
    nivel: '',
    activo: false,
  };

  desafioEditando: any = null;
  desafioEliminar: any = null;
  mensajeConfirmacion = '';

  constructor(private DesafiosService: DesafiosService) {}

  ngOnInit() {
    // Carga inicial desde el servicio
    this.desafios = this.DesafiosService.getActivos();
  }

  crearDesafio() {
    this.DesafiosService.agregar(this.nuevoDesafio);
    this.desafios = this.DesafiosService.getTodos();
    this.nuevoDesafio = {
      titulo: '',
      descripcion: '',
      nivel: '',
      activo: false,
    };
  }

  editarDesafio(desafio: any) {
    this.desafioEditando = { ...desafio };
  }

  guardarEdicion() {
    this.DesafiosService.actualizar(this.desafioEditando);
    this.desafios = this.DesafiosService.getTodos();
    this.desafioEditando = null;
    this.mensajeConfirmacion = 'Desafío actualizado exitosamente';
  }

  cancelarEdicion() {
    this.desafioEditando = null;
  }

  eliminarDesafio(desafio: any) {
    this.desafioEliminar = desafio;
  }

  confirmarEliminar() {
    this.DesafiosService.eliminar(this.desafioEliminar.id);
    this.desafios = this.DesafiosService.getTodos();
    this.desafioEliminar = null;
    this.mensajeConfirmacion = 'Desafío eliminado exitosamente';
  }

  cancelarEliminar() {
    this.desafioEliminar = null;
  }

  cerrarConfirmacion() {
    this.mensajeConfirmacion = '';
    this.desafioEditando = null;
    this.desafioEliminar = null;
  }

  volverAlDashboard() {
    window.location.href = '/usuario/dashboard-usuario';
  }
}
