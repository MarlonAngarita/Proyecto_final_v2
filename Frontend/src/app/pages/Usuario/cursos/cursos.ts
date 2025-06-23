import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cursos-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos {
  vistaActual = 'disponibles';
  modalActivo = false;
  cursoSeleccionado: any = null;
  modalConfirmacionActivo = false;
  modalAlertaActivo = false;

  cursosDisponibles = [
    {
      titulo: 'Angular Básico',
      descripcion: 'Aprende lo esencial de Angular.',
      contenido: 'Introducción a componentes y servicios.',
    },
    {
      titulo: 'CSS Avanzado',
      descripcion: 'Domina animaciones y efectos.',
      contenido: 'Flexbox, Grid y Transiciones.',
    },
    {
      titulo: 'JavaScript Moderno',
      descripcion: 'Deep dive en ES6+.',
      contenido: 'Async/Await, Promesas y más.',
    },
  ];

  cursosInscritos: any[] = [];

  constructor(private router: Router) {} /* Se inyecta Router para la navegación */

  mostrarDisponibles() {
    this.vistaActual = 'disponibles';
  }

  mostrarInscritos() {
    this.vistaActual = 'inscritos';
  }

  abrirDetalles(curso: any) {
    this.cursoSeleccionado = curso;
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
    this.cursoSeleccionado = null;
  }

  verMasCurso() {
    console.log('Ver detalles del curso:', this.cursoSeleccionado);
    if (this.cursoSeleccionado) {
      this.router.navigate(['/usuario/detalle-curso'], {
        state: { curso: this.cursoSeleccionado },
      });
    }
  }

  inscribirseCurso() {
    if (this.cursosInscritos.some((curso) => curso.titulo === this.cursoSeleccionado.titulo)) {
      this.modalAlertaActivo = true; // Activa el modal de alerta si ya está inscrito
    } else {
      this.cursosInscritos.push(this.cursoSeleccionado);
      this.modalConfirmacionActivo = true; // Activa el modal de confirmación
    }
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
    this.modalActivo = false;
    this.cursoSeleccionado = null;
  }

  cerrarModalAlerta() {
    this.modalAlertaActivo = false;
  }
}
