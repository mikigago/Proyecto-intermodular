import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Producto, EstadoProducto } from '../../../core/models/producto.model';

// Componente que muestra la lista de todos los productos en una tabla.
// Permite navegar al formulario de edición y eliminar productos (solo JEFE_TIENDA).
@Component({
  selector: 'app-producto-list',
  standalone: false,
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {

  productos: Producto[] = [];
  cargando: boolean = false;
  error: string = '';
  rol: string = '';

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol() || '';
    this.cargarProductos();
  }

  cargarProductos(): void {
    console.log('[ProductoList] cargarProductos() llamado');
    this.cargando = true;
    this.error = '';
    this.productoService.getAll().subscribe({
      next: (data) => {
        console.log('[ProductoList] Productos recibidos:', data);
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ProductoList] Error:', err);
        this.error = `Error al cargar los productos (${err.status ?? 'sin respuesta'}). Inténtalo de nuevo.`;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  irANuevo(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/productos/editar', id]);
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    this.productoService.delete(id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err) => {
        this.error = 'Error al eliminar el producto.';
      }
    });
  }

  esTienda(): boolean {
    return this.rol === 'JEFE_TIENDA';
  }

  getBadgeClass(estado: EstadoProducto | undefined): string {
    if (estado === 'EN_STOCK') {
      return 'badge badge-en-stock';
    } else if (estado === 'PROXIMO_CADUCAR') {
      return 'badge badge-proximo-caducar';
    } else if (estado === 'CADUCADO') {
      return 'badge badge-caducado';
    } else if (estado === 'RETIRADO') {
      return 'badge badge-retirado';
    }
    return 'badge bg-secondary';
  }

  getEstadoTexto(estado: EstadoProducto | undefined): string {
    if (estado === 'EN_STOCK') {
      return 'En stock';
    } else if (estado === 'PROXIMO_CADUCAR') {
      return 'Próximo a caducar';
    } else if (estado === 'CADUCADO') {
      return 'Caducado';
    } else if (estado === 'RETIRADO') {
      return 'Retirado';
    }
    return 'Desconocido';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
