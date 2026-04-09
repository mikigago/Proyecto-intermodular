package es.tfg.kapido.mapper;

import org.springframework.stereotype.Component;

import es.tfg.kapido.dto.ProductoDTO;
import es.tfg.kapido.model.Producto;

@Component
public class ProductoMapper {

    public ProductoDTO toDTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setNumeroLote(producto.getNumeroLote());
        dto.setCodigoBarras(producto.getCodigoBarras());
        dto.setFechaLlegada(producto.getFechaLlegada());
        dto.setFechaCaducidad(producto.getFechaCaducidad());
        dto.setEstado(producto.getEstado());
        if (producto.getRegistradoPor() != null) {
            dto.setRegistradoPorId(producto.getRegistradoPor().getId());
        }
        return dto;
    }

    public Producto toEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setNombre(dto.getNombre());
        producto.setNumeroLote(dto.getNumeroLote());
        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setFechaLlegada(dto.getFechaLlegada());
        producto.setFechaCaducidad(dto.getFechaCaducidad());
        if (dto.getEstado() != null) {
            producto.setEstado(dto.getEstado());
        }
        // registradoPor se asigna en el servicio (via UsuarioRepository)
        return producto;
    }
}
