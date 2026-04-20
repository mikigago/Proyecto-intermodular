export type EstadoProducto = 'EN_STOCK' | 'PROXIMO_CADUCAR' | 'CADUCADO' | 'RETIRADO';

export interface Producto {
  id?: number;
  nombre: string;
  numeroLote: string;
  codigoBarras?: string;
  fechaLlegada: string;
  fechaCaducidad: string;
  estado?: EstadoProducto;
  registradoPorId?: number;
}
