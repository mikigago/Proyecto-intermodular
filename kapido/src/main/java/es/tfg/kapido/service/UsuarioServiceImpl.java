package es.tfg.kapido.service;

import es.tfg.kapido.model.Usuario;
import es.tfg.kapido.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Spring Security llama a este método al procesar cada petición con JWT
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (!optUsuario.isPresent()) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + email);
        }
        Usuario usuario = optUsuario.get();

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities(usuario.getRol().name())  // Sin prefijo ROLE_ para que @PreAuthorize funcione
                .build();
    }
}
