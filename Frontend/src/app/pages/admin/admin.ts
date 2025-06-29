import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  // Variables para tabs
  selectedTab: 'usuarios' | 'estadisticas' = 'usuarios';

  // Variables para gestión de usuarios
  usuarios: any[] = [];
  filtro: string = '';
  rolFiltro: string = '';
  usuarioSeleccionado: any = null;
  mostrarModalCrear = false;
  nuevoUsuario: any = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    id_rol: '',
    id_tipo_documento: '',
    id_avatar: '',
    is_active: true
  };
  avatares: any[] = [];
  roles: any[] = [];
  tiposDocumento: any[] = [];

  // Variables para estadísticas
  totalUsuarios: number = 0;
  usuariosActivosHoy: number = 0;
  usuariosActivosSemana: number = 0;
  crecimientoUsuarios: any[] = [];
  actividadPorPeriodo: any[] = [];
  tasaRetencion: number = 0;
  dispositivos: any[] = [];
  ubicaciones: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Desactiva scroll si el modal está abierto al recargar
    if (isPlatformBrowser(this.platformId) && this.mostrarModalCrear) {
      document.body.classList.add('modal-open');
    }
    // Aquí irán las llamadas a los servicios para cargar usuarios y estadísticas
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  seleccionarTab(tab: 'usuarios' | 'estadisticas') {
    this.selectedTab = tab;
  }

  buscarUsuarios() {
    // Lógica para buscar usuarios
  }

  filtrarPorRol(rol: string) {
    // Lógica para filtrar usuarios por rol
  }

  crearUsuario() {
    this.mostrarModalCrear = true;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.classList.add('modal-open');
      }, 0);
    }
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.classList.remove('modal-open');
      }, 0);
    }
    this.nuevoUsuario = {
      username: '', password: '', first_name: '', last_name: '', email: '', id_rol: '', id_tipo_documento: '', id_avatar: '', is_active: true
    };
  }

  guardarNuevoUsuario() {
    // Aquí va la lógica para guardar el usuario (llamada a API)
    this.cerrarModalCrear();
  }

  editarUsuario(usuario: any) {
    // Lógica para editar usuario
  }

  eliminarUsuario(usuario: any) {
    // Lógica para eliminar usuario
  }

  suspenderUsuario(usuario: any) {
    // Lógica para suspender usuario
  }

  restablecerPassword(usuario: any) {
    // Lógica para restablecer contraseña
  }

  verHistorial(usuario: any) {
    // Lógica para ver historial de usuario
  }
}
