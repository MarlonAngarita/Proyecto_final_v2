import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursos = [
    {
      id: 1,
      nombre: 'Introducción a la lógica computacional',
      descripcion: 'Curso base sobre pensamiento lógico',
      activo: true,
      profesorId: 101,
    },
    {
      id: 2,
      nombre: 'Fundamentos del estilo retro',
      descripcion: 'Explora diseño e interfaces inspiradas en los 80s',
      activo: true,
      profesorId: 102,
    },
  ];

  getTodos(): any[] {
    return this.cursos;
  }

  agregar(curso: any): void {
    this.cursos.push({ ...curso, id: Date.now() });
  }

  actualizar(editado: any): void {
    const index = this.cursos.findIndex(c => c.id === editado.id);
    if (index !== -1) {
      this.cursos[index] = { ...editado };
    }
  }

  eliminar(id: number): void {
    this.cursos = this.cursos.filter(c => c.id !== id);
  }
}
