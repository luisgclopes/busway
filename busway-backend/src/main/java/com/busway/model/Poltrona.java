package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "poltrona")
public class Poltrona {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPoltrona;
    
    private Integer numero;
    
    @ManyToOne 
    @JoinColumn(name = "id_onibus")
    private Onibus onibus;
}