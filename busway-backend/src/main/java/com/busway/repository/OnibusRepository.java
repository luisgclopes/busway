package com.busway.repository;

import com.busway.model.Onibus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OnibusRepository extends JpaRepository<Onibus, Integer> {
}