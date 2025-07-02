import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesafiosService, Desafio } from '../../../services/desafios.service'; // Ruta relativa

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desafios.html',
  styleUrls: ['./desafios.css'],
})
export class Desafios {
  // Lista de desafíos cargada desde el servicio
  desafios: Desafio[] = [];
  cargandoDesafios = false;
  errorCarga = '';

  // Objeto base para crear un nuevo desafío
  nuevoDesafio: Desafio = {
    nombre_desafio: '',
    descripcion: '',
    recompensa: 0,
    dificultad: 'facil',
    activo: true,
  };

  // Referencia al desafío en edición
  desafioEditando: Desafio | null = null;

  // Referencia al desafío que se desea eliminar
  desafioEliminar: Desafio | null = null;

  // Mensaje que se muestra en el submodal de confirmación
  mensajeConfirmacion = '';

  // Estado de operaciones
  guardando = false;
  eliminando = false;

  // Inyección del servicio de desafíos
  constructor(private desafiosService: DesafiosService) {}

  // Al iniciar el componente se cargan los desafíos desde el servicio
  ngOnInit(): void {
    this.cargarDesafios();
  }

  // Cargar desafíos desde la API
  cargarDesafios(): void {
    console.log('🔄 Cargando desafíos...');
    this.cargandoDesafios = true;
    this.errorCarga = '';

    this.desafiosService.getTodosAPI().subscribe({
      next: (desafios) => {
        console.log('✅ Desafíos cargados desde API:', desafios);
        this.desafios = desafios || [];
        this.cargandoDesafios = false;

        // Fallback a datos locales si la API no devuelve datos
        if (this.desafios.length === 0) {
          console.log('⚠️ API no devolvió desafíos, usando datos locales');
          this.desafios = this.desafiosService.getTodos() || [];
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar desafíos desde API:', error);
        this.errorCarga = 'Error al cargar desafíos desde la API';
        this.cargandoDesafios = false;

        // Fallback a datos locales en caso de error
        console.log('🔄 Cargando datos locales como fallback...');
        this.desafios = this.desafiosService.getTodos() || [];
      },
    });
  }

  // Crea un nuevo desafío usando la API
  crearDesafio(): void {
    if (!this.nuevoDesafio.nombre_desafio || !this.nuevoDesafio.descripcion) {
      this.mensajeConfirmacion = 'Por favor completa todos los campos obligatorios';
      return;
    }

    console.log('🔄 Creando desafío...', this.nuevoDesafio);
    this.guardando = true;

    this.desafiosService.agregarAPI(this.nuevoDesafio).subscribe({
      next: (desafioCreado) => {
        console.log('✅ Desafío creado:', desafioCreado);
        this.guardando = false;

        if (desafioCreado) {
          this.cargarDesafios(); // Recargar lista
          this.nuevoDesafio = {
            nombre_desafio: '',
            descripcion: '',
            recompensa: 0,
            dificultad: 'facil',
            activo: true,
          };
          this.mensajeConfirmacion = 'Desafío creado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          this.desafiosService.agregar({
            titulo: this.nuevoDesafio.nombre_desafio,
            descripcion: this.nuevoDesafio.descripcion,
            nivel: this.nuevoDesafio.dificultad,
            activo: this.nuevoDesafio.activo,
          });
          this.desafios = this.desafiosService.getTodos();
          this.mensajeConfirmacion = 'Desafío creado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al crear desafío:', error);
        this.guardando = false;
        this.mensajeConfirmacion = 'Error al crear el desafío';
      },
    });
  }

  // Abre el modal de edición con una copia del desafío seleccionado
  editarDesafio(desafio: Desafio): void {
    this.desafioEditando = { ...desafio };
  }

  // Guarda los cambios del desafío editado usando la API
  guardarEdicion(): void {
    if (!this.desafioEditando || !this.desafioEditando.id) {
      this.mensajeConfirmacion = 'Error: No se puede actualizar el desafío';
      return;
    }

    console.log('🔄 Actualizando desafío...', this.desafioEditando);
    this.guardando = true;

    this.desafiosService.actualizarAPI(this.desafioEditando.id, this.desafioEditando).subscribe({
      next: (desafioActualizado) => {
        console.log('✅ Desafío actualizado:', desafioActualizado);
        this.guardando = false;

        if (desafioActualizado) {
          this.cargarDesafios(); // Recargar lista
          this.desafioEditando = null;
          this.mensajeConfirmacion = 'Desafío actualizado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          this.desafiosService.actualizar(this.desafioEditando);
          this.desafios = this.desafiosService.getTodos();
          this.desafioEditando = null;
          this.mensajeConfirmacion = 'Desafío actualizado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al actualizar desafío:', error);
        this.guardando = false;
        this.mensajeConfirmacion = 'Error al actualizar el desafío';
      },
    });
  }

  // Cancela la edición y cierra el modal
  cancelarEdicion(): void {
    this.desafioEditando = null;
  }

  // Abre el modal de confirmación para eliminar un desafío
  eliminarDesafio(desafio: Desafio): void {
    this.desafioEliminar = desafio;
  }

  // Confirma y ejecuta la eliminación del desafío usando la API
  confirmarEliminar(): void {
    if (!this.desafioEliminar || !this.desafioEliminar.id) {
      this.mensajeConfirmacion = 'Error: No se puede eliminar el desafío';
      return;
    }

    console.log('🔄 Eliminando desafío...', this.desafioEliminar.id);
    this.eliminando = true;

    this.desafiosService.eliminarAPI(this.desafioEliminar.id).subscribe({
      next: (eliminado) => {
        console.log('✅ Resultado eliminación:', eliminado);
        this.eliminando = false;

        if (eliminado) {
          this.cargarDesafios(); // Recargar lista
          this.desafioEliminar = null;
          this.mensajeConfirmacion = 'Desafío eliminado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          if (this.desafioEliminar?.id) {
            this.desafiosService.eliminar(this.desafioEliminar.id);
          }
          this.desafios = this.desafiosService.getTodos();
          this.desafioEliminar = null;
          this.mensajeConfirmacion = 'Desafío eliminado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al eliminar desafío:', error);
        this.eliminando = false;
        this.mensajeConfirmacion = 'Error al eliminar el desafío';
      },
    });
  }

  // Cancela la eliminación y cierra el modal
  cancelarEliminar(): void {
    this.desafioEliminar = null;
  }

  // Cierra el submodal de confirmación y limpia estados
  cerrarConfirmacion(): void {
    this.mensajeConfirmacion = '';
    this.desafioEditando = null;
    this.desafioEliminar = null;
  }

  volverAlDashboard(): void {
    // Redirige al dashboard del profesor
    window.location.href = '/profesor/dashboard-profesor';
  }
}
