package com.project.petvitta.model.chat;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "Mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String remetente;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(length = 10)
    private String avaliacao;

    @Column(nullable = false)
    private LocalDateTime dataEnvio;

    @ManyToOne
    @JoinColumn(name = "conversa_id")
    private Conversa conversa;








}
