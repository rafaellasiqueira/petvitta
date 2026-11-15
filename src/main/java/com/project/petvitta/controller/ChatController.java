package com.project.petvitta.controller;

import com.project.petvitta.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/mensagem")
    public ResponseEntity<RespostaChat> enviarMensagem(
            @RequestBody MensagemChat mensagemChat) {

        System.out.println("1 - Controller recebeu a mensagem");

        try {

            System.out.println("2 - Chamando GeminiService");

            String resposta = geminiService.enviarMensagem(
                    mensagemChat.mensagem()
            );

            System.out.println("3 - Gemini respondeu: " + resposta);

            return ResponseEntity.ok(new RespostaChat(resposta));

        } catch (Exception e) {

            System.out.println("4 - Erro: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    new RespostaChat(
                            "Desculpe, não consegui responder agora. Tente novamente!"
                    )
            );
        }
    }

    public record MensagemChat(String mensagem) {}

    public record RespostaChat(String resposta) {}
}