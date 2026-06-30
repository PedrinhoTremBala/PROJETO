package com.bet7.bet7_backend.controller;

import com.bet7.bet7_backend.model.Usuario;
import com.bet7.bet7_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Usuario u = opt.get();
        return ResponseEntity.ok(Map.of(
            "id",    u.getId(),
            "nome",  u.getNome(),
            "email", u.getEmail(),
            "saldo", u.getSaldo(),
            "cpf",   u.getCpf()
        ));
    }

    // Atualizar nome ou senha
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Usuario u = opt.get();
        if (body.containsKey("nome"))  u.setNome(body.get("nome"));
        if (body.containsKey("senha")) u.setSenha(body.get("senha"));

        usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of("mensagem", "Atualizado com sucesso."));
    }

    // Depositar (adiciona saldo)
    @PostMapping("/{id}/depositar")
    public ResponseEntity<?> depositar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        double valor = Double.parseDouble(body.get("valor").toString());
        if (valor < 20) return ResponseEntity.badRequest().body(Map.of("erro", "Depósito mínimo é R$ 20."));

        Usuario u = opt.get();
        u.setSaldo(Math.round((u.getSaldo() + valor) * 100.0) / 100.0);
        usuarioRepository.save(u);

        return ResponseEntity.ok(Map.of(
            "saldo",    u.getSaldo(),
            "mensagem", "Depósito realizado com sucesso."
        ));
    }

    // Saque
    @PostMapping("/{id}/sacar")
    public ResponseEntity<?> sacar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        double valor = Double.parseDouble(body.get("valor").toString());
        Usuario u = opt.get();

        if (valor < 1)           return ResponseEntity.badRequest().body(Map.of("erro", "Mínimo 1 moeda."));
        if (valor > u.getSaldo()) return ResponseEntity.badRequest().body(Map.of("erro", "Saldo insuficiente."));

        u.setSaldo(Math.round((u.getSaldo() - valor) * 100.0) / 100.0);
        usuarioRepository.save(u);

        return ResponseEntity.ok(Map.of(
            "saldo",    u.getSaldo(),
            "mensagem", "Solicitação de saque enviada. Em até 24h você receberá uma resposta."
        ));
    }

    // Excluir conta
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) return ResponseEntity.notFound().build();
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Conta excluída com sucesso."));
    }
}