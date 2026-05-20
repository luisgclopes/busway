package com.busway.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "venda", uniqueConstraints = {@UniqueConstraint(columnNames = {"id_viagem", "id_poltrona"})})
public class Venda {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVenda;
    
    @ManyToOne 
    @JoinColumn(name = "id_viagem")
    private Viagem viagem;
    
    @ManyToOne 
    @JoinColumn(name = "id_poltrona")
    private Poltrona poltrona;
    
    @ManyToOne 
    @JoinColumn(name = "id_passageiro")
    private Passageiro passageiro;
    
    @ManyToOne 
    @JoinColumn(name = "id_funcionario")
    private Funcionario funcionario;
    
    private LocalDateTime dataVenda;
    private Double preco;
}