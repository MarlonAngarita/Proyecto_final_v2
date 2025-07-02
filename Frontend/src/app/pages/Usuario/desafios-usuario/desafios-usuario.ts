import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesafiosService } from '../../../services/desafios.service';

@Component({
  selector: 'app-desafios-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desafios-usuario.html',
  styleUrls: ['./desafios-usuario.css'],
})
export class DesafiosUsuario implements OnInit {
  // Estados de carga
  cargando = false;
  cargandoDesafios = false;
  errorCarga = '';

  // Datos de desafíos
  desafios: any[] = [];
  desafiosCompletados: number[] = []; // IDs de desafíos completados
  desafioActual: any = null;

  // Estados de modales
  modalDesafioActivo = false;
  modalCompletadoActivo = false;
  mensajeConfirmacion = '';

  // Datos estáticos como fallback
  private desafiosEstaticos = [
    {
      id: 1,
      nombre_desafio: 'Operaciones retro',
      descripcion: 'Corrige un flujo lógico clásico aplicando conceptos de programación funcional.',
      recompensa: 50,
      dificultad: 'intermedio',
      activo: true,
    },
    {
      id: 2,
      nombre_desafio: 'Secuencia misteriosa',
      descripcion: 'Adivina la regla matemática detrás de esta secuencia de números.',
      recompensa: 30,
      dificultad: 'facil',
      activo: true,
    },
    {
      id: 3,
      nombre_desafio: 'Algoritmo avanzado',
      descripcion: 'Optimiza este algoritmo para mejorar su complejidad temporal.',
      recompensa: 100,
      dificultad: 'dificil',
      activo: true,
    },
  ];

  constructor(
    private desafiosService: DesafiosService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('Iniciando componente de desafíos de usuario...');
    this.cargarDesafiosCompletados();
    this.cargarDesafios();
  }

  private cargarDesafios(): void {
    this.cargandoDesafios = true;
    this.errorCarga = '';
    console.log('Cargando desafíos disponibles...');

    this.desafiosService.getTodosAPI().subscribe({
      next: (desafios: any[]) => {
        console.log('Desafíos recibidos:', desafios);

        if (Array.isArray(desafios)) {
          // Filtrar solo desafíos activos y mapear campos
          this.desafios = desafios
            .filter((desafio) => desafio.activo !== false)
            .map((desafio) => ({
              ...desafio,
              // Mapear para compatibilidad con template
              titulo: desafio.nombre_desafio,
              nivel: this.mapearDificultad(desafio.dificultad),
              descripcion: desafio.descripcion,
              puntos: desafio.recompensa,
            }));
        } else {
          console.warn('La respuesta de desafíos no es un array:', desafios);
          this.usarDesafiosEstaticos();
        }

        this.cargandoDesafios = false;
        console.log('Desafíos procesados correctamente:', this.desafios.length);
      },
      error: (error: any) => {
        console.error('Error en API de desafíos:', error);
        this.errorCarga = 'Error al cargar desafíos. Mostrando desafíos de ejemplo.';
        this.usarDesafiosEstaticos();
        this.cargandoDesafios = false;
      },
    });
  }

  private usarDesafiosEstaticos(): void {
    this.desafios = this.desafiosEstaticos.map((desafio) => ({
      ...desafio,
      titulo: desafio.nombre_desafio,
      nivel: this.mapearDificultad(desafio.dificultad),
      descripcion: desafio.descripcion,
      puntos: desafio.recompensa,
    }));
  }

  private mapearDificultad(dificultad: string): string {
    const mapeo: { [key: string]: string } = {
      facil: 'Básico',
      intermedio: 'Intermedio',
      dificil: 'Avanzado',
    };
    return mapeo[dificultad] || dificultad;
  }

  private cargarDesafiosCompletados(): void {
    try {
      const completados = localStorage.getItem('desafiosCompletados');
      if (completados) {
        this.desafiosCompletados = JSON.parse(completados);
      }
    } catch (error) {
      console.error('Error al cargar desafíos completados:', error);
      this.desafiosCompletados = [];
    }
  }

  private guardarDesafiosCompletados(): void {
    try {
      localStorage.setItem('desafiosCompletados', JSON.stringify(this.desafiosCompletados));
    } catch (error) {
      console.error('Error al guardar desafíos completados:', error);
    }
  }

  estaCompletado(desafioId: number): boolean {
    return this.desafiosCompletados.includes(desafioId);
  }

  comenzarDesafio(desafio: any): void {
    if (this.estaCompletado(desafio.id || 0)) {
      this.mostrarMensaje('¡Ya completaste este desafío!');
      return;
    }

    this.desafioActual = desafio;
    this.modalDesafioActivo = true;
    console.log('Iniciando desafío:', desafio);
  }

  completarDesafio(): void {
    if (!this.desafioActual) return;

    this.cargando = true;

    // Simular tiempo de procesamiento
    setTimeout(() => {
      // Marcar como completado
      const desafioId = this.desafioActual!.id || this.desafioActual!.titulo?.length || 0;
      this.desafiosCompletados.push(desafioId);
      this.guardarDesafiosCompletados();

      // Actualizar racha (simulado)
      this.actualizarRacha();

      this.cargando = false;
      this.modalDesafioActivo = false;
      this.modalCompletadoActivo = true;
      this.desafioActual = null;

      console.log('Desafío completado exitosamente');
    }, 1500);
  }

  private actualizarRacha(): void {
    try {
      // Simular actualización de racha
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const hoy = new Date().toDateString();
      const ultimaConexion = user.ultimaConexion;

      if (ultimaConexion !== hoy) {
        user.rachaDias = (user.rachaDias || 0) + 1;
        user.ultimaConexion = hoy;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error al actualizar racha:', error);
    }
  }

  cerrarModal(): void {
    this.modalDesafioActivo = false;
    this.desafioActual = null;
  }

  cerrarModalCompletado(): void {
    this.modalCompletadoActivo = false;
    this.mensajeConfirmacion = '';
  }

  recargarDesafios(): void {
    console.log('Recargando desafíos...');
    this.cargarDesafios();
  }

  private mostrarMensaje(mensaje: string): void {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = '';
    }, 3000);
  }

  volverAlDashboard(): void {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }

  // Métodos de utilidad para el template
  getNumeroDesafiosDisponibles(): number {
    return this.desafios.filter((d) => !this.estaCompletado(d.id || 0)).length;
  }

  getNumeroDesafiosCompletados(): number {
    return this.desafiosCompletados.length;
  }

  getColorDificultad(nivel: string): string {
    const colores: { [key: string]: string } = {
      Básico: '#4caf50',
      Intermedio: '#ff9800',
      Avanzado: '#f44336',
    };
    return colores[nivel] || '#9e9e9e';
  }

  getPuntosTotales(): number {
    return this.desafios
      .filter((d) => this.estaCompletado(d.id || 0))
      .reduce((total, d) => total + (d.puntos || 0), 0);
  }

  // Método para debugging
  debugEstado(): void {
    console.log('Estados actuales:', {
      cargando: this.cargando,
      cargandoDesafios: this.cargandoDesafios,
      desafios: this.desafios.length,
      completados: this.desafiosCompletados.length,
      disponibles: this.getNumeroDesafiosDisponibles(),
      puntosTotales: this.getPuntosTotales(),
      errorCarga: this.errorCarga,
    });
  }
}
