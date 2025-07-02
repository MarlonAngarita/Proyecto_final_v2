import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CursosService } from '../../../services/cursos.service';
import { DesafiosService } from '../../../services/desafios.service';
import { ForoService } from '../../../services/foro.service';
import { MedallasService } from '../../../services/medallas.service';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-usuario.html',
  styleUrls: ['./dashboard-usuario.css'],
  providers: [UserService],
})
export class DashboardUsuario implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private cursosService = inject(CursosService);
  private desafiosService = inject(DesafiosService);
  private foroService = inject(ForoService);
  private medallasService = inject(MedallasService);

  // Datos del usuario
  nombreUsuario = '';
  correoUsuario = '';
  ciudadUsuario = '';
  rachaDias = 0;

  // Estados de carga
  cargando = false;
  cargandoDatos = false;
  errorCarga = '';

  // Datos del dashboard
  avatarURL = 'https://api.dicebear.com/9.x/fun-emoji/svg';
  progresoCurso = 0;
  cursosInscritos = 0;
  cursosCompletados = 0;
  desafiosActivos = 0;
  desafiosCompletados = 0;
  publicacionesForo = 0;

  // Medallas
  medallas: any[] = [];
  medallasObtenidas = 0;

  // Estados de racha
  rachaMensaje = '';
  mostrarRachaRota = false;

  rachas = [
    { dias: 7, descripcion: '¡Una semana de actividad continua!', icono: '🔥' },
    { dias: 14, descripcion: '¡Dos semanas seguidas aprendiendo!', icono: '💪' },
    { dias: 30, descripcion: '¡Un mes completo de racha!', icono: '🏆' },
    { dias: 60, descripcion: '¡Dos meses sin fallar!', icono: '🌟' },
    { dias: 100, descripcion: '¡100 días de constancia!', icono: '🎉' },
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    console.log('Iniciando dashboard de usuario...');
    this.cargarDatosUsuario();
    this.cargarDatosDashboard();
    this.cargarMedallas();
    this.verificarNuevasMedallas();
  }

  private verificarNuevasMedallas(): void {
    // Verificar automáticamente si hay nuevas medallas
    setTimeout(() => {
      const nuevasMedallas = this.medallasService.verificarNuevasMedallas();
      if (nuevasMedallas.length > 0) {
        console.log(`🎉 Se obtuvieron ${nuevasMedallas.length} nueva(s) medalla(s)!`);
        this.medallasObtenidas = this.medallasService.obtenerEstadisticas().obtenidas;
      }
    }, 1000);
  }

  private cargarDatosUsuario(): void {
    try {
      // Cargar datos del usuario desde localStorage o servicio
      const user = this.userService.getUsuarioActual();
      this.nombreUsuario = user.nombre || 'Usuario';
      this.correoUsuario = user.email || '';
      this.ciudadUsuario = user.ciudad || '';
      this.rachaDias = user.rachaDias || 0;

      // Actualizar conexión y verificar racha
      this.userService.actualizarConexion();
      this.verificarRacha();

      console.log('Datos de usuario cargados:', {
        nombre: this.nombreUsuario,
        email: this.correoUsuario,
        racha: this.rachaDias,
      });
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      // Valores por defecto
      this.nombreUsuario = 'Usuario';
      this.rachaDias = 0;
    }
  }

  private cargarDatosDashboard(): void {
    this.cargandoDatos = true;
    this.errorCarga = '';
    console.log('Cargando datos del dashboard...');

    // Cargar datos en paralelo
    Promise.all([this.cargarCursos(), this.cargarDesafios(), this.cargarForoStats()])
      .then(() => {
        this.calcularProgreso();
        this.actualizarMedallas();
        this.cargandoDatos = false;
        console.log('Datos del dashboard cargados exitosamente');
      })
      .catch((error) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.errorCarga = 'Error al cargar algunos datos. Mostrando información disponible.';
        this.cargarDatosLocales();
        this.cargandoDatos = false;
      });
  }

  private async cargarCursos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cursosService.getTodosAPI().subscribe({
        next: (cursos) => {
          console.log('Cursos disponibles:', cursos.length);

          // Obtener cursos inscritos desde localStorage
          try {
            const cursosInscritosData = localStorage.getItem('cursosInscritos');
            this.cursosInscritos = cursosInscritosData ? JSON.parse(cursosInscritosData).length : 0;
          } catch (error) {
            this.cursosInscritos = 0;
          }

          // Simular cursos completados (basado en progreso)
          this.cursosCompletados = Math.floor(this.cursosInscritos * 0.3);

          resolve();
        },
        error: (error) => {
          console.error('Error al cargar cursos:', error);
          this.cursosInscritos = 2; // Fallback
          this.cursosCompletados = 0;
          resolve(); // No rechazar para permitir que otros datos se carguen
        },
      });
    });
  }

  private async cargarDesafios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.desafiosService.getTodosAPI().subscribe({
        next: (desafios) => {
          console.log('Desafíos disponibles:', desafios.length);

          // Simular desafíos activos y completados
          this.desafiosActivos = Math.min(desafios.length, 3);
          this.desafiosCompletados = Math.floor(this.rachaDias / 7); // 1 por semana de racha

          resolve();
        },
        error: (error) => {
          console.error('Error al cargar desafíos:', error);
          this.desafiosActivos = 3; // Fallback
          this.desafiosCompletados = 1;
          resolve();
        },
      });
    });
  }

  private async cargarForoStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.foroService.getHilosAPI().subscribe({
        next: (hilos) => {
          console.log('Hilos del foro:', hilos.length);

          // Simular participación del usuario
          this.publicacionesForo = Math.floor(this.rachaDias / 10); // 1 cada 10 días

          resolve();
        },
        error: (error) => {
          console.error('Error al cargar stats del foro:', error);
          this.publicacionesForo = 0; // Fallback
          resolve();
        },
      });
    });
  }

  private cargarDatosLocales(): void {
    // Datos por defecto cuando falla la API
    this.cursosInscritos = 2;
    this.cursosCompletados = 0;
    this.desafiosActivos = 3;
    this.desafiosCompletados = 1;
    this.publicacionesForo = 0;
    this.calcularProgreso();
    this.actualizarMedallas();
  }

  private calcularProgreso(): void {
    // Calcular progreso basado en actividades completadas
    const totalActividades = this.cursosInscritos + this.desafiosActivos;
    const actividadesCompletadas = this.cursosCompletados + this.desafiosCompletados;

    if (totalActividades > 0) {
      this.progresoCurso = Math.round((actividadesCompletadas / totalActividades) * 100);
    } else {
      this.progresoCurso = 0;
    }

    // Agregar bonus por racha
    if (this.rachaDias >= 7) {
      this.progresoCurso = Math.min(100, this.progresoCurso + Math.floor(this.rachaDias / 7) * 5);
    }

    console.log('Progreso calculado:', this.progresoCurso + '%');
  }

  private cargarMedallas(): void {
    try {
      console.log('Cargando medallas del usuario...');
      const estadoUsuario = this.medallasService.obtenerEstadoUsuario();
      this.medallas = this.medallasService.obtenerMedallas(estadoUsuario);
      this.medallasObtenidas = this.medallas.filter((m) => m.obtenida).length;

      console.log(`Medallas cargadas: ${this.medallasObtenidas}/${this.medallas.length} obtenidas`);

      // Verificar nuevas medallas
      const nuevasMedallas = this.medallasService.verificarNuevasMedallas();
      if (nuevasMedallas.length > 0) {
        console.log('🎉 ¡Nuevas medallas obtenidas!', nuevasMedallas);
      }
    } catch (error) {
      console.error('Error al cargar medallas:', error);
      this.medallas = [];
      this.medallasObtenidas = 0;
    }
  }

  private actualizarMedallas(): void {
    // Recargar medallas con el estado actualizado
    this.cargarMedallas();
  }

  private verificarRacha(): void {
    try {
      if (this.userService.rompioRacha()) {
        const dias = this.userService.rachaAnterior();
        this.rachaMensaje = `¡Perdiste una racha de ${dias} días seguidos! 😢`;
        this.mostrarRachaRota = true;

        setTimeout(() => {
          this.mostrarRachaRota = false;
        }, 5000);
      }
    } catch (error) {
      console.error('Error al verificar racha:', error);
    }
  }

  recargarDatos(): void {
    console.log('Recargando datos del dashboard...');
    this.cargarDatosDashboard();
  }

  cerrarSesion(): void {
    try {
      // Limpiar datos del usuario
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      console.log('Sesión cerrada exitosamente');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar navegación aunque haya error
      this.router.navigate(['/login']);
    }
  }

  // Métodos de utilidad para el template
  getMedallasObtenidas(): number {
    return this.medallasObtenidas;
  }

  getRachaActual(): string {
    const rachaActual = this.rachas.find((r) => this.rachaDias >= r.dias);
    return rachaActual ? rachaActual.icono : '🔥';
  }

  getProximaMeta(): number | null {
    const proximaRacha = this.rachas.find((r) => r.dias > this.rachaDias);
    return proximaRacha ? proximaRacha.dias : null;
  }

  // Método para debugging
  debugEstado(): void {
    console.log('Estado actual del dashboard:', {
      usuario: this.nombreUsuario,
      racha: this.rachaDias,
      progreso: this.progresoCurso,
      cursos: { inscritos: this.cursosInscritos, completados: this.cursosCompletados },
      desafios: { activos: this.desafiosActivos, completados: this.desafiosCompletados },
      foro: this.publicacionesForo,
      medallas: this.getMedallasObtenidas(),
      cargando: this.cargandoDatos,
      error: this.errorCarga,
    });
  }
}
