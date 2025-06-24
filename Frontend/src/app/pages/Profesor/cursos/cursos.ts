import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos implements OnInit {
  modalCrearActivo = false;
  modalDetallesActivo = false;
  modalEdicionActivo = false;
  modalConfirmacionActivo = false;
  cursoSeleccionado: any = null;
  materialApoyo: File | null = null;

  userRole: string = '';
  mostrarSidebar = false;
  mostrarFooter = false;

  cursosCreados: any[] = [];

  nuevoCurso = {
    nombre: '',
    descripcion: '',
    contenido: '',
    categoria: '',
    activo: true,
    modulos: [],
    desafios: []
  };

  constructor(
    private router: Router,
    private cursosService: CursosService
  ) {}

  ngOnInit() {
    const paginasConNavbarFooter = ['inicio', 'registro', 'nosotros', 'login'];
    const rutaActual = this.router.url.split('/')[1];
    this.mostrarSidebar = !paginasConNavbarFooter.includes(rutaActual);
    this.mostrarFooter = paginasConNavbarFooter.includes(rutaActual);

    // Cargar cursos desde el servicio
    this.cursosCreados = this.cursosService.getTodos();
  }

  abrirModalCrear() {
    this.modalCrearActivo = true;
  }

  cerrarModalCrear() {
    this.modalCrearActivo = false;
  }

  crearCurso() {
    if (
      this.nuevoCurso.nombre.trim() &&
      this.nuevoCurso.descripcion.trim() &&
      this.nuevoCurso.contenido.trim()
    ) {
      this.cursosService.agregar({ ...this.nuevoCurso });
      this.cursosCreados = this.cursosService.getTodos();
      this.nuevoCurso = {
        nombre: '',
        descripcion: '',
        contenido: '',
        categoria: '',
        activo: true,
        modulos: [],
        desafios: []
      };
      this.modalCrearActivo = false;
      this.modalConfirmacionActivo = true;
    }
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
  }

  abrirModalDetalles(curso: any) {
    this.cursoSeleccionado = { ...curso };
    this.modalDetallesActivo = true;
  }

  cerrarModalDetalles() {
    this.modalDetallesActivo = false;
    this.cursoSeleccionado = null;
  }

  eliminarCurso(curso: any) {
    this.cursosService.eliminar(curso.id);
    this.cursosCreados = this.cursosService.getTodos();
  }

  editarCurso(curso: any) {
    this.cursoSeleccionado = { ...curso };
    this.modalEdicionActivo = true;
    this.modalDetallesActivo = false;
  }

  guardarEdicionCurso() {
    this.cursosService.actualizar(this.cursoSeleccionado);
    this.cursosCreados = this.cursosService.getTodos();
    this.modalEdicionActivo = false;
    this.modalConfirmacionActivo = true;
  }

  cerrarModalEdicion() {
    this.modalEdicionActivo = false;
    this.modalDetallesActivo = true;
  }

  cerrarTodosLosModales() {
    this.modalConfirmacionActivo = false;
    this.modalDetallesActivo = false;
    this.modalEdicionActivo = false;
    this.modalCrearActivo = false;
    this.cursoSeleccionado = null;
  }

  agregarMaterial(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.materialApoyo = archivo;
      if (this.cursoSeleccionado) {
        this.cursoSeleccionado.material = archivo.name;
      }
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
