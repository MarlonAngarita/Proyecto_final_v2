import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-usuario.html',
  styleUrls: ['./dashboard-usuario.css'],
  providers: [UserService]
})
export class DashboardUsuario implements OnInit {
  nombreUsuario = '';
  correoUsuario = '';
  ciudadUsuario = '';
  rachaDias = 0;

  avatarURL = 'https://api.dicebear.com/9.x/fun-emoji/svg';
  progresoCurso = 65;
  medallas = [
    { nombre: 'Explorador', icono: '/assets/medalla1.png' },
    { nombre: 'Constante', icono: '/assets/medalla2.png' }
  ];
  desafiosActivos = 3;

  rachaMensaje = '';
  mostrarRachaRota = false;

  rachas = [
    { dias: 7, descripcion: '¡Una semana de actividad continua!', icono: '🔥' },
    { dias: 14, descripcion: '¡Dos semanas seguidas aprendiendo!', icono: '💪' },
    { dias: 30, descripcion: '¡Un mes completo de racha!', icono: '🏆' },
    { dias: 60, descripcion: '¡Dos meses sin fallar!', icono: '🌟' },
    { dias: 100, descripcion: '¡100 días de constancia!', icono: '🎉' }
  ];

  constructor(
    private userService: UserService,
    private router: Router
    // Si tienes un AuthService real, lo agregas aquí
    // private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUsuarioActual();
    this.nombreUsuario = user.nombre;
    this.correoUsuario = user.email;
    this.ciudadUsuario = user.ciudad;
    this.rachaDias = user.rachaDias;

    this.userService.actualizarConexion();

    if (this.userService.rompioRacha()) {
      const dias = this.userService.rachaAnterior();
      this.rachaMensaje = `¡Perdiste una racha de ${dias} días seguidos! 😢`;
      this.mostrarRachaRota = true;

      setTimeout(() => {
        this.mostrarRachaRota = false;
      }, 5000);
    }
  }

  cerrarSesion(): void {
    // this.authService.logout(); // si lo tienes implementado
    this.router.navigate(['/login']);
  }
}
