package es.tfg.kapido.repository;

import es.tfg.kapido.model.EstadoProducto;
import es.tfg.kapido.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Productos cuya fecha de caducidad es anterior a una fecha dada (ya caducados)
    List<Producto> findByFechaCaducidadBefore(LocalDate fecha);

    // Productos cuya fecha de caducidad está entre dos fechas (próximos a caducar)
    List<Producto> findByFechaCaducidadBetween(LocalDate desde, LocalDate hasta);

    // Productos filtrados por estado
    List<Producto> findByEstado(EstadoProducto estado);
}
