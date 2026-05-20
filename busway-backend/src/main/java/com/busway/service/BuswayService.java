package com.busway.service;

import com.busway.dto.*;
import com.busway.model.*;
import com.busway.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuswayService {

    @Autowired
    private RotaRepository rotaRepository;

    @Autowired
    private ViagemRepository viagemRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private PassageiroRepository passageiroRepository;

    @Autowired
    private PoltronaRepository poltronaRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private OnibusRepository onibusRepository;

    public List<Rota> listarRotas() {
        return rotaRepository.findAll();
    }

    public List<Onibus> listarOnibus() {
        return onibusRepository.findAll();
    }

    public List<Viagem> listarViagens() {
        return viagemRepository.findAll();
    }

    public Rota cadastrarRota(RotaRequestDTO request) {
        Rota rota = new Rota();
        rota.setOrigem(request.getOrigem());
        rota.setDestino(request.getDestino());
        return rotaRepository.save(rota);
    }

    public Onibus cadastrarOnibus(OnibusRequestDTO request) {
        Onibus onibus = new Onibus();
        onibus.setPlaca(request.getPlaca());
        onibus.setCapacidade(request.getCapacidade());
        return onibusRepository.save(onibus);
    }

    public Viagem cadastrarViagem(ViagemRequestDTO request) {
        Rota rota = rotaRepository.findById(request.getId_rota())
                .orElseThrow(() -> new RuntimeException("Rota não encontrada"));

        Onibus onibus = onibusRepository.findById(request.getId_onibus())
                .orElseThrow(() -> new RuntimeException("Ônibus não encontrado"));

        Viagem viagem = new Viagem();
        viagem.setRota(rota);
        viagem.setOnibus(onibus);
        viagem.setData(request.getData());
        viagem.setHora(request.getHora());

        return viagemRepository.save(viagem);
    }

    public List<ViagemResponseDTO> buscarViagens(String origem, String destino, LocalDate data) {
        List<Viagem> viagens = viagemRepository.findByRotaAndData(origem, destino, data);

        return viagens.stream().map(v -> {
            ViagemResponseDTO dto = new ViagemResponseDTO();
            dto.setId_viagem(v.getIdViagem());
            dto.setHorario(v.getHora().toString());
            dto.setOnibus_placa(v.getOnibus().getPlaca());
            dto.setCapacidade(v.getOnibus().getCapacidade());
            dto.setValor(89.90);
            return dto;
        }).collect(Collectors.toList());
    }

    public List<Integer> listarPoltronasOcupadas(Integer idViagem) {
        return vendaRepository.findPoltronasOcupadasByViagem(idViagem);
    }

    @Transactional
    public Venda processarVenda(VendaRequestDTO request) {
        Viagem viagem = viagemRepository.findById(request.getId_viagem())
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        Poltrona poltrona = poltronaRepository.findByNumeroAndOnibus_IdOnibus(
                request.getNumero_poltrona(), viagem.getOnibus().getIdOnibus())
                .orElseThrow(() -> new RuntimeException("Poltrona inválida para este ônibus"));

        Passageiro passageiro = passageiroRepository.findByCpf(request.getPassageiro_cpf())
                .orElseGet(() -> {
                    Passageiro p = new Passageiro();
                    p.setCpf(request.getPassageiro_cpf());
                    p.setNome(request.getPassageiro_nome());
                    return passageiroRepository.save(p);
                });

        Funcionario func = funcionarioRepository.findById(request.getId_funcionario())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Venda venda = new Venda();
        venda.setViagem(viagem);
        venda.setPoltrona(poltrona);
        venda.setPassageiro(passageiro);
        venda.setFuncionario(func);
        venda.setPreco(request.getValor());
        venda.setDataVenda(LocalDateTime.now());

        try {
            return vendaRepository.save(venda);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("POLTRONA_JA_VENDIDA");
        }
    }
}