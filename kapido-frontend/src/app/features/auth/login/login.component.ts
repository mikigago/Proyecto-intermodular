import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest, LoginResponse } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.cargando = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (response: LoginResponse) => {
        this.authService.guardarSesion(response);

        // Todos los roles acceden al dashboard
        this.router.navigate(['/dashboard']);
        this.cargando = false;
      },
      error: () => {
        this.errorMessage = 'Email o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}
