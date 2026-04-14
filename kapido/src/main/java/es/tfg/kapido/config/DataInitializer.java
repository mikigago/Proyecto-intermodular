package es.tfg.kapido.config;

import es.tfg.kapido.model.ConfigAlerta;
import es.tfg.kapido.model.RolUsuario;
import es.tfg.kapido.model.Usuario;
import es.tfg.kapido.repository.ConfigAlertaRepository;
import es.tfg.kapido.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Se ejecuta al arrancar la app.
// Si la tabla usuarios está vacía, crea los tres usuarios de prueba.
@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfigAlertaRepository configAlertaRepository;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder,
                           ConfigAlertaRepository configAlertaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.configAlertaRepository = configAlertaRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario(null, "Cajero Demo",
                    "cajero@kapido.com",
                    passwordEncoder.encode("cajero123"),
                    RolUsuario.CAJERO_REPONEDOR, true));

            usuarioRepository.save(new Usuario(null, "Gestor Demo",
                    "gestor@kapido.com",
                    passwordEncoder.encode("gestor123"),
                    RolUsuario.GESTOR, true));

            usuarioRepository.save(new Usuario(null, "Jefe Tienda",
                    "jefe@kapido.com",
                    passwordEncoder.encode("jefe123"),
                    RolUsuario.JEFE_TIENDA, true));

            System.out.println(">>> Usuarios de prueba creados: cajero / gestor / jefe");
        }

        if (configAlertaRepository.count() == 0) {
            configAlertaRepository.save(new ConfigAlerta(1L, 7));
            System.out.println(">>> ConfigAlerta creada: 7 días de aviso previo");
        }
    }
}
