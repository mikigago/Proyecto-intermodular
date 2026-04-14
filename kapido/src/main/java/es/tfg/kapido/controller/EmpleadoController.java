package es.tfg.kapido.controller;

import es.tfg.kapido.dto.EmpleadoDTO;
import es.tfg.kapido.mapper.EmpleadoMapper;
import es.tfg.kapido.model.Empleado;
import es.tfg.kapido.service.EmpleadoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;
    private final EmpleadoMapper empleadoMapper;

    public EmpleadoController(EmpleadoService empleadoService, EmpleadoMapper empleadoMapper) {
        this.empleadoService = empleadoService;
        this.empleadoMapper = empleadoMapper;
    }

    // GET ALL
    @PreAuthorize("hasAnyAuthority('GESTOR','JEFE_TIENDA')")
    @GetMapping
    public ResponseEntity<List<EmpleadoDTO>> getAll() {
        List<EmpleadoDTO> empleados = empleadoService.findAll()
                .stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(empleados);
    }

    // GET BY ID
    @PreAuthorize("hasAnyAuthority('GESTOR','JEFE_TIENDA')")
    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> getById(@PathVariable long id) {
        Empleado empleado = empleadoService.findById(id);
        return ResponseEntity.ok(empleadoMapper.toDTO(empleado));
    }

    // CREATE
    @PreAuthorize("hasAnyAuthority('GESTOR','JEFE_TIENDA')")
    @PostMapping
    public ResponseEntity<EmpleadoDTO> create(@Valid @RequestBody EmpleadoDTO dto) {
        Empleado empleado = empleadoMapper.toEntity(dto);
        Empleado saved = empleadoService.save(empleado);

        return ResponseEntity
                .created(URI.create("/api/empleados/" + saved.getId()))
                .body(empleadoMapper.toDTO(saved));
    }

    // UPDATE
    @PreAuthorize("hasAnyAuthority('GESTOR','JEFE_TIENDA')")
    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> update(@PathVariable long id,
                                              @Valid @RequestBody EmpleadoDTO dto) {

        Empleado empleado = empleadoMapper.toEntity(dto);
        Empleado updated = empleadoService.update(id, empleado);

        return ResponseEntity.ok(empleadoMapper.toDTO(updated));
    }

    // DELETE
    @PreAuthorize("hasAuthority('JEFE_TIENDA')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        empleadoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
