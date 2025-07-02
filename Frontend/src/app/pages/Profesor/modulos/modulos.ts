import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';
import { ModulosService, Modulo } from '../../../services/modulos.service';

interface Curso {
  id_curso: number;
  nombre_curso: string;
}

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulos.html',
  styleUrl: './modulos.css',
})
export class Modulos implements OnInit {
  private router = inject(Router);
  private modulosService = inject(ModulosService);
  private cursosService = inject(CursosService);

  // Propiedades del componente
  cargando = false;
  cargandoCursos = false;
  cargandoModulos = false;
  cursos: any[] = [];
  modulosCreados: Modulo[] = [];

  modulo: Modulo = {
    nombre_modulo: '',
    contenido_modulo: '',
    id_curso: 0,
  };

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    // Constructor vacío, toda la inicialización en ngOnInit
  }

  ngOnInit(): void {
    console.log('Iniciando componente de módulos...');

    // Simplificar la inicialización - eliminar try-catch problemático
    this.cargarCursos();

    // Cargar módulos después de un breve delay
    setTimeout(() => {
      this.cargarModulos();
    }, 1000);
  }

  private cargarCursos(): void {
    this.cargandoCursos = true;
    console.log('Cargando cursos para módulos...');

    this.cursosService.getTodosAPI().subscribe({
      next: (cursos: any) => {
        console.log('Cursos recibidos:', cursos);

        if (Array.isArray(cursos)) {
          this.cursos = cursos.map((curso: any) => ({
            ...curso,
            id_curso: curso.id_curso || curso.id,
            nombre_curso: curso.nombre_curso || curso.nombre,
          }));
        } else {
          console.warn('La respuesta de cursos no es un array:', cursos);
          this.cursos = [];
        }

        this.cargandoCursos = false;
        console.log('Cursos procesados correctamente:', this.cursos.length);
      },
      error: (error: any) => {
        console.error('Error en API de cursos:', error);
        this.cursos = [];
        this.cargandoCursos = false;
        console.log('Estableciendo cursos vacíos debido a error');
      },
    });
  }

  private cargarModulos(): void {
    this.cargandoModulos = true;
    console.log('Cargando módulos creados...');

    this.modulosService.getTodosAPI().subscribe({
      next: (modulos: Modulo[]) => {
        console.log('Módulos recibidos:', modulos);

        if (Array.isArray(modulos)) {
          this.modulosCreados = modulos.map((modulo) => {
            const curso = this.cursos.find((c) => c.id_curso === modulo.id_curso);
            return {
              ...modulo,
              nombre_curso: curso ? curso.nombre_curso : 'Curso no encontrado',
            };
          });
        } else {
          console.warn('La respuesta de módulos no es un array:', modulos);
          this.modulosCreados = [];
        }

        this.cargandoModulos = false;
        console.log('Módulos procesados correctamente:', this.modulosCreados.length);
      },
      error: (error: any) => {
        console.error('Error en API de módulos:', error);
        this.modulosCreados = [];
        this.cargandoModulos = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;
    console.log('Enviando módulo:', this.modulo);

    this.modulosService.agregarAPI(this.modulo).subscribe({
      next: (response: Modulo) => {
        console.log('Módulo creado exitosamente:', response);

        // Limpiar formulario
        this.limpiarFormulario();

        // Recargar módulos
        this.cargarModulos();

        this.cargando = false;
        alert('Módulo creado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al crear módulo:', error);
        this.cargando = false;
        this.mostrarErrorCreacion(error);
      },
    });
  }

  private validarFormulario(): boolean {
    if (
      !this.modulo.id_curso ||
      !this.modulo.nombre_modulo.trim() ||
      !this.modulo.contenido_modulo.trim()
    ) {
      alert('Por favor completa todos los campos requeridos');
      return false;
    }
    return true;
  }

  private limpiarFormulario(): void {
    this.modulo = {
      nombre_modulo: '',
      contenido_modulo: '',
      id_curso: 0,
    };
  }

  private mostrarErrorCreacion(error: any): void {
    if (error.error && typeof error.error === 'object') {
      const errores: string[] = [];
      for (const [campo, mensajes] of Object.entries(error.error)) {
        if (Array.isArray(mensajes)) {
          errores.push(...mensajes);
        } else {
          errores.push(mensajes as string);
        }
      }
      alert('Error al crear módulo: ' + errores.join('. '));
    } else {
      alert('Error al crear módulo. Por favor intenta nuevamente.');
    }
  }

  eliminarModulo(modulo: Modulo, index: number): void {
    if (!modulo.id_modulo) {
      console.error('No se puede eliminar: ID del módulo no encontrado');
      alert('Error: No se puede eliminar el módulo. ID no válido.');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar el módulo "${modulo.nombre_modulo}"?`)) {
      console.log('Eliminando módulo:', modulo);

      this.modulosService.eliminarAPI(modulo.id_modulo).subscribe({
        next: () => {
          console.log('Módulo eliminado exitosamente');
          this.modulosCreados.splice(index, 1);
          alert('Módulo eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('Error al eliminar módulo:', error);
          alert('Error al eliminar módulo. Por favor intenta nuevamente.');
        },
      });
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/profesor/dashboard-profesor']);
  }

  // Métodos de utilidad para debugging
  debugEstado(): void {
    console.log('Estados actuales:', {
      cargando: this.cargando,
      cargandoCursos: this.cargandoCursos,
      cargandoModulos: this.cargandoModulos,
      cursos: this.cursos.length,
      modulos: this.modulosCreados.length,
    });
  }

  resetearEstados(): void {
    console.log('Reseteando todos los estados...');
    this.cargando = false;
    this.cargandoCursos = false;
    this.cargandoModulos = false;
    console.log('Estados reseteados');
  }
}
