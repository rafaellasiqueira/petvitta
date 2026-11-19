package com.project.petvitta.repository.chat;

import com.project.petvitta.model.chat.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversaRepository extends JpaRepository<Conversa, Long> {

    Optional<Conversa> findByClienteId(Long clienteId);
}
