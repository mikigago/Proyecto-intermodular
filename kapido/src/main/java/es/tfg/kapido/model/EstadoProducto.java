package es.tfg.kapido.model;

public enum EstadoProducto {
    EN_STOCK,           // producto con fecha de caducidad lejana
    PROXIMO_CADUCAR,    // la fecha de caducidad está dentro del margen de aviso
    CADUCADO,           // la fecha de caducidad ya ha pasado
    RETIRADO            // producto retirado manualmente de la venta
}
