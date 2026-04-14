package es.tfg.kapido.service;

import es.tfg.kapido.dto.ProductoDTO;
import es.tfg.kapido.mapper.ProductoMapper;
import es.tfg.kapido.model.ConfigAlerta;
import es.tfg.kapido.model.EstadoProducto;
import es.tfg.kapido.repository.ConfigAlertaRepository;
import es.tfg.kapido.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertaServiceImpl implements AlertaService {

    private static final Long CONFIG_ID = 1L;
    private static final int DIAS_AVISO_DEFAULT = 7;

    private final ProductoRepository productoRepository;
    private final ConfigAlertaRepository configAlertaRepository;
    private final ProductoMapper productoMapper;

    public AlertaServiceImpl(ProductoRepository productoRepository,
                             ConfigAlertaRepository configAlertaRepository,
                             ProductoMapper productoMapper) {
        this.productoRepository = productoRepository;
        this.configAlertaRepository = configAlertaRepository;
        this.productoMapper = productoMapper;
    }

    @Override
    public List<ProductoDTO> findProductosProximosACaducar() {
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusDays(getDiasPrevioAviso());

        return productoRepository.findByFechaCaducidadBetween(hoy, limite)
                .stream()
                .filter(p -> p.getEstado() != EstadoProducto.RETIRADO)
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductoDTO> findProductosCaducados() {
        return productoRepository.findByFechaCaducidadBefore(LocalDate.now())
                .stream()
                .filter(p -> p.getEstado() != EstadoProducto.RETIRADO)
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public int getDiasPrevioAviso() {
        return configAlertaRepository.findById(CONFIG_ID)
                .map(ConfigAlerta::getDiasPrevioAviso)
                .orElse(DIAS_AVISO_DEFAULT);
    }

    @Override
    public void setDiasPrevioAviso(int dias) {
        ConfigAlerta config = configAlertaRepository.findById(CONFIG_ID)
                .orElse(new ConfigAlerta(CONFIG_ID, DIAS_AVISO_DEFAULT));
        config.setDiasPrevioAviso(dias);
        configAlertaRepository.save(config);
    }
}
