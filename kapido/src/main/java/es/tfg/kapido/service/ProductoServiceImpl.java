package es.tfg.kapido.service;

import es.tfg.kapido.exception.ProductoNotFoundException;
import es.tfg.kapido.model.ConfigAlerta;
import es.tfg.kapido.model.EstadoProducto;
import es.tfg.kapido.model.Producto;
import es.tfg.kapido.repository.ConfigAlertaRepository;
import es.tfg.kapido.repository.ProductoRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private static final int DIAS_AVISO_DEFAULT = 7;

    private final ProductoRepository productoRepository;
    private final ConfigAlertaRepository configAlertaRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository,
                               ConfigAlertaRepository configAlertaRepository) {
        this.productoRepository = productoRepository;
        this.configAlertaRepository = configAlertaRepository;
    }

    @Override
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    @Override
    public Producto findById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException(id));
    }

    @Override
    public Producto save(Producto producto) {
        // Calcular el estado automáticamente antes de guardar IMPORTANTE: el estado no se envía desde el cliente, sino que se calcula aquí
        producto.setEstado(calcularEstado(producto.getFechaCaducidad()));
        return productoRepository.save(producto);
    }

    @Override
    public Producto update(Long id, Producto producto) {
        Producto existing = findById(id);

        existing.setNombre(producto.getNombre());
        existing.setNumeroLote(producto.getNumeroLote());
        existing.setCodigoBarras(producto.getCodigoBarras());
        existing.setFechaLlegada(producto.getFechaLlegada());
        existing.setFechaCaducidad(producto.getFechaCaducidad());
        existing.setEstado(calcularEstado(producto.getFechaCaducidad()));

        return productoRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Producto existing = findById(id);
        productoRepository.delete(existing);
    }

    // Calcula el estado del producto según su fecha de caducidad y los días configurados en ConfigAlerta.
    private EstadoProducto calcularEstado(LocalDate fechaCaducidad) {
        LocalDate hoy = LocalDate.now();
        int diasAviso = configAlertaRepository.findById(1L)
                .map(ConfigAlerta::getDiasPrevioAviso)
                .orElse(DIAS_AVISO_DEFAULT);

        if (fechaCaducidad.isBefore(hoy)) {
            return EstadoProducto.CADUCADO;
        } else if (!fechaCaducidad.isAfter(hoy.plusDays(diasAviso))) {
            return EstadoProducto.PROXIMO_CADUCAR;
        } else {
            return EstadoProducto.EN_STOCK;
        }
    }
}
