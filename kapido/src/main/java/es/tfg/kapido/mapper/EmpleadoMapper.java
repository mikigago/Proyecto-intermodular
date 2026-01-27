package es.tfg.kapido.mapper;

import org.springframework.stereotype.Component;

import es.tfg.kapido.dto.EmpleadoDTO;
import es.tfg.kapido.model.Empleado;

@Component
public class EmpleadoMapper {

    public EmpleadoDTO toDTO(Empleado empleado) {
        return new EmpleadoDTO(
                empleado.getId(),
                empleado.getNombre(),
                empleado.getApellidos(),
                empleado.getDni(),
                empleado.getCargo(),
                empleado.isActivo());
    }

    public Empleado toEntity(EmpleadoDTO dto) {
        Empleado empleado = new Empleado();
        empleado.setId(dto.getId());
        empleado.setNombre(dto.getNombre());
        empleado.setApellidos(dto.getApellidos());
        empleado.setDni(dto.getDni());
        empleado.setCargo(dto.getCargo());
        empleado.setActivo(dto.isActivo());
        return empleado;
    }
}
