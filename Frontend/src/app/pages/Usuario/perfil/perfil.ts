import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  private userService = inject(UserService);

  usuario: any = {};
  modoEdicion = false;
  modalConfirmacionActivo = false;
  mostrarContrasena = false;
  mostrarConfirmacion = false;
  contrasenasCoinciden = true;

  nuevoNombre = '';
  nuevoCorreo = '';
  nuevoCiudad = '';
  nuevoAvatar = '';
  nuevaContrasena = '';
  confirmarContrasena = '';

  avatarOpciones = [
    'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Pixel1',
    'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Pixel2',
    'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Pixel3',
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.usuario = this.userService.getUsuarioActual();
    this.nuevoNombre = this.usuario.nombre;
    this.nuevoCorreo = this.usuario.email;
    this.nuevoCiudad = this.usuario.ciudad;
    this.nuevoAvatar = this.usuario.avatar || this.avatarOpciones[0];
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.nuevoNombre = this.usuario.nombre;
    this.nuevoCorreo = this.usuario.email;
    this.nuevoCiudad = this.usuario.ciudad;
    this.nuevoAvatar = this.usuario.avatar;
  }

  guardarCambios() {
    this.usuario.nombre = this.nuevoNombre;
    this.usuario.email = this.nuevoCorreo;
    this.usuario.ciudad = this.nuevoCiudad;
    this.usuario.avatar = this.nuevoAvatar;
    if (this.nuevaContrasena || this.confirmarContrasena) {
      if (this.nuevaContrasena !== this.confirmarContrasena) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      // Aquí se puede enviar la nueva contraseña al backend o servicio
      console.log('Contraseña actualizada:', this.nuevaContrasena);
    }

    this.userService.actualizarUsuario(this.usuario);
    this.modoEdicion = false;
    this.modalConfirmacionActivo = true;
  }

  seleccionarAvatar(url: string) {
    this.nuevoAvatar = url;
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
    this.modoEdicion = false;
  }

  validarContrasenas() {
    this.contrasenasCoinciden =
      !this.nuevaContrasena ||
      !this.confirmarContrasena ||
      this.nuevaContrasena === this.confirmarContrasena;
  }
}
