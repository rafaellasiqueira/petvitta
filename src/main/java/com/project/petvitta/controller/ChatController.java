package com.project.petvitta.controller;

import com.project.petvitta.dto.AvaliacaoChatbotDTO;
import com.project.petvitta.dto.HistoricoCompraDTO;
import com.project.petvitta.model.chat.Conversa;
import com.project.petvitta.model.chat.Mensagem;
import com.project.petvitta.service.ProdutoService;
import com.project.petvitta.service.chat.ConversaService;
import com.project.petvitta.service.chat.GeminiService;
import com.project.petvitta.service.pedido.PedidoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatController {

    private final GeminiService geminiService;
    private final PedidoService pedidoService;
    private final ConversaService conversaService;
    private final ProdutoService produtoService;

    public ChatController(GeminiService geminiService, PedidoService pedidoService, ConversaService conversaService, ProdutoService produtoService) {
        this.geminiService = geminiService;
        this.pedidoService = pedidoService;
        this.conversaService = conversaService;
        this.produtoService = produtoService;
    }

    @PostMapping("/mensagem")

    // Controla a resposta do navegador
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

            // Busca as últimas mensagens da conversa
            List<Mensagem> mensagens =
                    conversaService.buscarUltimasMensagens(conversa.getId());

            // Busca o histórico de compras do cliente
            List<HistoricoCompraDTO> historico =
                    pedidoService.buscarHistoricoCompras(clienteId);

            // Busca os produtos disponíveis no catálogo
            String produtos = produtoService.montarCatalogoParaGemini();

            // Envia as informações para o Gemini
            String resposta = geminiService.enviarMensagem(
                    mensagemChat.mensagem(),
                    mensagens,
                    historico,
                    produtos
            );

            // Salva a resposta da IA
            Mensagem mensagemSalva = conversaService.salvarMensagem(
                    conversa,
                    "IA",
                    resposta
            );

            return ResponseEntity.ok(
                    new RespostaChat(resposta, mensagemSalva.getId())
            );

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

    @PostMapping("/limpar")
    public ResponseEntity<Void> limparConversa(HttpSession session) {

        Long clienteId = (Long) session.getAttribute("clienteId");

        try {

            // Busca a conversa do cliente
            Conversa conversa = conversaService.buscarOuCriar(clienteId);

            // Limpa as mensagens da conversa
            conversaService.limparMensagens(conversa.getId());

            return ResponseEntity.noContent().build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/avaliacao")
    public ResponseEntity<Void> avaliarResposta(
            @RequestBody AvaliacaoChatbotDTO dto) {

        try {
            conversaService.avaliarMensagem(dto);

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public record MensagemChat(String mensagem) {}

    public record RespostaChat(
            String resposta,
            Long mensagemId
    ) {}
}