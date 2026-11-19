package com.project.petvitta.model.chat;

import com.project.petvitta.model.cliente.Cliente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "Conversa")
public class Conversa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "conversa",
            cascade = CascadeType.ALL)
    private List<Mensagem> mensagens = new ArrayList<>();
}
