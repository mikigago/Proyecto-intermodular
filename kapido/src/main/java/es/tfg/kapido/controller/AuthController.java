package es.tfg.kapido.controller;

import es.tfg.kapido.dto.LoginRequest;
import es.tfg.kapido.dto.LoginResponse;
import es.tfg.kapido.model.Usuario;
import es.tfg.kapido.repository.UsuarioRepository;
import es.tfg.kapido.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    // POST /api/auth/login
    // Body: { "email": "gestor@kapido.com", "password": "gestor123" }
    // Respuesta: { "token": "eyJ...", "email": "...", "rol": "GESTOR" }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Si no contiene '@', se asume que es un alias y se añade el dominio por defecto
        String email = request.getEmail().contains("@")
                ? request.getEmail()
                : request.getEmail() + "@kapido.com";

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());

        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getRol().name()));
    }
}
