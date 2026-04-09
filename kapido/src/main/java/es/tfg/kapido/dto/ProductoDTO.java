package es.tfg.kapido.dto;

import java.time.LocalDate;

import es.tfg.kapido.model.EstadoProducto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String numeroLote;
    private String codigoBarras;
    private LocalDate fechaLlegada;
    private LocalDate fechaCaducidad;
    private EstadoProducto estado;
    private Long registradoPorId;
}
