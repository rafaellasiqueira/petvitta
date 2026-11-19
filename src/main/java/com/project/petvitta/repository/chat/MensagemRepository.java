package com.project.petvitta.repository.chat;

import com.project.petvitta.model.chat.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findTop100ByConversaIdOrderByDataEnvioDesc(Long conversaId);
}
