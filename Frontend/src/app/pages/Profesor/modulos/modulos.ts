import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Curso {
  id_curso: number;
  nombre_curso: string;
}

interface Modulo {
  nombre_modulo: string;
  contenido_modulo: string;
  id_curso: number | null;
}

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './modulos.html',
  styleUrl: './modulos.css'
})
export class Modulos {
  modulo: Modulo = {
    nombre_modulo: '',
    contenido_modulo: '',
    id_curso: null
  };

  cursos: Curso[] = [
    // Ejemplo de cursos, reemplaza por datos reales desde el servicio
    { id_curso: 1, nombre_curso: 'Curso de ejemplo 1' },
    { id_curso: 2, nombre_curso: 'Curso de ejemplo 2' }
  ];

  onSubmit() {
    if (this.modulo.nombre_modulo && this.modulo.contenido_modulo && this.modulo.id_curso) {
      // Aquí iría la lógica para guardar el módulo (servicio HTTP)
      alert('Módulo guardado correctamente');
      // Reiniciar formulario si lo deseas
      this.modulo = { nombre_modulo: '', contenido_modulo: '', id_curso: null };
    }
  }
}
