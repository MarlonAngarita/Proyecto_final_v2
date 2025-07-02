import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Error inesperado en la conexión con el servidor.';
        if (error.error && error.error.detail) {
          mensaje = error.error.detail;
        } else if (error.status === 0) {
          mensaje = 'No se pudo conectar con el backend.';
        }
        // Aquí puedes mostrar el error globalmente (ej: con un servicio de notificaciones)
        alert(mensaje);
        return throwError(() => error);
      }),
    );
  }
}
