import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';

// Componente de formulario reutilizable para crear o editar un producto.
// Si la ruta incluye un :id, carga el producto existente (modo edición).
// Si no, muestra el formulario vacío (modo creación).
@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {

  modoEdicion: boolean = false;
  productoId: number | null = null;
  cargando: boolean = false;
  guardando: boolean = false;
  error: string = '';

  producto: Producto = {
    nombre: '',
    numeroLote: '',
    codigoBarras: '',
    fechaLlegada: '',
    fechaCaducidad: ''
  };

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.modoEdicion = true;
      this.productoId = Number(idParam);
      this.cargarProducto(this.productoId);
    }
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.productoService.getById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (!this.producto.nombre || !this.producto.numeroLote || !this.producto.fechaLlegada || !this.producto.fechaCaducidad) {
      this.error = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }

    this.guardando = true;
    this.error = '';

    if (this.modoEdicion && this.productoId !== null) {
      this.productoService.update(this.productoId, this.producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          this.error = 'Error al actualizar el producto.';
          this.guardando = false;
        }
      });
    } else {
      this.productoService.create(this.producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          this.error = 'Error al crear el producto.';
          this.guardando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
