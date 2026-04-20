import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Este interceptor se ejecuta automáticamente antes de cada petición HTTP.
// Lee el token JWT de localStorage y lo añade a la cabecera Authorization.
// Así no hay que añadirlo manualmente en cada llamada al backend.
// Si el backend responde con 401 o 403, limpia la sesión y redirige al login.
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('rol');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
