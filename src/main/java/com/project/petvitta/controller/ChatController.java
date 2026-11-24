
package com.project.petvitta.controller;

import com.project.petvitta.dto.AvaliacaoChatbotDTO;
import com.project.petvitta.dto.HistoricoCompraDTO;
import com.project.petvitta.model.chat.Conversa;
import com.project.petvitta.model.chat.Mensagem;
import com.project.petvitta.service.ProdutoService;
import com.project.petvitta.service.chat.ConversaService;
import com.project.petvitta.service.chat.GeminiService;
import com.project.petvitta.service.pedido.PedidoService;
import com.project.petvitta.service.treinamento.RecomendacaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ChatController {

    private final GeminiService geminiService;
    private final PedidoService pedidoService;
    private final ConversaService conversaService;
    private final ProdutoService produtoService;
    private final RecomendacaoService recomendacaoService;

    public ChatController(
            GeminiService geminiService,
            PedidoService pedidoService,
            ConversaService conversaService,
            ProdutoService produtoService,
            RecomendacaoService recomendacaoService
    ) {
        this.geminiService = geminiService;
        this.pedidoService = pedidoService;
        this.conversaService = conversaService;
        this.produtoService = produtoService;
        this.recomendacaoService = recomendacaoService;
    }

    @PostMapping("/api/chatbot/mensagem")
    public ResponseEntity<RespostaChat> enviarMensagem(
            @RequestBody MensagemChat mensagemChat,
            HttpSession session
    ) {
        Long clienteId = (Long) session.getAttribute("clienteId");

        try {
            // Busca ou cria uma conversa
            Conversa conversa = conversaService.buscarOuCriar(clienteId);

            // Salva a mensagem do cliente
            conversaService.salvarMensagem(
                    conversa,
                    "CLIENTE",
                    mensagemChat.mensagem()
            );

            // Busca as mensagens da conversa
            List<Mensagem> mensagens = conversaService.buscarMensagens(conversa.getId());

            // Busca o histórico de compras do cliente
            List<HistoricoCompraDTO> historico = pedidoService.buscarHistoricoCompras(clienteId);

            // Identifica as informações da busca utilizando o Gemini
            String[] busca = geminiService.identificarBusca(
                    mensagemChat.mensagem(),
                    mensagens
            );

            String categoria = busca[0];
            String tipo = busca[1];
            String esclarecer = busca[2];
            String especie = busca[3];
            String porte   = busca[4];
            String faixa   = busca[5];
            String gluten  = busca[6];
            String produto = busca[7];

            String recomendados;

            if (produto != null) {
                recomendados = "Resultado da busca pelo nome (o cliente procura este produto específico):\n" + recomendacaoService.textoBusca(produto);

            } else if ("true".equalsIgnoreCase(esclarecer)) {
                recomendados = "A busca do cliente precisa de mais informações.";

            } else {
                recomendados = recomendacaoService.textoRecomendacoes(clienteId, 30, categoria, tipo, especie, porte, faixa, gluten);
            }

            // Envia as informações para o Gemini
            String resposta = geminiService.enviarMensagem(
                    mensagemChat.mensagem(),
                    mensagens,
                    historico,
                    recomendados
            );

            // Salva a resposta da IA
            Mensagem mensagemSalva = conversaService.salvarMensagem(
                    conversa,
                    "IA",
                    resposta
            );

            return ResponseEntity.ok(new RespostaChat(resposta, mensagemSalva.getId()));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    new RespostaChat(
                            "Desculpe, não consegui responder agora. Tente novamente!",
                            null
                    )
            );
        }
    }

    @PostMapping("/api/chatbot/limpar")
    public ResponseEntity<MensagemRequisicao> limparConversa(
            HttpSession session
    ) {
        try {
            Long clienteId = (Long) session.getAttribute("clienteId");

            Conversa conversa = conversaService.buscarOuCriar(clienteId);

            conversaService.limparMensagens(conversa.getId());

            return ResponseEntity.ok(new MensagemRequisicao("Conversa limpa com sucesso!"));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(new MensagemRequisicao(
                            "Não foi possível limpar a conversa. Tente novamente!"
                    ));
        }
    }

    @PostMapping("/api/chatbot/avaliacao")
    public ResponseEntity<MensagemRequisicao> avaliarResposta(
            @RequestBody AvaliacaoChatbotDTO dto
    ) {

        try {
            conversaService.avaliarMensagem(dto);

            try {
                recomendacaoService.treinar();
            } catch (Exception ex) {
                ex.printStackTrace();
            }

            return ResponseEntity.ok(new MensagemRequisicao("Avaliação registrada com sucesso!"));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(new MensagemRequisicao(e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(new MensagemRequisicao(
                            "Erro ao registrar a avaliação."
                    ));
        }
    }

    public record MensagemChat(String mensagem) {}

    public record RespostaChat(
            String resposta,
            Long mensagemId
    ) {}

    public record MensagemRequisicao(
            String mensagem
    ) {}
}
