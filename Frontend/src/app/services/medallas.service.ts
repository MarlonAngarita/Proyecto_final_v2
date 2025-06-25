import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MedallasService {
  private todasLasMedallas = [
    {
      id: 1,
      nombre: 'Racha x3',
      descripcion: 'Mantén una racha de 3 días consecutivos',
      icono: '🔥',
      condicion: (estado: any) => estado.rachaDias >= 3,
    },
    {
      id: 2,
      nombre: 'Desafiante I',
      descripcion: 'Resuelve 5 desafíos',
      icono: '🎯',
      condicion: (estado: any) => estado.desafiosResueltos >= 5,
    },
    {
      id: 3,
      nombre: 'Protección activada',
      descripcion: 'Usaste protección de racha al menos una vez',
      icono: '🛡️',
      condicion: (estado: any) => estado.usoProteccionRacha >= 1,
    },
    {
      id: 4,
      nombre: 'Recuperación lograda',
      descripcion: 'Recuperaste una racha perdida',
      icono: '💪',
      condicion: (estado: any) => estado.recuperacionesUsadas >= 1,
    },
    {
      id: 5,
      nombre: 'Graduado',
      descripcion: 'Completa 3 cursos',
      icono: '🎓',
      condicion: (estado: any) => estado.cursosCompletados >= 3,
    },
  ];

  obtenerMedallas(estadoUsuario: any): any[] {
    return this.todasLasMedallas.map(medalla => {
      return {
        ...medalla,
        obtenida: medalla.condicion(estadoUsuario),
      };
    });
  }
}
