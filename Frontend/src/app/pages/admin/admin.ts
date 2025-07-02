// ===================================================================================================
// COMPONENTE DE ADMINISTRACIÓN - SISTEMA KÜTSA
// ===================================================================================================

import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

/**
 * Componente de Administración para la plataforma Kütsa
 *
 * Funcionalidades principales:
 * - Gestión completa de usuarios del sistema
 * - Panel de estadísticas y analytics
 * - Creación, edición y eliminación de usuarios
 * - Filtrado y búsqueda de usuarios
 * - Gestión de roles y permisos
 * - Dashboards administrativos
 * - Manejo de modales y estados de UI
 *
 * Tabs disponibles:
 * - Usuarios: CRUD completo de usuarios
 * - Estadísticas: Analytics y métricas del sistema
 *
 * @author Sistema Kütsa
 * @version 2.0 - Panel de administración completo
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  private platformId = inject<Object>(PLATFORM_ID);
  private userService = inject(UserService);
  private http = inject(HttpClient);

  // ===================================================================================================
  // PROPIEDADES DE NAVEGACIÓN Y UI
  // ===================================================================================================

  /** Tab actualmente seleccionado en el panel */
  selectedTab: 'usuarios' | 'estadisticas' = 'usuarios';

  // ===================================================================================================
  // PROPIEDADES DE GESTIÓN DE USUARIOS
  // ===================================================================================================

  /** Lista completa de usuarios del sistema */
  usuarios: any[] = [];
  /** Texto de filtro para búsqueda de usuarios */
  filtro: string = '';
  /** Filtro por rol específico */
  rolFiltro: string = '';
  /** Usuario seleccionado para operaciones */
  usuarioSeleccionado: any = null;
  /** Flag para mostrar el modal de creación */
  mostrarModalCrear = false;
  /** Objeto para datos del nuevo usuario */
  nuevoUsuario: any = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    id_rol: '',
    id_tipo_documento: '',
    id_avatar: '',
    is_active: true,
  };
  /** Lista de avatares disponibles */
  avatares: any[] = [];
  /** Lista de roles del sistema */
  roles: any[] = [];
  /** Lista de tipos de documento */
  tiposDocumento: any[] = [];

  // ===================================================================================================
  // PROPIEDADES DE ESTADÍSTICAS
  // ===================================================================================================

  /** Número total de usuarios registrados */
  totalUsuarios: number = 0;
  /** Usuarios activos en el día actual */
  usuariosActivosHoy: number = 0;
  /** Usuarios activos en la semana */
  usuariosActivosSemana: number = 0;
  /** Datos de crecimiento de usuarios */
  crecimientoUsuarios: any[] = [];
  /** Actividad por períodos */
  actividadPorPeriodo: any[] = [];
  /** Tasa de retención de usuarios */
  tasaRetencion: number = 0;
  /** Estadísticas de dispositivos */
  dispositivos: any[] = [];
  /** Estadísticas de ubicaciones */
  ubicaciones: any[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  // ===================================================================================================
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ===================================================================================================

  /**
   * Constructor del componente de administración
   *
   * @param platformId - ID de la plataforma para verificar SSR
   */
  constructor() {}

  // ===================================================================================================
  // MÉTODOS DEL CICLO DE VIDA
  // ===================================================================================================

  /**
   * Inicialización del componente
   * Configura estados iniciales y carga datos necesarios
   */
  ngOnInit() {
    // Desactiva scroll si el modal está abierto al recargar
    if (isPlatformBrowser(this.platformId) && this.mostrarModalCrear) {
      document.body.classList.add('modal-open');
    }
    // Configurar estado inicial de la UI (manejo de modales y scroll)
    if (isPlatformBrowser(this.platformId) && this.mostrarModalCrear) {
      document.body.classList.add('modal-open');
    }
    this.cargarUsuarios();
    this.cargarEstadisticas();
  }

  /**
   * Limpieza del componente al destruirse
   * Remueve listeners y clases de CSS para evitar efectos residuales
   */
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  // ===================================================================================================
  // MÉTODOS DE NAVEGACIÓN ENTRE TABS
  // ===================================================================================================

  /**
   * Cambia entre los tabs del panel de administración
   *
   * @param tab - Tab a seleccionar ('usuarios' | 'estadisticas')
   */
  seleccionarTab(tab: 'usuarios' | 'estadisticas') {
    this.selectedTab = tab;
  }

  // ===================================================================================================
  // MÉTODOS DE GESTIÓN DE USUARIOS
  // ===================================================================================================

  /**
   * Carga la lista de usuarios desde el servicio
   */
  cargarUsuarios() {
    this.userService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.totalUsuarios = usuarios.length;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.usuarios = [];
      },
    });
  }

  /**
   * Carga las estadísticas generales desde el servicio
   */
  cargarEstadisticas() {
    this.userService.getEstadisticas().subscribe({
      next: (data) => {
        // Ajustar según la estructura de respuesta del backend
        if (data && data.tipo === 'estadisticas_globales') {
          this.usuariosActivosHoy = data.datos.total_usuarios_con_racha || 0;
          // Puedes mapear más estadísticas aquí
        }
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
      },
    });
  }

  /**
   * Busca usuarios según el filtro ingresado
   * TODO: Implementar búsqueda en la API
   */
  buscarUsuarios() {
    // Búsqueda local, para búsqueda en backend, implementar filtro en la API
    if (!this.filtro) {
      this.cargarUsuarios();
      return;
    }
    this.usuarios = this.usuarios.filter(
      (u) =>
        u.nombre?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        u.username?.toLowerCase().includes(this.filtro.toLowerCase()),
    );
  }

  /**
   * Filtra usuarios por rol específico
   *
   * @param rol - Rol por el cual filtrar
   */
  filtrarPorRol(rol: string) {
    this.rolFiltro = rol;
    if (!rol) {
      this.cargarUsuarios();
      return;
    }
    this.usuarios = this.usuarios.filter((u) =>
      u.rol_info?.toLowerCase().includes(rol.toLowerCase()),
    );
  }

  /**
   * Abre el modal para crear un nuevo usuario
   * Gestiona el estado del scroll de la página
   */
  crearUsuario() {
    this.mostrarModalCrear = true;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.classList.add('modal-open');
      }, 0);
    }
  }

  /**
   * Cierra el modal de creación de usuario
   * Resetea el formulario y el estado del scroll
   */
  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.body.classList.remove('modal-open');
      }, 0);
    }
    // Resetear datos del formulario
    this.nuevoUsuario = {
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      id_rol: '',
      id_tipo_documento: '',
      id_avatar: '',
      is_active: true,
    };
  }

  /**
   * Guarda el nuevo usuario en el sistema
   * TODO: Implementar llamada a la API
   */
  guardarNuevoUsuario() {
    this.userService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (usuario) => {
        this.cargarUsuarios();
        this.cerrarModalCrear();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert('Error al crear usuario');
      },
    });
  }

  /**
   * Edita un usuario existente
   *
   * @param usuario - Usuario a editar
   */
  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = usuario;
    // Aquí podrías abrir un modal de edición y luego llamar a editarUsuarioAPI
  }

  editarUsuarioAPI(usuario: any) {
    this.userService.editarUsuario(usuario.id, usuario).subscribe({
      next: (u) => {
        this.cargarUsuarios();
        this.usuarioSeleccionado = null;
      },
      error: (err) => {
        console.error('Error al editar usuario:', err);
        alert('Error al editar usuario');
      },
    });
  }

  /**
   * Elimina un usuario del sistema
   *
   * @param usuario - Usuario a eliminar
   */
  eliminarUsuario(usuario: any) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.eliminarUsuario(usuario.id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar usuario');
        },
      });
    }
  }

  /**
   * Suspende temporalmente un usuario
   *
   * @param usuario - Usuario a suspender
   */
  suspenderUsuario(usuario: any) {
    // TODO: Implementar lógica de suspensión
    console.log('Suspendiendo usuario:', usuario);
  }

  /**
   * Restablece la contraseña de un usuario
   *
   * @param usuario - Usuario al que restablecer contraseña
   */
  restablecerPassword(usuario: any) {
    // TODO: Implementar lógica de restablecimiento
    console.log('Restableciendo contraseña para:', usuario);
  }

  /**
   * Muestra el historial de actividad de un usuario
   *
   * @param usuario - Usuario del que ver historial
   */
  verHistorial(usuario: any) {
    // TODO: Implementar modal de historial
    console.log('Viendo historial de:', usuario);
  }
}
