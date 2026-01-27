package es.tfg.kapido.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table (name = "Empleados")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Empleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "Los apellidos no pueden estar vacíos")
    private String apellidos;

    @NotBlank(message = "El DNI no puede estar vacío")
    private String dni;

    @NotNull(message = "El cargo es obligatorio")
    @Enumerated(EnumType.STRING)
    private CargoEmpleado cargo;

    @Column(nullable = false)
    private boolean activo = true;
}
