package es.tfg.kapido.exception;

public class EmpleadoNotFoundException extends RuntimeException {

    public EmpleadoNotFoundException(long id) {
        super("Empleado con ID " + id + " no encontrado");
    }
}
