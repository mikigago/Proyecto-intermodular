import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

// Servicio que gestiona las llamadas al endpoint /api/alertas del backend.
// Permite consultar productos próximos a caducar, ya caducados y la configuración de días de aviso.
@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private apiUrl = 'http://localhost:8080/api/alertas';

  constructor(private http: HttpClient) {}

  getProximosACaducar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getCaducados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl + '/caducados');
  }

  getConfig(): Observable<{ diasPrevioAviso: number }> {
    return this.http.get<{ diasPrevioAviso: number }>(this.apiUrl + '/config');
  }

  updateConfig(dias: number): Observable<void> {
    return this.http.put<void>(this.apiUrl + '/config', { diasPrevioAviso: dias });
  }
}
