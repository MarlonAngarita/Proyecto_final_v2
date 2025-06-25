import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-rachas-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rachas-usuario.html',
  styleUrl: './rachas-usuario.css'
})
export class RachasUsuario {
  rachas = [
    { dias: 7, descripcion: '¡Una semana de actividad continua!', icono: '🔥' },
    { dias: 14, descripcion: '¡Dos semanas seguidas aprendiendo!', icono: '💪' },
    { dias: 30, descripcion: '¡Un mes completo de racha!', icono: '🏆' },
    { dias: 60, descripcion: '¡Dos meses sin fallar!', icono: '🌟' },
    { dias: 100, descripcion: '¡100 días de constancia!', icono: '🎉' }
  ];
  rachaActual = 100;

  constructor(private userService: UserService) {
    const user = this.userService.getUsuarioActual();
    this.rachaActual = user.rachaDias;
  }

  volverAlDashboard() {
    window.location.href = '/usuario/dashboard-usuario';
  }
}
