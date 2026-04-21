import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertaService } from '../../../core/services/alerta.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';

// Componente principal del dashboard.
// Muestra dos secciones: productos próximos a caducar y productos ya caducados.
// Si el usuario es JEFE_TIENDA, permite cambiar los días de aviso previo.
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  proximosACaducar: Producto[] = [];
  caducados: Producto[] = [];
  enStock: Producto[] = [];
  vendidos: Producto[] = [];
  stockPerdido: number = 0;
  stockPerdidoUnidades: number = 0;
  stockPerdidoPacks: number = 0;
  stockPerdidoKg: number = 0;

  diasAviso: number = 7;
  nuevosDias: number = 7;

  cargando: boolean = false;
  guardandoConfig: boolean = false;
  error: string = '';
  mensajeConfig: string = '';

  rol: string = '';
  email: string = '';

  constructor(
    private alertaService: AlertaService,
    private authService: AuthService,
    private productoService: ProductoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol() || '';
    this.email = this.authService.getEmail() || '';
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    forkJoin({
      config: this.alertaService.getConfig(),
      proximos: this.alertaService.getProximosACaducar(),
      caducados: this.alertaService.getCaducados(),
      todos: this.productoService.getAll()
    }).pipe(
      finalize(() => { this.cargando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: ({ config, proximos, caducados, todos }) => {
        this.diasAviso = config.diasPrevioAviso;
        this.nuevosDias = config.diasPrevioAviso;
        this.proximosACaducar = proximos;
        this.caducados = caducados;

        const proximosIds: Set<number> = new Set<number>();
        for (let i = 0; i < proximos.length; i++) {
          if (proximos[i].id != null) {
            proximosIds.add(proximos[i].id as number);
          }
        }
        const caducadosIds: Set<number> = new Set<number>();
        for (let i = 0; i < caducados.length; i++) {
          if (caducados[i].id != null) {
            caducadosIds.add(caducados[i].id as number);
          }
        }
        this.enStock = todos.filter(p =>
          p.estado === 'EN_STOCK' &&
          !proximosIds.has(p.id as number) &&
          !caducadosIds.has(p.id as number)
        );

        this.vendidos = todos.filter(p =>
          p.estado === 'RETIRADO' && (p.cantidadActual ?? 0) === 0
        );

        const perdidos = todos.filter(p => p.estado === 'CADUCADO' || p.estado === 'RETIRADO');
        this.stockPerdido = 0;
        this.stockPerdidoUnidades = 0;
        this.stockPerdidoPacks = 0;
        this.stockPerdidoKg = 0;
        for (let i = 0; i < perdidos.length; i++) {
          const cantidad = perdidos[i].cantidadActual ?? 0;
          this.stockPerdido = this.stockPerdido + cantidad;
          if (perdidos[i].tipoUnidad === 'packs') {
            this.stockPerdidoPacks = this.stockPerdidoPacks + cantidad;
          } else if (perdidos[i].tipoUnidad === 'kilogramos') {
            this.stockPerdidoKg = this.stockPerdidoKg + cantidad;
          } else {
            this.stockPerdidoUnidades = this.stockPerdidoUnidades + cantidad;
          }
        }
      },
      error: () => {
        this.error = 'Error al cargar los datos del dashboard. Comprueba que el servidor está activo.';
      }
    });
  }

  guardarConfig(): void {
    if (this.nuevosDias < 1) {
      this.mensajeConfig = 'El número de días debe ser mayor que 0.';
      return;
    }
    this.guardandoConfig = true;
    this.mensajeConfig = '';
    this.alertaService.updateConfig(this.nuevosDias).subscribe({
      next: () => {
        this.diasAviso = this.nuevosDias;
        this.mensajeConfig = 'Configuración guardada correctamente.';
        this.guardandoConfig = false;
        this.cargarDatos();
      },
      error: () => {
        this.mensajeConfig = 'Error al guardar la configuración.';
        this.guardandoConfig = false;
      }
    });
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  esTienda(): boolean {
    return this.rol === 'JEFE_TIENDA';
  }

  esCajero(): boolean {
    return this.rol === 'CAJERO_REPONEDOR';
  }

  getUnidadLabel(tipoUnidad: string | undefined): string {
    if (tipoUnidad === 'kilogramos') {
      return 'Kg';
    } else if (tipoUnidad === 'packs') {
      return 'pack';
    }
    return 'ud.';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
