package es.tfg.kapido.service;

import es.tfg.kapido.exception.EmpleadoNotFoundException;
import es.tfg.kapido.model.Empleado;
import es.tfg.kapido.repository.EmpleadoRepository;
import es.tfg.kapido.service.EmpleadoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public List<Empleado> findAll() {
        return empleadoRepository.findAll();
    }

    @Override
    public Empleado findById(long id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new EmpleadoNotFoundException(id));
    }

    @Override
    public Empleado save(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    @Override
    public Empleado update(long id, Empleado empleado) {
        Empleado existing = findById(id);

        existing.setNombre(empleado.getNombre());
        existing.setApellidos(empleado.getApellidos());
        existing.setDni(empleado.getDni());
        existing.setCargo(empleado.getCargo());
        existing.setActivo(empleado.isActivo());

        return empleadoRepository.save(existing);
    }

    @Override
    public void delete(long id) {
        Empleado existing = findById(id);
        empleadoRepository.delete(existing);
    }
}
