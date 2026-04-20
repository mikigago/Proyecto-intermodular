import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertaService } from '../../../core/services/alerta.service';
import { AuthService } from '../../../core/services/auth.service';
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
      caducados: this.alertaService.getCaducados()
    }).pipe(
      finalize(() => { this.cargando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: ({ config, proximos, caducados }) => {
        this.diasAviso = config.diasPrevioAviso;
        this.nuevosDias = config.diasPrevioAviso;
        this.proximosACaducar = proximos;
        this.caducados = caducados;
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

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
