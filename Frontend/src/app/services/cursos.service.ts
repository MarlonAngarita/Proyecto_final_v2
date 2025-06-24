import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursos = [
    {
      id: 1,
      nombre: 'Lógica retro básica',
      descripcion: 'Curso introductorio con enfoque clásico 8-bit',
      categoria: 'Programación',
      activo: true,
      modulos: ['Módulo 1: Patrones clásicos', 'Módulo 2: Secuencias numéricas'],
      desafios: [1, 2] // IDs de desafíos
    },
    {
      id: 2,
      nombre: 'Estética y diseño pixelado',
      descripcion: 'Diseño web con estilo arcade y tipografías tipo consola',
      categoria: 'Diseño',
      activo: false,
      modulos: ['Módulo 1: Tipografías retro'],
      desafios: [3]
    }
  ];

  getTodos(): any[] {
    return this.cursos;
  }

  getActivos(): any[] {
    return this.cursos.filter(c => c.activo);
  }

  agregar(curso: any): void {
    const nuevo = { ...curso, id: Date.now(), modulos: [], desafios: [] };
    this.cursos.push(nuevo);
  }

  actualizar(curso: any): void {
    const index = this.cursos.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      this.cursos[index] = { ...curso };
    }
  }

  eliminar(id: number): void {
    this.cursos = this.cursos.filter(c => c.id !== id);
  }

  asignarDesafios(cursoId: number, desafiosIds: number[]): void {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.desafios = [...desafiosIds];
    }
  }

  asignarModulos(cursoId: number, modulos: string[]): void {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      curso.modulos = [...modulos];
    }
  }
}
