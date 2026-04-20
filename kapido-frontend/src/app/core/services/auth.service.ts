import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/usuario.model';

// Servicio singleton encargado de toda la lógica de autenticación.
// Gestiona el login contra el backend, el guardado del token en localStorage
// y la comprobación de si el usuario está autenticado.
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Llama al endpoint POST /api/auth/login y devuelve el Observable con la respuesta
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', request);
  }

  // Guarda el token, email y rol en localStorage tras un login exitoso
  guardarSesion(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('email', response.email);
    localStorage.setItem('rol', response.rol);
  }

  // Elimina todos los datos de sesión del localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
