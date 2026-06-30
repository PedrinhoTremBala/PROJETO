package com.bet7.bet7_backend.controller;

import com.bet7.bet7_backend.model.Usuario;
import com.bet7.bet7_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Cadastro
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String cpf   = (String) body.get("cpf");

        if (usuarioRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(Map.of("erro", "E-mail já cadastrado."));

        if (usuarioRepository.existsByCpf(cpf))
            return ResponseEntity.badRequest().body(Map.of("erro", "CPF já cadastrado."));

        int idade = Integer.parseInt(body.get("idade").toString());
        if (idade < 18)
            return ResponseEntity.badRequest().body(Map.of("erro", "Você deve ter mais de 18 anos."));

        Usuario u = new Usuario();
        u.setNome((String) body.get("nome"));
        u.setEmail(email);
        u.setSenha((String) body.get("senha")); // Em prod: usar BCrypt
        u.setCpf(cpf);
        u.setIdade(idade);
        u.setFirebaseUid((String) body.get("firebaseUid"));
        u.setSaldo(50.0); // Bônus de boas-vindas

        Usuario salvo = usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of(
            "id",     salvo.getId(),
            "nome",   salvo.getNome(),
            "email",  salvo.getEmail(),
            "saldo",  salvo.getSaldo()
        ));
    }

    // Login por Firebase UID
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String firebaseUid = body.get("firebaseUid");
        Optional<Usuario> opt = usuarioRepository.findByFirebaseUid(firebaseUid);

        if (opt.isEmpty())
            return ResponseEntity.status(404).body(Map.of("erro", "Usuário não encontrado."));

        Usuario u = opt.get();
        return ResponseEntity.ok(Map.of(
            "id",    u.getId(),
            "nome",  u.getNome(),
            "email", u.getEmail(),
            "saldo", u.getSaldo(),
            "cpf",   u.getCpf()
        ));
    }
}