package com.busway.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ViagemRequestDTO {
    private Integer id_rota;
    private Integer id_onibus;
    private LocalDate data;
    private LocalTime hora;
}