package com.busway.repository;

import com.busway.model.Poltrona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PoltronaRepository extends JpaRepository<Poltrona, Integer> {
    Optional<Poltrona> findByNumeroAndOnibus_IdOnibus(Integer numero, Integer idOnibus);
}