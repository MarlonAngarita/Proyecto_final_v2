import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DesafiosService {
  private desafios = [
    {
      id: 1,
      titulo: 'Operaciones retro',
      descripcion: 'Corrige un flujo lógico clásico',
      nivel: 'intermedio',
      activo: true,
    },
    {
      id: 2,
      titulo: 'Secuencia misteriosa',
      descripcion: 'Adivina la regla de la serie',
      nivel: 'básico',
      activo: true,
    },
    {
      id: 3,
      titulo: 'Desafío bloqueado',
      descripcion: 'Visible solo si completas anteriores',
      nivel: 'avanzado',
      activo: false,
    },
  ];

  getTodos(): any[] {
    return this.desafios;
  }

  getActivos(): any[] {
    return this.desafios.filter(d => d.activo);
  }

  agregar(desafio: any): void {
    this.desafios.push({ ...desafio, id: Date.now() });
  }

  actualizar(editado: any): void {
    const index = this.desafios.findIndex(d => d.id === editado.id);
    if (index !== -1) {
      this.desafios[index] = { ...editado };
    }
  }

  eliminar(id: number): void {
    this.desafios = this.desafios.filter(d => d.id !== id);
  }
}
