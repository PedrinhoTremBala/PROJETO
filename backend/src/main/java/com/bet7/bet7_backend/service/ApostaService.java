package com.bet7.bet7_backend.service;

import com.bet7.bet7_backend.model.Aposta;
import com.bet7.bet7_backend.model.Usuario;
import com.bet7.bet7_backend.repository.ApostaRepository;
import com.bet7.bet7_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ApostaService {

    @Autowired
    private ApostaRepository apostaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Aposta criarAposta(Usuario usuario, String timeA, String timeB,
                               String liga, String escolha, String escolhaLabel,
                               Double odd, Double valor) {

        if (valor < 1.0) throw new RuntimeException("Valor mínimo é 1 moeda.");
        if (usuario.getSaldo() < valor) throw new RuntimeException("Saldo insuficiente.");

        // Debita o saldo
        usuario.setSaldo(usuario.getSaldo() - valor);
        usuarioRepository.save(usuario);

        Aposta aposta = new Aposta();
        aposta.setUsuario(usuario);
        aposta.setTimeA(timeA);
        aposta.setTimeB(timeB);
        aposta.setLiga(liga);
        aposta.setEscolha(escolha);
        aposta.setEscolhaLabel(escolhaLabel);
        aposta.setOdd(odd);
        aposta.setValor(valor);
        aposta.setStatus("pending");
        aposta.setCriadoEm(LocalDateTime.now());

        Aposta salva = apostaRepository.save(aposta);

        // Resolve resultado após 8 segundos em thread separada
        resolverApostaAsync(salva.getId(), usuario.getId(), valor, odd);

        return salva;
    }

    @Async
    public void resolverApostaAsync(Long apostaId, Long usuarioId, Double valor, Double odd) {
        try {
            Thread.sleep(8000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Aposta aposta = apostaRepository.findById(apostaId).orElse(null);
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (aposta == null || usuario == null) return;

        boolean ganhou = new Random().nextBoolean();

        if (ganhou) {
            double ganho = Math.round(valor * odd * 100.0) / 100.0;
            aposta.setStatus("win");
            aposta.setGanho(ganho);
            usuario.setSaldo(Math.round((usuario.getSaldo() + ganho) * 100.0) / 100.0);
        } else {
            aposta.setStatus("loss");
            aposta.setGanho(-valor);
        }

        aposta.setResolvidoEm(LocalDateTime.now());
        apostaRepository.save(aposta);
        usuarioRepository.save(usuario);
    }

    public List<Aposta> listarPorUsuario(Long usuarioId) {
        return apostaRepository.findByUsuarioId(usuarioId);
    }

    public List<Aposta> listarPorStatus(Long usuarioId, String status) {
        return apostaRepository.findByUsuarioIdAndStatus(usuarioId, status);
    }
}