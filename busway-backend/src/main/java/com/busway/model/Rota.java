package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rota")
public class Rota {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRota;
    
    private String origem;
    private String destino;
}