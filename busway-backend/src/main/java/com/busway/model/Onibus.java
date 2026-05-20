package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "onibus")
public class Onibus {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOnibus;
    
    private String placa;
    private Integer capacidade;
}