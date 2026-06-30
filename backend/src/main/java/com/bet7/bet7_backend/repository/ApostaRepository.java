package com.bet7.bet7_backend.repository;

import com.bet7.bet7_backend.model.Aposta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApostaRepository extends JpaRepository<Aposta, Long> {
    List<Aposta> findByUsuarioId(Long usuarioId);
    List<Aposta> findByUsuarioIdAndStatus(Long usuarioId, String status);
}