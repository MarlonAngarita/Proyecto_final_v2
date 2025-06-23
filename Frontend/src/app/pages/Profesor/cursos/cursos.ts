import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth';

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

  userRole: string = ''; /* ✅ Variable para validar el rol */
  mostrarSidebar = false; /* ✅ Control para mostrar sidebar */
  mostrarFooter = false; /* ✅ Control para mostrar footer */

  cursosCreados = [
    {
      nombre: 'Angular Avanzado',
      descripcion: 'Curso sobre servicios y módulos.',
      contenido: 'Inyección de dependencias, Lazy Loading.',
    },
    {
      nombre: 'Optimización CSS',
      descripcion: 'Mejores prácticas en rendimiento CSS.',
      contenido: 'Metodologías como BEM y Tailwind.',
    },
  ];

  nuevoCurso = { nombre: '', descripcion: '', contenido: '' };

  constructor(
    private router: Router,
    // private authService: AuthService,
  ) {}

  ngOnInit() {
    // this.userRole = this.authService.getUserRole();

    // if (!this.userRole || this.userRole !== 'profesor') {
    //   console.error('❌ Acceso denegado: No tienes permisos para esta vista.');
    //   this.router.navigate(['/login']); /* Redirige si el usuario no es profesor */
    // }

    /* Configuración de sidebar y footer según las reglas globales */
    const paginasConNavbarFooter = ['inicio', 'registro', 'nosotros', 'login'];
    const rutaActual = this.router.url.split('/')[1]; /* Obtiene la primera parte de la URL */

    this.mostrarSidebar = !paginasConNavbarFooter.includes(rutaActual);
    this.mostrarFooter = paginasConNavbarFooter.includes(rutaActual);
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
      const nuevoCurso = { ...this.nuevoCurso };
      this.cursosCreados.push(nuevoCurso); // Agrega el curso a la lista correctamente
      this.nuevoCurso = { nombre: '', descripcion: '', contenido: '' }; // Limpia el formulario
      this.modalCrearActivo = false;
      this.modalConfirmacionActivo = true; // Muestra el modal de confirmación
    }
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
  }

  abrirModalDetalles(curso: any) {
    this.cursoSeleccionado = { ...curso }; // Clona el curso para evitar referencias directas
    this.modalDetallesActivo = true;
  }

  cerrarModalDetalles() {
    this.modalDetallesActivo = false;
    this.cursoSeleccionado = null;
  }

  eliminarCurso(curso: any) {
    this.cursosCreados = this.cursosCreados.filter((c) => c !== curso);
  }

  editarCurso(curso: any) {
    this.cursoSeleccionado = JSON.parse(JSON.stringify(curso)); // Clona el objeto para evitar referencias directas
    this.modalEdicionActivo = true;
  }

  guardarEdicionCurso() {
    const index = this.cursosCreados.findIndex((c) => c.nombre === this.cursoSeleccionado.nombre);
    if (index !== -1) {
      this.cursosCreados[index] = { ...this.cursoSeleccionado }; // Actualiza los datos en la lista
      this.modalEdicionActivo = false;
      this.modalConfirmacionActivo = true; // Activa el modal de confirmación
    }
  }

  cerrarModalEdicion() {
    this.modalEdicionActivo = false;
    this.modalDetallesActivo = true; // Vuelve al modal de detalles si cancela
  }

  cerrarTodosLosModales() {
    this.modalConfirmacionActivo = false;
    this.modalDetallesActivo = false;
    this.modalEdicionActivo = false;
    this.cursoSeleccionado = null;
  }

  agregarMaterial(event: any) {
    this.materialApoyo = event.target.files[0];
  }

  volverAlDashboard(): void {
  this.router.navigate(['/dashboard']);
}

}
