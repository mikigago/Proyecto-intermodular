package es.tfg.kapido.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Configuración global de alertas. Siempre existe exactamente un registro (id = 1).
@Entity
@Table(name = "config_alerta")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConfigAlerta {

    @Id
    private Long id;

    // Días de margen antes de la caducidad para marcar como PROXIMO_CADUCAR
    @Column(nullable = false)
    private int diasPrevioAviso;
}
