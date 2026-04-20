package es.tfg.kapido.service;

import es.tfg.kapido.dto.ProductoDTO;
import es.tfg.kapido.mapper.ProductoMapper;
import es.tfg.kapido.model.ConfigAlerta;
import es.tfg.kapido.model.EstadoProducto;
import es.tfg.kapido.model.Producto;
import es.tfg.kapido.repository.ConfigAlertaRepository;
import es.tfg.kapido.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        List<Producto> todos = productoRepository.findByFechaCaducidadBetween(hoy, limite);
        List<ProductoDTO> resultado = new ArrayList<>();
        for (Producto p : todos) {
            if (p.getEstado() != EstadoProducto.RETIRADO) {
                resultado.add(productoMapper.toDTO(p));
            }
        }
        return resultado;
    }

    @Override
    public List<ProductoDTO> findProductosCaducados() {
        List<Producto> todos = productoRepository.findByFechaCaducidadBefore(LocalDate.now());
        List<ProductoDTO> resultado = new ArrayList<>();
        for (Producto p : todos) {
            if (p.getEstado() != EstadoProducto.RETIRADO) {
                resultado.add(productoMapper.toDTO(p));
            }
        }
        return resultado;
    }

    @Override
    public int getDiasPrevioAviso() {
        Optional<ConfigAlerta> optConfig = configAlertaRepository.findById(CONFIG_ID);
        if (optConfig.isPresent()) {
            return optConfig.get().getDiasPrevioAviso();
        }
        return DIAS_AVISO_DEFAULT;
    }

    @Override
    public void setDiasPrevioAviso(int dias) {
        ConfigAlerta config;
        Optional<ConfigAlerta> optConfig = configAlertaRepository.findById(CONFIG_ID);
        if (optConfig.isPresent()) {
            config = optConfig.get();
        } else {
            config = new ConfigAlerta(CONFIG_ID, DIAS_AVISO_DEFAULT);
        }
        config.setDiasPrevioAviso(dias);
        configAlertaRepository.save(config);
    }
}
