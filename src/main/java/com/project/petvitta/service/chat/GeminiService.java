package com.project.petvitta.service.chat;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.project.petvitta.dto.HistoricoCompraDTO;
import com.project.petvitta.model.chat.Mensagem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String enviarMensagem(
            String mensagem,
            List<Mensagem> mensagens,
            List<HistoricoCompraDTO> historico,
            String recomendados
    ) {

        String historicoCompras = "";

        for (int i = 0; i < historico.size(); i++) {

            HistoricoCompraDTO pedido = historico.get(i);

            historicoCompras += "\nPedido: " + pedido.getCodigoPedido();
            historicoCompras += "\nData: " + pedido.getData();
            historicoCompras += "\nStatus: " + pedido.getStatus();

            historicoCompras += "\nProdutos comprados:\n";

            for (int j = 0; j < pedido.getProdutos().size(); j++) {
                historicoCompras += "- " + pedido.getProdutos().get(j) + "\n";
            }
        }

        String historicoConversa = "";

        for (int i = 0; i < mensagens.size(); i++) {

            Mensagem msg = mensagens.get(i);

            historicoConversa += msg.getRemetente()
                    + ": " + msg.getConteudo();

            if ("IA".equals(msg.getRemetente())
                    && msg.getAvaliacao() != null) {

                historicoConversa += "\nAvaliação do cliente: " + msg.getAvaliacao();
            }

            historicoConversa += "\n";
        }


        String prompt = """
        Você é a assistente virtual da PetVitta Club, uma loja virtual especializada em produtos para cães e gatos.

        Seu objetivo é ajudar os clientes a encontrar produtos adequados para seus animais.
        
        1. Atendimento
        - Responda em português brasileiro.
        - Utilize linguagem simples, educada e simpática.
        - Seja objetiva.
        - Considere o histórico da conversa e não repita perguntas já respondidas.
        - Quando faltar alguma informação, faça perguntas para entender o que o cliente procura.
        
        2. Produtos
        A loja comercializa três categorias:
        - Rações: seca, úmida, medicamentosa e natural.
        - Petiscos: bifinhos, biscoitos e snacks, molhos, ossos, petiscos cremosos e petiscos naturais.
        - Suplementos: cápsulas, comprimidos, líquidos, pó e tabletes mastigáveis.
        
        Recomende somente produtos dessas categorias
        
       3. Recomendações
                
       - O sistema possui um modelo de recomendação que seleciona produtos com base no histórico de compras, na popularidade e nas avaliações dos clientes.
       - Os produtos enviados na lista de recomendações foram previamente selecionados pelo modelo.
       - Sua responsabilidade é analisar a compatibilidade desses produtos com as necessidades do animal.
       - Utilize exclusivamente os produtos enviados na lista de recomendações.
       - Analise a espécie, idade e porte do animal.
       - Considere as preferências de marca e sabor.
       - Verifique as restrições alimentares e os ingredientes dos produtos.
       - Dê prioridade às restrições alimentares em relação às preferências.
       - Não interprete automaticamente "não pode comer carne" como "não pode consumir nenhum ingrediente de origem animal".
       - Quando uma restrição for ambígua, pergunte quais ingredientes ou tipos de carne devem ser evitados.
       - Não considere um produto compatível quando faltar informação essencial para verificar uma restrição.
       - Não invente características que não estejam presentes nos dados dos produtos.
       - Não substitua as recomendações por outros produtos do catálogo.
       - Recomende no máximo 3 produtos.
       - Se nenhum dos produtos disponíveis no modelo de recomendação for compatível com as necessidades e restrições do animal, não recomende nenhum produto. Informe claramente ao cliente que não foi encontrada uma opção adequada no catálogo da PetVitta.
    
       Explique brevemente por que cada produto foi selecionado.

       4. Identificação das necessidades
        Quando necessário, pergunte ao cliente:
        - Qual categoria e tipo de produto procura.
        - Se o produto é para cachorro ou gato.
        - Qual é a idade e o porte do animal.
        - Se possui preferências ou restrições alimentares.
        
        Faça perguntas naturalmente, uma de cada vez, aproveitando as respostas anteriores.
        
       5. Histórico do cliente
       
        - tilize o histórico de compras e as avaliações anteriores para compreender o contexto do cliente e adaptar suas respostas.
        - Não recomende um produto que o cliente já tenha comprado
        
        6. Orientações sobre saúde
        - Não realize diagnósticos.
        - Não prescreva tratamentos ou medicamentos.
        - Não prometa que um produto ou suplemento irá curar doenças.
        - Não indique suplementos como substitutos de tratamentos veterinários.
        - Quando o cliente mencionar doenças, sintomas ou condições de saúde, oriente-o a procurar um médico-veterinário.
        - Não indique produtos para tratar condições clínicas sem orientação veterinária.
        
        7. Limites do atendimento
        Responda somente sobre os produtos da PetVitta Club, suas características, recomendações e histórico de compras.
        
        Se o cliente perguntar sobre assuntos sem relação com a loja, responda:
        
        "Meu atendimento é voltado aos assuntos da PetVitta Club! 🐾 Posso ajudar você a encontrar rações, petiscos e suplementos para seu pet. Como posso ajudar?"
        
        8. Dados do cliente
        
        Histórico de compras:
        """ + historicoCompras + """
        
        Recomendações selecionadas pelo modelo:
        """ + recomendados + """
        
        9. Apresentação dos produtos
        - Apresente o nome do produto e explique brevemente por que ele pode ser uma opção adequada.
        - Informe o preço somente quando estiver disponível no catálogo.
        - Inclua um link clicável para a página de detalhes do produto.
        - Utilize o ID real do produto fornecido pelo catálogo.
        
        Formato do link:
        [Nome do produto](http://localhost:8080/cliente/detalhes-produto/ID)
        
        Nunca invente nomes, preços, características ou IDs.
        
        10. Histórico da conversa
        - Utilize as mensagens anteriores para manter o contexto, compreender respostas curtas e evitar perguntas repetidas.
        - Guarde e considere as informações sobre o pet fornecidas pelo cliente durante a conversa.
        - Registre informações como nome, espécie, raça, porte, idade, peso e restrições alimentares.
        - Utilize essas informações nas próximas interações para personalizar as recomendações de produtos.
        - Se o cliente informar uma nova característica ou corrigir uma informação, atualize o contexto e considere a informação mais recente.
        - Não pergunte novamente informações que o cliente já forneceu.
        
        """ + historicoConversa;

        System.out.println("\n========== PROMPT ENVIADO AO GEMINI ==========\n");

        System.out.println(prompt);

        System.out.println("\n========== FIM DO PROMPT ==========\n");

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

        return texto;
    }

    public String[] identificarBusca(String mensagem, List<Mensagem> mensagens) {

        String historico = "";

        for (int i = 0; i < mensagens.size(); i++) {
            historico += mensagens.get(i).getRemetente()
                    + ": " + mensagens.get(i).getConteudo() + "\n";
        }

        String prompt = """
        REGRAS:
        
        1. Analise a mensagem atual junto com o histórico completo.
        2. Recupere a categoria e o tipo mencionados anteriormente.
        3. Se o cliente mudar a categoria ou o tipo, considere a nova informação.
        4. A categoria é obrigatória.
        5. O tipo é opcional.
        6. Se o cliente não informar o tipo, retorne TIPO: null.
        7. Não peça esclarecimentos sobre o tipo quando ele não for informado.
        8. Se identificar a categoria, retorne ESCLARECER: false.
        9. Se não identificar a categoria, retorne ESCLARECER: true.
        10. Não confunda características do pet com categoria ou tipo.
        
        Considere também as informações do pet:
        - Espécie
        - Raça
        - Porte
        - Idade
        - Peso
        - Restrições alimentares
        
        Essas informações devem ser recuperadas do histórico, mas não devem ser utilizadas como categoria ou tipo.

        HISTÓRICO:
        """ + historico + """

        MENSAGEM ATUAL:
        """ + mensagem;

        GenerateContentResponse resposta =
                client.models.generateContent(
                        "gemini-3.5-flash-lite",
                        prompt,
                        null
                );

        String texto = resposta.text();

        if (texto == null || texto.isBlank()) {
            return new String[]{null, null, "true"};
        }

        String categoria = null;
        String tipo = null;
        String esclarecer = "true";

        String[] linhas = texto.split("\\R");

        for (int i = 0; i < linhas.length; i++) {

            int posicao = linhas[i].indexOf(":");

            if (posicao == -1) {
                continue;
            }

            String campo = linhas[i].substring(0, posicao).trim();
            String valor = linhas[i].substring(posicao + 1).trim();

            if ("null".equalsIgnoreCase(valor)) {
                valor = null;
            }

            if (campo.equalsIgnoreCase("CATEGORIA")) {
                categoria = valor;
            }

            if (campo.equalsIgnoreCase("TIPO")) {
                tipo = valor;
            }

            if (campo.equalsIgnoreCase("ESCLARECER")) {
                esclarecer = valor;
            }
        }

        // Somente categorias válidas podem realizar a busca.
        if (categoria == null
                || (!categoria.equalsIgnoreCase("Ração")
                && !categoria.equalsIgnoreCase("Petisco")
                && !categoria.equalsIgnoreCase("Suplemento"))) {

            categoria = null;
            tipo = null;
            esclarecer = "true";

        } else {
            esclarecer = "false";
        }

        return new String[]{
                categoria,
                tipo,
                esclarecer
        };
    }
}