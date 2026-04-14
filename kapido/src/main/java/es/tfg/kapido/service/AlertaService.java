package es.tfg.kapido.service;

import es.tfg.kapido.dto.ProductoDTO;

import java.util.List;

public interface AlertaService {

    // Devuelve todos los productos próximos a caducar según la configuración actual
    List<ProductoDTO> findProductosProximosACaducar();

    // Devuelve los productos ya caducados
    List<ProductoDTO> findProductosCaducados();

    // Devuelve los días de aviso configurados actualmente
    int getDiasPrevioAviso();

    // Actualiza los días de aviso
    void setDiasPrevioAviso(int dias);
}
