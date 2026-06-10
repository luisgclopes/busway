package com.busway.controller;

import com.busway.dto.*;
import com.busway.model.Onibus;
import com.busway.model.Rota;
import com.busway.model.Viagem;
import com.busway.repository.FuncionarioRepository;
import com.busway.service.BuswayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BuswayController {

    private static final String SESSION_USER = "usuarioLogado";

    @Autowired
    private BuswayService service;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO req, HttpServletRequest request) {
        return funcionarioRepository
            .findByLoginAndSenha(req.getLogin(), req.getSenha())
            .map(f -> {
                HttpSession session = request.getSession(true);
                session.setAttribute(SESSION_USER, new LoginResponseDTO(f.getIdFuncionario(), f.getNome(), f.getCargo()));
                return ResponseEntity.ok((Object) new LoginResponseDTO(f.getIdFuncionario(), f.getNome(), f.getCargo()));
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Login ou senha incorretos.")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object usuario = session.getAttribute(SESSION_USER);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Sessão expirada."));
        }
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("sucesso", true));
    }

    @GetMapping("/rotas")
    public ResponseEntity<List<Rota>> getRotas() {
        return ResponseEntity.ok(service.listarRotas());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/rotas")
    public ResponseEntity<Rota> cadastrarRota(@RequestBody RotaRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarRota(request));
    }

    @GetMapping("/onibus")
    public ResponseEntity<List<Onibus>> getOnibus() {
        return ResponseEntity.ok(service.listarOnibus());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/onibus")
    public ResponseEntity<Onibus> cadastrarOnibus(@RequestBody OnibusRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarOnibus(request));
    }

    @GetMapping("/viagens")
    public ResponseEntity<List<ViagemResponseDTO>> getViagens(
            @RequestParam String origem,
            @RequestParam String destino,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.buscarViagens(origem, destino, data));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/viagens")
    public ResponseEntity<List<Viagem>> listarViagensAdmin() {
        return ResponseEntity.ok(service.listarViagens());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/viagens")
    public ResponseEntity<Viagem> cadastrarViagem(@RequestBody ViagemRequestDTO request) {
        return ResponseEntity.ok(service.cadastrarViagem(request));
    }

    @GetMapping("/viagens/{id}/poltronas-ocupadas")
    public ResponseEntity<List<Integer>> getPoltronasOcupadas(@PathVariable Integer id) {
        return ResponseEntity.ok(service.listarPoltronasOcupadas(id));
    }

    @PostMapping("/vendas")
    public ResponseEntity<?> realizarVenda(@RequestBody VendaRequestDTO request, HttpSession session) {
        try {
            LoginResponseDTO usuario = (LoginResponseDTO) session.getAttribute(SESSION_USER);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Sessão expirada."));
            }

            request.setId_funcionario(usuario.getIdFuncionario());
            service.processarVenda(request);
            return ResponseEntity.ok(Map.of("sucesso", true));
        } catch (RuntimeException e) {
            if ("POLTRONA_JA_VENDIDA".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", "A poltrona selecionada já foi vendida simultaneamente."));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }
}