package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "funcionario")
public class Funcionario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuncionario;
    
    private String nome;
    private String cargo;
}