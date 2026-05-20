package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "viagem")
public class Viagem {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idViagem;
    
    @ManyToOne 
    @JoinColumn(name = "id_rota")
    private Rota rota;
    
    @ManyToOne 
    @JoinColumn(name = "id_onibus")
    private Onibus onibus;
    
    private LocalDate data;
    private LocalTime hora;
}