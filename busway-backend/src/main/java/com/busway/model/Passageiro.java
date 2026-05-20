package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "passageiro")
public class Passageiro {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPassageiro;
    
    private String nome;
    private String cpf;
}