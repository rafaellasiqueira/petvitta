package com.project.petvitta.service.chat;

import com.project.petvitta.dto.AvaliacaoChatbotDTO;
import com.project.petvitta.model.chat.Conversa;
import com.project.petvitta.model.chat.Mensagem;
import com.project.petvitta.repository.chat.ConversaRepository;
import com.project.petvitta.repository.chat.MensagemRepository;
import com.project.petvitta.repository.cliente.ClienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ConversaService {

    private final MensagemRepository mensagemRepository;
    private final ConversaRepository conversaRepository;
    private final ClienteRepository clienteRepository;

    public ConversaService(MensagemRepository mensagemRepository, ConversaRepository conversaRepository, ClienteRepository clienteRepository) {
        this.mensagemRepository = mensagemRepository;
        this.conversaRepository = conversaRepository;
        this.clienteRepository = clienteRepository;
    }

    public Conversa buscarOuCriar(Long clienteId) {

        Optional<Conversa> conversaOpcional = conversaRepository.findByClienteId(clienteId);

        if (conversaOpcional.isPresent()) {
            return conversaOpcional.get();
        } else {
            Conversa conversa = new Conversa();

            conversa.setCliente(clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado")));

            conversa.setDataCriacao(LocalDateTime.now());

            return conversaRepository.save(conversa);
        }
    }

    public Mensagem salvarMensagem(
            Conversa conversa,
            String remetente,
            String conteudo) {

        Mensagem mensagem = new Mensagem();

        mensagem.setConversa(conversa);
        mensagem.setRemetente(remetente);
        mensagem.setConteudo(conteudo);
        mensagem.setDataEnvio(LocalDateTime.now());

        return mensagemRepository.save(mensagem);
    }

    public List<Mensagem> buscarMensagens(Long conversaId) {

        List<Mensagem> mensagens = mensagemRepository.findByConversaIdOrderByDataEnvioAsc(conversaId);

        return mensagens;
    }

    @Transactional
    public void limparMensagens(Long conversaId) {

        Conversa conversa = conversaRepository.findById(conversaId)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada."));

        // Excluir as mensagens da conversa
        mensagemRepository.deleteByConversa_Id(conversaId);

        // Excluir o registro da conversa
        conversaRepository.delete(conversa);
    }

    @Transactional
    public void avaliarMensagem(AvaliacaoChatbotDTO dto) {

        Mensagem mensagem = mensagemRepository.findById(dto.getMensagemId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Mensagem não encontrada."
                ));

        if (!"Útil".equals(dto.getAvaliacao())
                && !"Não útil".equals(dto.getAvaliacao())) {

            throw new IllegalArgumentException(
                    "Avaliação inválida."
            );
        }

        mensagem.setAvaliacao(dto.getAvaliacao());

        mensagemRepository.save(mensagem);
    }


}
