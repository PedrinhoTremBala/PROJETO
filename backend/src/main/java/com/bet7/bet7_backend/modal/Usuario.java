package com.bet7.bet7_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String cpf;

    @Column(nullable = false)
    private Integer idade;

    @Column(nullable = false)
    private Double saldo = 50.0;

    @Column(name = "firebase_uid", unique = true)
    private String firebaseUid;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}