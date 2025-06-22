import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-foro-profesores',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class Foro {
  tituloPost: string = '';
  contenidoPost: string = '';
  publicaciones: { autor: string; tiempo: string; contenido: string; imagen: string }[] = [
    {
      autor: 'Usuario 1',
      tiempo: 'Hace 5 min',
      contenido: 'Este foro es increíble, ¿qué opinan?',
      imagen:
        'https://img.freepik.com/vector-premium/entrenador-fitness-imagen-vectorial-icono-femenino-puede-usar-profesiones_120816-263153.jpg?w=740',
    },
  ];

  publicarPost() {
    if (this.tituloPost.trim() && this.contenidoPost.trim()) {
      this.publicaciones.unshift({
        autor: 'Profesor',
        tiempo: 'Hace un momento',
        contenido: this.contenidoPost,
        imagen:
          'https://img.freepik.com/vector-premium/entrenador-fitness-imagen-vectorial-icono-femenino-puede-usar-profesiones_120816-263153.jpg?w=740',
      });

      this.tituloPost = '';
      this.contenidoPost = '';
    }
  }

  eliminarPost(index: number) {
    this.publicaciones.splice(index, 1);
  }
}
