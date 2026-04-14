package es.tfg.kapido.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.tfg.kapido.dto.ProductoDTO;
import es.tfg.kapido.mapper.ProductoMapper;
import es.tfg.kapido.model.Producto;
import es.tfg.kapido.model.Usuario;
import es.tfg.kapido.repository.UsuarioRepository;
import es.tfg.kapido.service.ProductoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final ProductoMapper productoMapper;
    private final UsuarioRepository usuarioRepository;

    public ProductoController(ProductoService productoService,
                              ProductoMapper productoMapper,
                              UsuarioRepository usuarioRepository) {
        this.productoService = productoService;
        this.productoMapper = productoMapper;
        this.usuarioRepository = usuarioRepository;
    }

    // Cualquier usuario autenticado puede consultar la lista de productos
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getAll() {
        List<Producto> todos = productoService.findAll();
        List<ProductoDTO> productos = new ArrayList<>();
        for (Producto p : todos) {
            productos.add(productoMapper.toDTO(p));
        }
        return ResponseEntity.ok(productos);
    }

    // Cualquier usuario autenticado puede ver el detalle de un producto
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoMapper.toDTO(productoService.findById(id)));
    }

    // Solo GESTOR y JEFE_TIENDA pueden registrar nuevos productos
    @PreAuthorize("hasAnyAuthority('GESTOR', 'JEFE_TIENDA')")
    @PostMapping
    public ResponseEntity<ProductoDTO> create(@Valid @RequestBody ProductoDTO dto,
                                               Authentication authentication) {
        Producto producto = productoMapper.toEntity(dto);

        // Asigna el usuario autenticado como registrador del producto
        String email = authentication.getName();
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);
        if (!optUsuario.isPresent()) {
            throw new RuntimeException("Usuario no encontrado: " + email);
        }
        Usuario usuario = optUsuario.get();
        producto.setRegistradoPor(usuario);

        Producto saved = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoMapper.toDTO(saved));
    }

    // Solo GESTOR y JEFE_TIENDA pueden actualizar productos
    @PreAuthorize("hasAnyAuthority('GESTOR', 'JEFE_TIENDA')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> update(@PathVariable Long id,
                                               @Valid @RequestBody ProductoDTO dto) {
        Producto producto = productoMapper.toEntity(dto);
        Producto updated = productoService.update(id, producto);
        return ResponseEntity.ok(productoMapper.toDTO(updated));
    }

    // Solo el JEFE_TIENDA puede eliminar productos
    @PreAuthorize("hasAuthority('JEFE_TIENDA')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
