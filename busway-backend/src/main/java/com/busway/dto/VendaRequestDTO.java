package com.busway.dto;

import lombok.Data;

@Data
public class VendaRequestDTO {
    private Integer id_viagem;
    private Integer numero_poltrona;
    private String passageiro_cpf;
    private String passageiro_nome;
    private Integer id_funcionario;
    private Double valor;
}