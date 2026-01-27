package es.tfg.kapido.service;

import es.tfg.kapido.model.Empleado;

import java.util.List;

public interface EmpleadoService {

    List<Empleado> findAll();

    Empleado findById(long id);

    Empleado save(Empleado empleado);

    Empleado update(long id, Empleado empleado);

    void delete(long id);
}
