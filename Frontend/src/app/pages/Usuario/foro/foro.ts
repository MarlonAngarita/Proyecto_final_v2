import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService, Hilo } from '../../../services/foro.service';

@Component({
  selector: 'app-foro',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css'
})
export class ForoUsuario implements OnInit {
  // Estados de carga
  cargando = false;
  cargandoHilos = false;
  errorCarga = '';
  
  // Datos del formulario
  tituloPost: string = '';
  contenidoPost: string = '';
  
  // Lista de hilos
  publicaciones: Hilo[] = [];

  constructor(
    private router: Router,
    private foroService: ForoService
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando componente de foro...');
    this.cargarHilos();
  }

  // Cargar hilos desde la API
  private cargarHilos(): void {
    console.log('🔄 Cargando hilos del foro...');
    this.cargandoHilos = true;
    this.errorCarga = '';
    
    this.foroService.getHilosAPI().subscribe({
      next: (hilos) => {
        console.log('✅ Hilos obtenidos desde API:', hilos);
        this.publicaciones = hilos || [];
        this.cargandoHilos = false;
        
        // Fallback a datos locales si la API no devuelve datos
        if (this.publicaciones.length === 0) {
          console.log('⚠️ API no devolvió hilos, usando datos locales');
          this.publicaciones = this.foroService.getHilos() || [];
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar hilos desde API:', error);
        this.errorCarga = 'Error al cargar hilos desde la API';
        this.cargandoHilos = false;
        
        // Fallback a datos locales en caso de error
        console.log('🔄 Cargando datos locales como fallback...');
        this.publicaciones = this.foroService.getHilos() || [];
      }
    });
  }

  publicarPost(): void {
    if (!this.validarFormulario()) {
      return;
    }

    console.log('🔄 Creando nuevo hilo...');
    this.cargando = true;

    const nuevoHilo: Hilo = {
      titulo: this.tituloPost,
      contenido: this.contenidoPost,
      autor: 'Usuario'
    };

    this.foroService.agregarHiloAPI(nuevoHilo).subscribe({
      next: (response) => {
        console.log('✅ Hilo creado exitosamente:', response);
        
        if (response) {
          // Limpiar formulario
          this.limpiarFormulario();
          
          // Recargar hilos
          this.cargarHilos();
          
          this.cargando = false;
          alert('Publicación creada exitosamente');
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          this.foroService.agregarHilo(nuevoHilo);
          this.publicaciones = this.foroService.getHilos() || [];
          this.limpiarFormulario();
          
          this.cargando = false;
          alert('Publicación creada (modo local)');
        }
      },
      error: (error) => {
        console.error('❌ Error al crear hilo:', error);
        
        // Fallback a método local
        console.log('🔄 Usando método local como fallback...');
        this.foroService.agregarHilo(nuevoHilo);
        this.publicaciones = this.foroService.getHilos() || [];
        this.limpiarFormulario();
        
        this.cargando = false;
        alert('Publicación creada (modo local)');
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.tituloPost.trim() || !this.contenidoPost.trim()) {
      alert('Por favor completa el título y contenido de tu publicación');
      return false;
    }
    return true;
  }

  private limpiarFormulario(): void {
    this.tituloPost = '';
    this.contenidoPost = '';
  }

  eliminarPost(publicacion: Hilo, index: number): void {
    if (!publicacion.id) {
      // Eliminar localmente si no tiene ID de API
      this.publicaciones.splice(index, 1);
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      console.log('🔄 Eliminando hilo...', publicacion.id);
      
      this.foroService.eliminarHiloAPI(publicacion.id).subscribe({
        next: (eliminado) => {
          console.log('✅ Resultado eliminación:', eliminado);
          
          if (eliminado) {
            this.publicaciones.splice(index, 1);
            alert('Publicación eliminada exitosamente');
          } else {
            // Fallback a eliminación local
            console.log('⚠️ API falló, usando método local');
            this.publicaciones.splice(index, 1);
            alert('Publicación eliminada (modo local)');
          }
        },
        error: (error) => {
          console.error('❌ Error al eliminar hilo:', error);
          // Fallback a eliminación local
          this.publicaciones.splice(index, 1);
          alert('Publicación eliminada (modo local)');
        }
      });
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/usuario/dashboard-usuario']);
  }

  // Método de utilidad para obtener tiempo relativo
  getTiempoRelativo(fecha?: string): string {
    if (!fecha) return 'Hace un momento';
    
    const ahora = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferencia = ahora.getTime() - fechaPublicacion.getTime();
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${dias} días`;
  }
}
