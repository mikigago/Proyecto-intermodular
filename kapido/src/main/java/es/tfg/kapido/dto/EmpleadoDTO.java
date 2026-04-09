package es.tfg.kapido.dto;

import es.tfg.kapido.model.CargoEmpleado;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

//prueba de comentario

public class EmpleadoDTO {
    
    private Long id;
    private String nombre;
    private String apellidos;
    private String dni;
    private CargoEmpleado cargo;
    private boolean activo;
}
