package com.busway.repository;

import com.busway.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Integer> {
    @Query("SELECT v.poltrona.numero FROM Venda v WHERE v.viagem.idViagem = :idViagem")
    List<Integer> findPoltronasOcupadasByViagem(Integer idViagem);
}