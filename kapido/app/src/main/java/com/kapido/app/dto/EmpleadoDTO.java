package com.kapido.app.dto;

import com.kapido.app.model.Puesto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//Este DTO es el que se usará para :
// *listar empleados 
// *mostrar detalles 
// *enviar datos 
// a la vista o al cliente.

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoDTO {

    private long id;
    private String nombre;
    private Puesto puesto;
    private double salario;


}
