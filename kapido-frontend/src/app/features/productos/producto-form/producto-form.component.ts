import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  categoria: string = '';
  tipoUnidad: string = 'unidades';

  categorias = [
    { valor: 'LACTEOS',  etiqueta: '🥛 Lácteos'  },
    { valor: 'CARNES',   etiqueta: '🥩 Carnes'    },
    { valor: 'PESCADOS', etiqueta: '🐟 Pescados'  },
    { valor: 'VERDURAS', etiqueta: '🥦 Verduras'  },
    { valor: 'FRUTAS',   etiqueta: '🍎 Frutas'    },
    { valor: 'OTROS',    etiqueta: '📦 Otros'     },
  ];

  private prefijos: Record<string, string> = {
    LACTEOS:  'L-',
    CARNES:   'C-',
    PESCADOS: 'P-',
    VERDURAS: 'V-',
    FRUTAS:   'F-',
    OTROS:    'O-',
  };

  onCategoriaChange(valor: string): void {
    // Obtener todos los prefijos posibles
    let loteBase = this.producto.numeroLote || '';

    // Quitar el prefijo anterior si existe
    for (const clave in this.prefijos) {
      const prefijo = this.prefijos[clave];
      if (loteBase.startsWith(prefijo)) {
        loteBase = loteBase.substring(prefijo.length);
        break;
      }
    }

    // Aplicar el nuevo prefijo
    let nuevoPrefijo = '';
    if (valor && this.prefijos[valor]) {
      nuevoPrefijo = this.prefijos[valor];
    }
    this.producto.numeroLote = nuevoPrefijo + loteBase;
  }

  onLoteInput(event: Event): void {
    if (!this.categoria) return;
    const prefijo = this.prefijos[this.categoria];
    if (!prefijo) return;
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    if (!valor.startsWith(prefijo)) {
      // El usuario intentó borrar el prefijo: restaurarlo y dejar el cursor justo después
      this.producto.numeroLote = prefijo;
      setTimeout(() => {
        input.setSelectionRange(prefijo.length, prefijo.length);
      }, 0);
    }
  }

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
    private router: Router,
    private cdr: ChangeDetectorRef
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
        this.tipoUnidad = data.tipoUnidad || 'unidades';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    if (!this.producto.nombre || !this.producto.numeroLote || !this.producto.fechaLlegada || !this.producto.fechaCaducidad) {
      this.error = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }
    // La cantidad actual siempre se sincroniza con la inicial al crear o editar el lote
    if (this.producto.cantidadInicial != null) {
      this.producto.cantidadActual = this.producto.cantidadInicial;
    }

    // Guardar el tipo de unidad seleccionado
    this.producto.tipoUnidad = this.tipoUnidad;

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

  generando: boolean = false;

  generarCodigoBarras(): void {
    // Reiniciar la animación del icono
    this.generando = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.generando = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.generando = false;
        this.cdr.detectChanges();
      }, 500);
    }, 0);

    // Generar los 12 primeros dígitos aleatoriamente
    const digitos: number[] = [];
    for (let i = 0; i < 12; i++) {
      digitos.push(Math.floor(Math.random() * 10));
    }

    // Calcular el dígito de control EAN-13
    let suma = 0;
    for (let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        suma = suma + digitos[i];
      } else {
        suma = suma + digitos[i] * 3;
      }
    }
    const digitoControl = (10 - (suma % 10)) % 10;
    digitos.push(digitoControl);

    // Unir todos los dígitos en un string
    let codigo = '';
    for (let i = 0; i < digitos.length; i++) {
      codigo = codigo + digitos[i];
    }
    this.producto.codigoBarras = codigo;
  }
}
