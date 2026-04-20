package es.tfg.kapido.controller;

import es.tfg.kapido.dto.ProductoDTO;
import es.tfg.kapido.service.AlertaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    // GET /api/alertas → productos próximos a caducar
    @PreAuthorize("hasAnyAuthority('CAJERO_REPONEDOR','GESTOR','JEFE_TIENDA')")
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getProximosACaducar() {
        return ResponseEntity.ok(alertaService.findProductosProximosACaducar());
    }

    // GET /api/alertas/caducados → productos ya caducados
    @PreAuthorize("hasAnyAuthority('CAJERO_REPONEDOR','GESTOR','JEFE_TIENDA')")
    @GetMapping("/caducados")
    public ResponseEntity<List<ProductoDTO>> getCaducados() {
        return ResponseEntity.ok(alertaService.findProductosCaducados());
    }

    // GET /api/alertas/config → días de aviso configurados
    @PreAuthorize("hasAnyAuthority('CAJERO_REPONEDOR','GESTOR','JEFE_TIENDA')")
    @GetMapping("/config")
    public ResponseEntity<Map<String, Integer>> getConfig() {
        return ResponseEntity.ok(Map.of("diasPrevioAviso", alertaService.getDiasPrevioAviso()));
    }

    // PUT /api/alertas/config → actualizar días de aviso (solo JEFE_TIENDA)
    @PreAuthorize("hasAuthority('JEFE_TIENDA')")
    @PutMapping("/config")
    public ResponseEntity<Void> updateConfig(@RequestBody Map<String, Integer> body) {
        alertaService.setDiasPrevioAviso(body.get("diasPrevioAviso"));
        return ResponseEntity.noContent().build();
    }
}
