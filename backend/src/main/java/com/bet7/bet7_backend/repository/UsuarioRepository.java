package com.bet7.bet7_backend.repository;

import com.bet7.bet7_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}