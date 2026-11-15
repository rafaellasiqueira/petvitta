package com.project.petvitta.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String enviarMensagem(String mensagem) {

        long inicio = System.currentTimeMillis();

        String prompt = """
                Você é a assistente virtual da PetVitta Club,
                uma loja virtual de produtos para cães e gatos.

                Suas responsabilidades:
                - Ajudar clientes com dúvidas sobre produtos.
                - Conversar de maneira educada e simpática.
                - Utilizar linguagem simples.
                - Responder em português brasileiro.
                - Ajudar com dúvidas sobre rações, petiscos e suplementos.

                Importante:
                - Não invente produtos, preços ou disponibilidade.
                - Se não souber uma informação, informe ao cliente.
                - Não substitua a orientação de um veterinário.
                - Seja objetiva e evite respostas muito longas.

                Mensagem do cliente:
                """ + mensagem;

        try {

            System.out.println("Enviando mensagem para Gemini...");

            GenerateContentResponse resposta =
                    client.models.generateContent(
                            "gemini-3.5-flash-lite",
                            prompt,
                            null
                    );

            String texto = resposta.text();

            if (texto == null || texto.isBlank()) {
                throw new IllegalArgumentException(
                        "O Gemini não retornou uma resposta válida."
                );
            }

            long fim = System.currentTimeMillis();

            System.out.println("Gemini respondeu!");
            System.out.println("Tempo de resposta: "
                    + (fim - inicio) + " ms");

            return texto;

        } catch (Exception e) {

            System.out.println("Erro ao consultar Gemini: "
                    + e.getMessage());

            throw e;
        }
    }
}
