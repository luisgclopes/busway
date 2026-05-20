package com.busway.repository;

import com.busway.model.Passageiro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PassageiroRepository extends JpaRepository<Passageiro, Integer> {
    Optional<Passageiro> findByCpf(String cpf);
}