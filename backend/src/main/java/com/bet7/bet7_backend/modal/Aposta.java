package com.bet7.bet7_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "apostas")
@Data
public class Aposta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "time_a", nullable = false)
    private String timeA;

    @Column(name = "time_b", nullable = false)
    private String timeB;

    @Column(name = "liga")
    private String liga;

    // "A" = timeA, "B" = timeB, "D" = empate
    @Column(name = "escolha", nullable = false)
    private String escolha;

    @Column(name = "escolha_label")
    private String escolhaLabel;

    @Column(nullable = false)
    private Double odd;

    @Column(nullable = false)
    private Double valor;

    // "pending", "win", "loss"
    @Column(nullable = false)
    private String status = "pending";

    @Column(nullable = false)
    private Double ganho = 0.0;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "resolvido_em")
    private LocalDateTime resolvidoEm;
}