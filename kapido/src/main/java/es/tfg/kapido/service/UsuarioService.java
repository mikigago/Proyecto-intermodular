package es.tfg.kapido.service;

import org.springframework.security.core.userdetails.UserDetailsService;

// Extiende UserDetailsService para que Spring Security
// pueda cargar el usuario al validar cada petición JWT
public interface UsuarioService extends UserDetailsService {
}
