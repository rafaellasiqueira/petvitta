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
        - Cumprimente apenas na primeira mensagem da conversa.
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
- Os produtos da lista "Recomendações selecionadas pelo modelo" já foram filtrados pelo sistema por espécie, porte, faixa etária, glúten e estoque. Não confira esses itens de novo.
- Todos os produtos da lista já são compatíveis com o pet. Recomende todos eles (no máximo 3), sem descartar nenhum por conta própria, exceto se o cliente informou uma restrição de ingrediente ou sabor.
- Explique em uma frase por que cada produto combina com o pet.
- Se o cliente pediu um sabor, confira o campo "Sabores" do produto (não deduza o sabor pela composição nutricional) e recomende só os que tiverem esse sabor.
- Se o cliente informou uma restrição de ingrediente (ex.: não pode frango), confira a composição e não recomende produtos que o contenham. Se a restrição for ambígua (ex.: "não pode carne"), pergunte quais ingredientes evitar.
- Se faltar informação para confirmar que um produto é seguro, não o recomende.
- Nunca invente produtos, características, preços ou IDs.
- Apresente somente os produtos que você está recomendando. Nunca mencione, comente ou explique produtos que ficaram de fora e não escreva notas, observações ou comentários entre parênteses sobre outros produtos do catálogo. Se o cliente perguntar por que algum produto não foi indicado, diga que as opções já vêm filtradas pelo sistema e ofereça mostrar outras.
- Se nenhum produto da lista servir, diga que não encontrou uma opção adequada no catálogo da PetVitta.
- Antes de recomendar, confirme que você já sabe a espécie, a idade, o porte e se o pet tem restrição alimentar. Se faltar algo, pergunte uma coisa por vez e não recomende ainda.

       4. Identificação das necessidades
        Quando necessário, pergunte ao cliente:
        - Qual categoria e tipo de produto procura.
        - Se o produto é para cachorro ou gato.
        - Qual é a idade e o porte do animal.
        - Se possui preferências ou restrições alimentares.
        
        Faça perguntas naturalmente, uma de cada vez, aproveitando as respostas anteriores.
        
5. Histórico do cliente
- Use o histórico de compras só como indício (ex.: muitas rações de cães sugerem que o cliente tem um cachorro) e confirme com o cliente em caso de dúvida.
- Identifique, quando possível, as seguintes preferências:
  - Espécie do animal: cachorro ou gato.
  - Categoria mais comprada: ração, petisco ou suplemento.
  - Tipo de produto mais comprado.
  - Marcas que aparecem com maior frequência.
  - Sabores mais comprados.
  - Faixa etária e porte indicados nos produtos adquiridos.
- Não recomende produtos que o cliente já comprou.
- Prefira produtos parecidos com os que ele costuma comprar (marca, sabor), mas nunca descarte um produto só por ser de outra marca ou sabor.
 Se o histórico incluir produtos para condições específicas (obesidade, recuperação, medicamentosa), não recomende produtos que contrariem essa condição (ex.: hipercalórico para quem compra ração de obesidade). Pergunte ao cliente e oriente a consultar o veterinário.
 
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
        - Termine a resposta apenas com a lista dos produtos e uma pergunta curta. Não escreva "Nota:" nem observações adicionais.
        
        Formato do link:
        [Nome do produto](http://localhost:8080/cliente/detalhes-produto/ID)
        
        Nunca invente nomes, preços, características ou IDs.
        
10. Histórico da conversa
- Use as mensagens anteriores para manter o contexto e não pergunte de novo o que o cliente já informou.
- Se o cliente corrigir uma informação, considere a mais recente.

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
    Analise a mensagem atual junto com o histórico completo.

    REGRAS:
    1. Identifique a categoria que o cliente deseja consultar.
    2. Recupere a última categoria informada pelo CLIENTE.
    3. Se o cliente mudar de categoria, considere a nova.
    4. Se o cliente apenas informar características do pet, mantenha a categoria anterior.
    5. As categorias válidas são: Ração, Petisco e Suplemento.
    6. O tipo é opcional. Se não for informado, retorne null.
    7. Não peça esclarecimentos sobre o tipo.
    8. Se encontrar uma categoria no histórico ou na mensagem atual, retorne ESCLARECER: false.
    9. Se não encontrar nenhuma categoria, retorne CATEGORIA: null e ESCLARECER: true.
    10. Não confunda espécie, idade, porte ou restrições alimentares com categoria.
    


Retorne exclusivamente neste formato:
CATEGORIA: valor
TIPO: valor
ESCLARECER: valor
ESPECIE: Cachorro, Gato ou null
PORTE: Pequeno, Médio, Grande ou null
FAIXA: Filhote, Adulto, Idoso ou null
GLUTEN: SEM se o cliente disse que o pet não pode glúten, senão null

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

        System.out.println("========== IDENTIFICAÇÃO DA BUSCA ==========");
        System.out.println(texto);

        String categoria = null;
        String tipo = null;
        String especie = null, porte = null, faixa = null, gluten = null;

        if (texto != null && !texto.isBlank()) {

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

                if (campo.equalsIgnoreCase("ESPECIE")) especie = valor;
                if (campo.equalsIgnoreCase("PORTE")) porte = valor;
                if (campo.equalsIgnoreCase("FAIXA")) faixa = valor;
                if (campo.equalsIgnoreCase("GLUTEN")) gluten = valor;

            }
        }

        // Verifica se a categoria retornada é válida.
        if (!categoriaValida(categoria)) {

            // Recupera a última categoria informada pelo cliente.
            for (int i = mensagens.size() - 1; i >= 0; i--) {

                Mensagem msg = mensagens.get(i);

                if (!"CLIENTE".equalsIgnoreCase(msg.getRemetente())) {
                    continue;
                }

                String conteudo = msg.getConteudo().toLowerCase();

                if (conteudo.contains("ração")
                        || conteudo.contains("rações")) {

                    categoria = "Ração";
                    break;

                } else if (conteudo.contains("petisco")
                        || conteudo.contains("petiscos")) {

                    categoria = "Petisco";
                    break;

                } else if (conteudo.contains("suplemento")
                        || conteudo.contains("suplementos")) {

                    categoria = "Suplemento";
                    break;
                }
            }
        }

        if (!categoriaValida(categoria)) {
            return new String[]{null, null, "true", null, null, null, null};
        }

        return new String[]{categoria, tipo, "false", especie, porte, faixa, gluten};
    }

    private boolean categoriaValida(String categoria) {

        return categoria != null
                && (categoria.equalsIgnoreCase("Ração")
                || categoria.equalsIgnoreCase("Petisco")
                || categoria.equalsIgnoreCase("Suplemento"));
    }

}