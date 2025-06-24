import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ForoService {
  private hilos = [
    {
      id: 1,
      titulo: '¿Cómo resolvieron la misión lógica?',
      autor: 'usuario1',
      respuestas: [
        { autor: 'usuario2', mensaje: 'Usé un patrón XOR básico.' },
        { autor: 'usuario3', mensaje: '¡Yo también! Fue un reto genial.' }
      ],
    },
    {
      id: 2,
      titulo: 'Dudas sobre estilo retro en CSS',
      autor: 'usuario2',
      respuestas: [],
    },
  ];

  getHilos(): any[] {
    return this.hilos;
  }

  agregarHilo(hilo: any): void {
    this.hilos.push({ ...hilo, id: Date.now(), respuestas: [] });
  }

  responder(hiloId: number, respuesta: any): void {
    const hilo = this.hilos.find(h => h.id === hiloId);
    if (hilo) {
      hilo.respuestas.push({ ...respuesta });
    }
  }

  eliminarHilo(id: number): void {
    this.hilos = this.hilos.filter(h => h.id !== id);
  }
}
