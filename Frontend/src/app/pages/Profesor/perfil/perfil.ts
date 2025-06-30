import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-perfil-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class PerfilProfesor implements OnInit {
  profesor: any = {};
  modoEdicion = false;
  modalConfirmacionActivo = false;

  nuevoNombre = '';
  nuevoCorreo = '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  mostrarContrasena = false;
  mostrarConfirmacion = false;
  contrasenasCoinciden = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profesor = this.userService.getUsuarioActual();
    this.nuevoNombre = this.profesor.nombre;
    this.nuevoCorreo = this.profesor.email;
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.nuevoNombre = this.profesor.nombre;
    this.nuevoCorreo = this.profesor.email;
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  validarContrasenas() {
    this.contrasenasCoinciden =
      !this.nuevaContrasena ||
      this.nuevaContrasena === this.confirmarContrasena;
  }

  guardarCambios() {
    if (this.nuevaContrasena && !this.contrasenasCoinciden) return;

    this.profesor.nombre = this.nuevoNombre;
    this.profesor.email = this.nuevoCorreo;

    if (this.nuevaContrasena) {
      console.log('Contraseña actualizada:', this.nuevaContrasena);
    }

    this.userService.actualizarUsuario(this.profesor);
    this.modoEdicion = false;
    this.modalConfirmacionActivo = true;
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
  }
}
