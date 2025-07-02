import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usuario: any = {
    nombre: 'Nombre de prueba',
    email: 'usuario@correo.com',
    ciudad: 'Bogotá',
    avatar: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Pixel1',
    rachaDias: 1,
    ultimaConexion: new Date(),
  };

  private rompióRacha = false;
  private rachaPerdida = 0;

  getUsuarioActual(): any {
    return this.usuario;
  }

  actualizarUsuario(nuevosDatos: any): void {
    this.usuario = { ...this.usuario, ...nuevosDatos };
  }

  actualizarConexion(): void {
    const hoy = new Date().toDateString();
    const ultima = new Date(this.usuario.ultimaConexion).toDateString();

    if (ultima !== hoy) {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);

      if (ultima === ayer.toDateString()) {
        this.usuario.rachaDias += 1;
        this.rompióRacha = false;
      } else {
        this.rachaPerdida = this.usuario.rachaDias;
        this.usuario.rachaDias = 1;
        this.rompióRacha = true;
      }

      this.usuario.ultimaConexion = new Date();
    }
  }

  rompioRacha(): boolean {
    return this.rompióRacha;
  }

  rachaAnterior(): number {
    return this.rachaPerdida;
  }
}
