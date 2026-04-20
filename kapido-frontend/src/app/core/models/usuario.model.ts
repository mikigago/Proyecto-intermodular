export type RolUsuario = 'CAJERO_REPONEDOR' | 'GESTOR' | 'JEFE_TIENDA';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  rol: RolUsuario;
}
