package es.tfg.kapido.service;

import es.tfg.kapido.model.Producto;

import java.util.List;

public interface ProductoService {

    List<Producto> findAll();

    Producto findById(Long id);

    Producto save(Producto producto);

    Producto update(Long id, Producto producto);

    void delete(Long id);

    Producto registrarVenta(Long id, int cantidad);
}
