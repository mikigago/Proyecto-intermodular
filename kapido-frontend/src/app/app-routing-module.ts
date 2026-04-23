import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Pantalla de entrada animada
  { path: '', redirectTo: 'animaciones', pathMatch: 'full' },

  // Animación de entrada
  {
    path: 'animaciones',
    loadChildren: () => import('./features/animaciones/animaciones.module').then(m => m.AnimacionesModule)
  },

  // Selector de aplicación
  {
    path: 'selector',
    loadChildren: () => import('./features/app-selector/app-selector.module').then(m => m.AppSelectorModule)
  },

  // Módulo de autenticación (públic, sin guard)
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Módulo de productos (requiere estar autenticado)
  {
    path: 'productos',
    canActivate: [AuthGuard],
    data: { roles: ['CAJERO_REPONEDOR', 'GESTOR', 'JEFE_TIENDA', 'INVITADO'] },
    loadChildren: () => import('./features/productos/productos.module').then(m => m.ProductosModule)
  },

  // Módulo de dashboard (accesible para todos los roles)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: ['CAJERO_REPONEDOR', 'GESTOR', 'JEFE_TIENDA', 'INVITADO'] },
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },

  // Cualquier ruta desconocida redirige al login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
