import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

// Protege las rutas según si el usuario está autenticado y tiene el rol requerido.
// Se usa en el routing de cada feature: canActivate: [AuthGuard]
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Si no hay token, redirige al login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si la ruta requiere un rol concreto, comprueba que el usuario lo tiene
    const rolesPermitidos: string[] = route.data?.['roles'];
    if (rolesPermitidos && rolesPermitidos.length > 0) {
      if (!rol || !rolesPermitidos.includes(rol)) {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
