import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foro',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css'
})
export class ForoUsuario {
  tituloPost: string = '';
  contenidoPost: string = '';
  publicaciones: { autor: string; tiempo: string; titulo: string; contenido: string; imagen: string }[] = [
    {
      autor: 'Estudiante 1',
      tiempo: 'Hace 3 min',
      titulo: '¡Hola a todos!',
      contenido: '¿Alguien tiene dudas sobre el último módulo?',
      imagen:
        'https://img.freepik.com/vector-premium/estudiante-avatar-masculino-dibujos-animados_18591-51686.jpg?w=740',
    },
  ];

  constructor(private router: Router) {}

  publicarPost() {
    if (this.tituloPost.trim() && this.contenidoPost.trim()) {
      this.publicaciones.unshift({
        autor: 'Usuario',
        tiempo: 'Hace un momento',
        titulo: this.tituloPost,
        contenido: this.contenidoPost,
        imagen:
          'https://img.freepik.com/vector-premium/estudiante-avatar-masculino-dibujos-animados_18591-51686.jpg?w=740',
      });
      this.tituloPost = '';
      this.contenidoPost = '';
    }
  }

  eliminarPost(index: number) {
    this.publicaciones.splice(index, 1);
  }

  volverAlDashboard() {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }
}
