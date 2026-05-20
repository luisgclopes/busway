package com.busway.dto;

import lombok.Data;

@Data
public class ViagemResponseDTO {
    private Integer id_viagem;
    private String horario;
    private String onibus_placa;
    private Integer capacidade;
    private Double valor;
}