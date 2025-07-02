import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModulosService, Modulo } from '../../../services/modulos.service';
import { QuizService, Quiz } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css'],
})
export class QuizComponent implements OnInit, OnDestroy {
  private modulosService = inject(ModulosService);
  private quizService = inject(QuizService);
  private platformId = inject<Object>(PLATFORM_ID);

  // Estados de carga
  cargando = false;
  cargandoQuizzes = false;
  cargandoModulos = false;
  errorCarga = '';

  // Formulario de quiz
  quiz: Quiz = {
    pregunta: '',
    opcion_a: '',
    opcion_b: '',
    opcion_c: '',
    opcion_d: '',
    respuesta_correcta: 'A',
    id_modulo: 0,
  };

  // Datos
  modulos: Modulo[] = [];
  quizzes: Quiz[] = [];

  // Quiz en edición
  quizEditando: Quiz | null = null;
  quizEliminar: Quiz | null = null;
  mensajeConfirmacion = '';

  // Estados de operaciones
  guardando = false;
  eliminando = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('quiz-bg');
    }

    console.log('🔄 Iniciando componente de quiz...');
    this.cargarModulos();
    this.cargarQuizzes();
  }

  // Cargar módulos disponibles
  private cargarModulos(): void {
    console.log('🔄 Cargando módulos...');
    this.cargandoModulos = true;

    const idCurso = 1; // Puedes reemplazar esto con lógica dinámica
    this.modulosService.getModulosPorCurso(idCurso).subscribe({
      next: (data) => {
        console.log('✅ Módulos cargados:', data);
        this.modulos = data || [];
        this.cargandoModulos = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar módulos:', err);
        this.cargandoModulos = false;
        // Fallback a datos locales si existe
        this.modulos = [];
      },
    });
  }

  // Cargar todos los quizzes
  private cargarQuizzes(): void {
    console.log('🔄 Cargando quizzes...');
    this.cargandoQuizzes = true;
    this.errorCarga = '';

    this.quizService.getTodosAPI().subscribe({
      next: (quizzes) => {
        console.log('✅ Quizzes obtenidos desde API:', quizzes);
        this.quizzes = quizzes || [];
        this.cargandoQuizzes = false;

        // Fallback a datos locales si la API no devuelve datos
        if (this.quizzes.length === 0) {
          console.log('⚠️ API no devolvió quizzes, usando datos locales');
          this.quizzes = this.quizService.getTodos() || [];
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar quizzes desde API:', error);
        this.errorCarga = 'Error al cargar quizzes desde la API';
        this.cargandoQuizzes = false;

        // Fallback a datos locales en caso de error
        console.log('🔄 Cargando datos locales como fallback...');
        this.quizzes = this.quizService.getTodos() || [];
      },
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('quiz-bg');
    }
  }

  guardarQuiz(): void {
    if (!this.quiz.pregunta || !this.quiz.respuesta_correcta || !this.quiz.id_modulo) {
      console.warn('Faltan campos obligatorios');
      return;
    }

    console.log('Quiz a guardar:', this.quiz);
    // Aquí puedes llamar a un servicio para guardar el quiz
  }

  // Crear un nuevo quiz usando la API
  crearQuiz(): void {
    if (!this.validarFormulario()) {
      return;
    }

    console.log('🔄 Creando quiz...', this.quiz);
    this.guardando = true;

    this.quizService.agregarAPI(this.quiz).subscribe({
      next: (response) => {
        console.log('✅ Quiz creado exitosamente:', response);

        if (response) {
          this.limpiarFormulario();
          this.cargarQuizzes(); // Recargar lista
          this.guardando = false;
          this.mensajeConfirmacion = 'Quiz creado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          this.quizService.agregar(this.quiz);
          this.quizzes = this.quizService.getTodos();
          this.limpiarFormulario();
          this.guardando = false;
          this.mensajeConfirmacion = 'Quiz creado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al crear quiz:', error);

        // Fallback a método local
        this.quizService.agregar(this.quiz);
        this.quizzes = this.quizService.getTodos();
        this.limpiarFormulario();
        this.guardando = false;
        this.mensajeConfirmacion = 'Quiz creado (modo local)';
      },
    });
  }

  // Validar formulario
  private validarFormulario(): boolean {
    if (
      !this.quiz.pregunta.trim() ||
      !this.quiz.opcion_a.trim() ||
      !this.quiz.opcion_b.trim() ||
      !this.quiz.opcion_c.trim() ||
      !this.quiz.opcion_d.trim() ||
      !this.quiz.respuesta_correcta ||
      !this.quiz.id_modulo
    ) {
      this.mensajeConfirmacion = 'Por favor completa todos los campos obligatorios';
      return false;
    }
    return true;
  }

  // Limpiar formulario
  private limpiarFormulario(): void {
    this.quiz = {
      pregunta: '',
      opcion_a: '',
      opcion_b: '',
      opcion_c: '',
      opcion_d: '',
      respuesta_correcta: 'A',
      id_modulo: 0,
    };
  }

  // Editar quiz
  editarQuiz(quiz: Quiz): void {
    this.quizEditando = { ...quiz };
  }

  // Guardar edición de quiz
  guardarEdicion(): void {
    if (!this.quizEditando || !this.quizEditando.id) {
      this.mensajeConfirmacion = 'Error: No se puede actualizar el quiz';
      return;
    }

    console.log('🔄 Actualizando quiz...', this.quizEditando);
    this.guardando = true;

    this.quizService.actualizarAPI(this.quizEditando.id, this.quizEditando).subscribe({
      next: (response) => {
        console.log('✅ Quiz actualizado:', response);

        if (response) {
          this.cargarQuizzes(); // Recargar lista
          this.quizEditando = null;
          this.guardando = false;
          this.mensajeConfirmacion = 'Quiz actualizado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          if (this.quizEditando) {
            this.quizService.actualizar(this.quizEditando);
          }
          this.quizzes = this.quizService.getTodos();
          this.quizEditando = null;
          this.guardando = false;
          this.mensajeConfirmacion = 'Quiz actualizado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al actualizar quiz:', error);
        this.guardando = false;
        this.mensajeConfirmacion = 'Error al actualizar el quiz';
      },
    });
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.quizEditando = null;
  }

  // Eliminar quiz
  eliminarQuiz(quiz: Quiz): void {
    this.quizEliminar = quiz;
  }

  // Confirmar eliminación
  confirmarEliminar(): void {
    if (!this.quizEliminar || !this.quizEliminar.id) {
      this.mensajeConfirmacion = 'Error: No se puede eliminar el quiz';
      return;
    }

    console.log('🔄 Eliminando quiz...', this.quizEliminar.id);
    this.eliminando = true;

    this.quizService.eliminarAPI(this.quizEliminar.id).subscribe({
      next: (eliminado) => {
        console.log('✅ Resultado eliminación:', eliminado);

        if (eliminado) {
          this.cargarQuizzes(); // Recargar lista
          this.quizEliminar = null;
          this.eliminando = false;
          this.mensajeConfirmacion = 'Quiz eliminado exitosamente';
        } else {
          // Fallback a método local
          console.log('⚠️ API falló, usando método local');
          if (this.quizEliminar?.id) {
            this.quizService.eliminar(this.quizEliminar.id);
          }
          this.quizzes = this.quizService.getTodos();
          this.quizEliminar = null;
          this.eliminando = false;
          this.mensajeConfirmacion = 'Quiz eliminado localmente';
        }
      },
      error: (error) => {
        console.error('❌ Error al eliminar quiz:', error);
        this.eliminando = false;
        this.mensajeConfirmacion = 'Error al eliminar el quiz';
      },
    });
  }

  // Cancelar eliminación
  cancelarEliminar(): void {
    this.quizEliminar = null;
  }

  // Cerrar confirmación
  cerrarConfirmacion(): void {
    this.mensajeConfirmacion = '';
  }

  // Obtener nombre del módulo
  getNombreModulo(idModulo: number): string {
    const modulo = this.modulos.find((m) => m.id_modulo === idModulo);
    return modulo ? modulo.nombre_modulo : 'Módulo no encontrado';
  }

  // Volver al dashboard
  volverAlDashboard(): void {
    window.location.href = '/profesor/dashboard-profesor';
  }
}

export { QuizComponent as Quiz };
