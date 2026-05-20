package com.busway.repository;

import com.busway.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {
    @Query("SELECT v FROM Viagem v WHERE v.rota.origem = :origem AND v.rota.destino = :destino AND v.data = :data")
    List<Viagem> findByRotaAndData(String origem, String destino, LocalDate data);
}