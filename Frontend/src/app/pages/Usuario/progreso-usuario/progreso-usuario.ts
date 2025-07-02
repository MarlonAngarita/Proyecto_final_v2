import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progreso-usuario',
  standalone: true,
  templateUrl: './progreso-usuario.html',
  styleUrls: ['./progreso-usuario.css'],
})
export class ProgresoUsuario implements OnInit {
  cursosCompletados = 0;
  cursosInscritos = 0;
  diasRegistrado = 0;
  puntaje = 0;

  ngOnInit(): void {
    // Obtener datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const cursosInscritos = JSON.parse(localStorage.getItem('cursosInscritos') || '[]');
    this.cursosInscritos = cursosInscritos.length || 0;
    this.cursosCompletados = user.cursosCompletados || 0;
    // Calcular días registrado
    const fechaRegistro = user.fechaRegistro ? new Date(user.fechaRegistro) : new Date();
    this.diasRegistrado = Math.floor(
      (Date.now() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24),
    );
    // Puntaje simple: cursos completados * 100 + días registrado * 10
    this.puntaje = this.cursosCompletados * 100 + this.diasRegistrado * 10;
  }
}
