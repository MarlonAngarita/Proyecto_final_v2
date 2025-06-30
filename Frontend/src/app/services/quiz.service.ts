import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Quiz {
  id?: number;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  respuesta_correcta: 'A' | 'B' | 'C' | 'D';
  id_modulo: number;
  fecha_creacion?: string;
  id_profesor?: number;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/quiz/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
    })
  };

  // Datos locales para fallback
  private quizzes: Quiz[] = [
    {
      id: 1,
      pregunta: '¿Qué significa HTML?',
      opcion_a: 'Hyper Text Markup Language',
      opcion_b: 'High Tech Modern Language',
      opcion_c: 'Home Tool Markup Language',
      opcion_d: 'Hyperlink and Text Markup Language',
      respuesta_correcta: 'A',
      id_modulo: 1,
      fecha_creacion: '2024-01-15'
    },
    {
      id: 2,
      pregunta: '¿Cuál es la función principal de CSS?',
      opcion_a: 'Crear bases de datos',
      opcion_b: 'Estilizar páginas web',
      opcion_c: 'Programar lógica',
      opcion_d: 'Gestionar servidores',
      respuesta_correcta: 'B',
      id_modulo: 1,
      fecha_creacion: '2024-01-16'
    }
  ];

  constructor(private http: HttpClient) {}

  // Métodos para la API REST
  private updateHttpOptions(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  private getCurrentProfesorId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 1;
    } catch (error) {
      console.error('Error obteniendo ID de profesor:', error);
      return 1;
    }
  }

  // Métodos API
  getTodosAPI(): Observable<Quiz[]> {
    this.updateHttpOptions();
    return this.http.get<Quiz[]>(this.apiUrl, this.httpOptions)
      .pipe(
        tap(quizzes => console.log('Quizzes obtenidos desde API:', quizzes)),
        catchError(this.handleError<Quiz[]>('getTodosAPI', []))
      );
  }

  obtenerPorIdAPI(id: number): Observable<Quiz | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Quiz>(url, this.httpOptions)
      .pipe(
        tap(quiz => console.log('Quiz obtenido por ID desde API:', quiz)),
        catchError(this.handleError<Quiz | null>('obtenerPorIdAPI', null))
      );
  }

  obtenerPorModuloAPI(idModulo: number): Observable<Quiz[]> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}?id_modulo=${idModulo}`;
    return this.http.get<Quiz[]>(url, this.httpOptions)
      .pipe(
        tap(quizzes => console.log('Quizzes obtenidos por módulo desde API:', quizzes)),
        catchError(this.handleError<Quiz[]>('obtenerPorModuloAPI', []))
      );
  }

  agregarAPI(quiz: Quiz): Observable<Quiz | null> {
    this.updateHttpOptions();
    const quizData = {
      ...quiz,
      fecha_creacion: new Date().toISOString().split('T')[0],
      id_profesor: this.getCurrentProfesorId()
    };

    return this.http.post<Quiz>(this.apiUrl, quizData, this.httpOptions)
      .pipe(
        tap(nuevoQuiz => console.log('Quiz agregado via API:', nuevoQuiz)),
        catchError(this.handleError<Quiz | null>('agregarAPI', null))
      );
  }

  actualizarAPI(id: number, quiz: Quiz): Observable<Quiz | null> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<Quiz>(url, quiz, this.httpOptions)
      .pipe(
        tap(quizActualizado => console.log('Quiz actualizado via API:', quizActualizado)),
        catchError(this.handleError<Quiz | null>('actualizarAPI', null))
      );
  }

  eliminarAPI(id: number): Observable<boolean> {
    this.updateHttpOptions();
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        tap(() => console.log('Quiz eliminado via API:', id)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  // Métodos locales para compatibilidad (mantener como fallback)
  getTodos(): Quiz[] {
    return this.quizzes;
  }

  obtenerPorModulo(idModulo: number): Quiz[] {
    return this.quizzes.filter(q => q.id_modulo === idModulo);
  }

  agregar(quiz: Quiz): void {
    const nuevoQuiz = {
      ...quiz,
      id: Date.now(),
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    this.quizzes.push(nuevoQuiz);
  }

  actualizar(quiz: Quiz): void {
    const index = this.quizzes.findIndex(q => q.id === quiz.id);
    if (index !== -1) {
      this.quizzes[index] = { ...quiz };
    }
  }

  eliminar(id: number): void {
    this.quizzes = this.quizzes.filter(q => q.id !== id);
  }

  obtenerPorId(id: number): Quiz | undefined {
    return this.quizzes.find(q => q.id === id);
  }
}
