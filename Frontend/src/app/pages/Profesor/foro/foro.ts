import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService } from '../../../services/foro.service';

@Component({
  selector: 'app-foro-profesores',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class Foro implements OnInit {
  tituloPost: string = '';
  contenidoPost: string = '';
  cargando = false;
  currentUser: any = null;
  
  publicaciones: { autor: string; tiempo: string; titulo: string; contenido: string; imagen: string; id?: any; id_usuario?: number }[] = [
    {
      autor: 'Usuario 1',
      tiempo: 'Hace 5 min',
      titulo: '¡Bienvenidos!',
      contenido: 'Este foro es increíble, ¿qué opinan?',
      imagen:
        'https://img.freepik.com/vector-premium/entrenador-fitness-imagen-vectorial-icono-femenino-puede-usar-profesiones_120816-263153.jpg?w=740',
    },
  ];

  constructor(
    private router: Router,
    private foroService: ForoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Obtener usuario actual
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.cargando = true;
    console.log('Cargando publicaciones del foro...');

    this.foroService.getHilosAPI().subscribe({
      next: (hilos) => {
        console.log('Hilos recibidos de la API:', hilos);
        
        // Mapear los datos de la API al formato del componente
        this.publicaciones = hilos.map(hilo => ({
          id: hilo.id || hilo.id_foro,
          autor: hilo.nombre_usuario || hilo.autor || 'Usuario',
          tiempo: this.calcularTiempo(hilo.fecha_publicacion),
          titulo: hilo.titulo,
          contenido: hilo.contenido,
          fecha_publicacion: hilo.fecha_publicacion,
          id_usuario: hilo.id_usuario,
          imagen: this.getImagenUsuario(hilo.id_usuario)
        }));
        
        console.log('Publicaciones procesadas:', this.publicaciones);
        this.cargando = false;
        
        if (this.cdr) {
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar hilos desde API, usando datos locales:', error);
        
        // Fallback a datos locales
        const hilosLocales = this.foroService.getHilos();
        this.publicaciones = hilosLocales.map(hilo => ({
          id: hilo.id,
          autor: hilo.autor,
          tiempo: 'Hace 5 min',
          titulo: hilo.titulo,
          contenido: hilo.mensaje || 'Contenido del hilo',
          imagen: this.getImagenUsuario(1)
        }));
        
        this.cargando = false;
      }
    });
  }

  publicarPost() {
    if (this.tituloPost.trim() && this.contenidoPost.trim()) {
      this.cargando = true;
      
      const nuevoHilo = {
        titulo: this.tituloPost,
        contenido: this.contenidoPost
      };

      console.log('Creando nueva publicación:', nuevoHilo);

      this.foroService.agregarHiloAPI(nuevoHilo).subscribe({
        next: (response) => {
          console.log('Hilo creado exitosamente en API:', response);
          
          // Limpiar formulario
          this.tituloPost = '';
          this.contenidoPost = '';
          
          // Recargar publicaciones
          this.cargarPublicaciones();
        },
        error: (error) => {
          console.error('Error al crear hilo en API, usando método local:', error);
          
          // Fallback al método local
          const publicacionLocal = {
            autor: this.currentUser?.nombre || 'Profesor',
            tiempo: 'Hace un momento',
            titulo: this.tituloPost,
            contenido: this.contenidoPost,
            imagen: this.getImagenUsuario(this.currentUser?.id || 1)
          };
          
          this.publicaciones.unshift(publicacionLocal);
          this.foroService.agregarHilo(nuevoHilo);
          
          // Limpiar formulario
          this.tituloPost = '';
          this.contenidoPost = '';
          this.cargando = false;
        }
      });
    } else {
      alert('Por favor completa el título y contenido del post');
    }
  }

  eliminarPost(index: number) {
    const publicacion = this.publicaciones[index];
    
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      const publicacionId = publicacion.id;
      
      if (publicacionId) {
        // Eliminar desde la API
        this.foroService.eliminarHiloAPI(publicacionId).subscribe({
          next: () => {
            console.log('Publicación eliminada exitosamente');
            this.cargarPublicaciones(); // Recargar la lista
          },
          error: (error) => {
            console.error('Error al eliminar desde API, usando método local:', error);
            // Fallback al método local
            this.publicaciones.splice(index, 1);
            this.foroService.eliminarHilo(publicacionId);
          }
        });
      } else {
        // Eliminar solo localmente (datos de respaldo)
        this.publicaciones.splice(index, 1);
      }
    }
  }

  // Métodos auxiliares
  private calcularTiempo(fechaPublicacion: string): string {
    if (!fechaPublicacion) return 'Hace un momento';
    
    const fecha = new Date(fechaPublicacion);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas} h`;
    } else {
      return `Hace ${dias} días`;
    }
  }

  private getImagenUsuario(idUsuario: number): string {
    // Generar imagen basada en el ID del usuario
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${idUsuario}`;
  }

  volverAlDashboard() {
    this.router.navigate(['/profesor/dashboard-profesor']);
  }
}
