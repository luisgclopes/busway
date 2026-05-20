package com.busway.controller;

import com.busway.dto.*;
import com.busway.model.Onibus;
import com.busway.model.Rota;
import com.busway.model.Viagem;
import com.busway.service.BuswayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BuswayController {

    @Autowired
    private BuswayService service;

    @GetMapping("/rotas")
    public ResponseEntity<List<Rota>> getRotas() {
        return ResponseEntity.ok(service.listarRotas());
    }

    @GetMapping("/onibus")
    public ResponseEntity<List<Onibus>> getOnibus() {
        return ResponseEntity.ok(service.listarOnibus());
    }

    @GetMapping("/viagens")
    public ResponseEntity<List<ViagemResponseDTO>> getViagens(
            @RequestParam String origem,
            @RequestParam String destino,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.buscarViagens(origem, destino, data));
    }

    @GetMapping("/admin/viagens")
    public ResponseEntity<List<Viagem>> listarViagensAdmin() {
        return ResponseEntity.ok(service.listarViagens());
    }

    @GetMapping("/viagens/{id}/poltronas-ocupadas")
    public ResponseEntity<List<Integer>> getPoltronasOcupadas(@PathVariable Integer id) {
        return ResponseEntity.ok(service.listarPoltronasOcupadas(id));
    }

    @PostMapping("/vendas")
    public ResponseEntity<?> realizarVenda(@RequestBody VendaRequestDTO request) {
        try {
            service.processarVenda(request);
            return ResponseEntity.ok(Map.of("sucesso", true));
        } catch (RuntimeException e) {
            if ("POLTRONA_JA_VENDIDA".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("erro", "A poltrona selecionada já foi vendida simultaneamente."));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/admin/onibus")
    public ResponseEntity<Onibus> cadastrarOnibus(@RequestBody OnibusRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarOnibus(request));
    }

    @PostMapping("/admin/rotas")
    public ResponseEntity<Rota> cadastrarRota(@RequestBody RotaRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarRota(request));
    }

    @PostMapping("/admin/viagens")
    public ResponseEntity<Viagem> cadastrarViagem(@RequestBody ViagemRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarViagem(request));
    }
}