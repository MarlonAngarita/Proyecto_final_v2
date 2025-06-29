import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModulosService, Modulo } from '../../../services/modulos.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz = {
    pregunta: '',
    opcion_a: '',
    opcion_b: '',
    opcion_c: '',
    opcion_d: '',
    respuesta_correcta: '',
    id_modulo: ''
  };

  modulos: Modulo[] = [];

  constructor(
    private modulosService: ModulosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('quiz-bg');
    }

    const idCurso = 1; // Puedes reemplazar esto con lógica dinámica
    this.modulosService.getModulosPorCurso(idCurso).subscribe({
      next: (data) => {
        this.modulos = data;
      },
      error: (err) => {
        console.error('Error al cargar módulos:', err);
      }
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
}

export { QuizComponent as Quiz };
