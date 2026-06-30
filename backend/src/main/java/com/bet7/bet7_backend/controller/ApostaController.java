package com.bet7.bet7_backend.controller;

import com.bet7.bet7_backend.model.Aposta;
import com.bet7.bet7_backend.model.Usuario;
import com.bet7.bet7_backend.repository.UsuarioRepository;
import com.bet7.bet7_backend.service.ApostaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/apostas")
public class ApostaController {

    @Autowired
    private ApostaService apostaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Criar aposta
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        Long usuarioId = Long.parseLong(body.get("usuarioId").toString());
        Optional<Usuario> opt = usuarioRepository.findById(usuarioId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado."));

        try {
            Aposta aposta = apostaService.criarAposta(
                opt.get(),
                (String) body.get("timeA"),
                (String) body.get("timeB"),
                (String) body.get("liga"),
                (String) body.get("escolha"),
                (String) body.get("escolhaLabel"),
                Double.parseDouble(body.get("odd").toString()),
                Double.parseDouble(body.get("valor").toString())
            );
            return ResponseEntity.ok(Map.of(
                "id",          aposta.getId(),
                "status",      aposta.getStatus(),
                "odd",         aposta.getOdd(),
                "valor",       aposta.getValor(),
                "escolhaLabel",aposta.getEscolhaLabel(),
                "mensagem",    "Aposta realizada! Resultado em 8 segundos."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Listar todas as apostas do usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Aposta>> listar(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(apostaService.listarPorUsuario(usuarioId));
    }

    // Listar por status: pending, win, loss
    @GetMapping("/usuario/{usuarioId}/status/{status}")
    public ResponseEntity<List<Aposta>> listarPorStatus(
            @PathVariable Long usuarioId,
            @PathVariable String status) {
        return ResponseEntity.ok(apostaService.listarPorStatus(usuarioId, status));
    }
}