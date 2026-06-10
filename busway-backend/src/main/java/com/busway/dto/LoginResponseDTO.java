package com.busway.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Integer idFuncionario;
    private String nome;
    private String cargo;

    public LoginResponseDTO(Integer idFuncionario, String nome, String cargo) {
        this.idFuncionario = idFuncionario;
        this.nome = nome;
        this.cargo = cargo;
    }
}