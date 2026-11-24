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

            if ("IA".equals(msg.getRemetente()) && msg.getAvaliacao() != null) {
                historicoConversa += "\nAvaliação do cliente: " + msg.getAvaliacao();
            }

            historicoConversa += "\n";
        }


        String prompt = """
        Você é a assistente virtual da PetVitta Club, loja virtual de produtos para cães e gatos.
        Ajude o cliente a encontrar produtos adequados ao pet.
        
        1. Atendimento
        - Responda em português brasileiro, de forma simples, simpática e objetiva.
        - Cumprimente apenas no início da conversa.
        - Use o histórico da conversa e não repita perguntas já respondidas. Se o cliente corrigir algo, vale a informação mais recente.
        - Faça uma pergunta por vez.
        
        2. Produtos
        A loja vende somente:
        - Rações: seca, úmida, medicamentosa e natural.
        - Petiscos: bifinhos, biscoitos e snacks, molhos, ossos, cremosos e naturais.
        - Suplementos: cápsulas, comprimidos, líquidos, pó e tabletes mastigáveis.
        Use somente os dados dos produtos fornecidos abaixo. Nunca invente produtos, características, preços ou IDs.
        
        3. Recomendação (quando o cliente pede uma indicação)
        - Antes de recomendar, confirme espécie, idade, porte e se há restrição alimentar. Se faltar algo, pergunte e não recomende ainda.
        - Os produtos da lista já foram filtrados pelo sistema (espécie, porte, faixa etária, glúten e estoque). Recomende todos (no máximo 3), explicando em uma frase por que combinam com o pet.
        - Sabor: confira o campo "Sabores" (não deduza pela composição) e recomende só os que tiverem o sabor pedido.
        - Restrição de ingrediente: confira a composição e não recomende produtos que o contenham. Se a restrição for ambígua (ex.: "não pode carne"), pergunte quais ingredientes evitar. Se faltar informação para garantir que o produto é seguro, não o recomende.
        - Apresente só os produtos recomendados. Não comente produtos que ficaram de fora nem escreva notas ou observações. Se perguntarem por que um produto não foi indicado, diga que as opções já vêm filtradas pelo sistema e ofereça outras.
        - Se nenhum produto servir, diga que não encontrou uma opção adequada no catálogo da PetVitta.
        - Recomende até 3 produtos, priorizando os que mais combinam com o histórico e as preferências do cliente.
        
        4. Busca por nome e dúvidas sobre produtos
        - Se a lista começar com "RESULTADO DA BUSCA PELO NOME", o cliente procura um produto específico: apresente os produtos encontrados com link e preço de cada tamanho, sem exigir espécie, idade ou porte e sem aplicar a regra de não indicar produtos já comprados.
        - Se a lista disser que nenhum produto foi encontrado, informe isso e ofereça ajuda para buscar outro.
        - Perguntas sobre características (sabor, grão, composição, glúten, transgênico, espécie, porte, tamanhos, preços, estoque) são respondidas só com os dados da lista, sem exigir espécie, idade ou porte.
        - Para quantidade diária, use a tabela "Quantidade recomendada" conforme o peso do pet informado.
        - Se a informação não estiver na lista, diga que não encontrou esse dado no catálogo. Não deduza o que não estiver informado.
        
        5. Histórico de compras
        - Analise o histórico de compras para tentar identificar a espécie, idade, porte e os sabores preferidos do pet. Use os produtos comprados como pistas e confirme com o cliente antes de recomendar. Se não conseguir identificar, pergunte diretamente.
        - Nas recomendações, não indique produtos que o cliente já comprou e prefira marca e sabor parecidos com os que ele costuma comprar, sem descartar outros por isso.
        - Se o histórico incluir produtos para uma condição específica (obesidade, recuperação, medicamentosa), não recomende produtos que a contrariem. Pergunte ao cliente e oriente a consultar o veterinário.
        
        6. Saúde
        - Não faça diagnósticos, não prescreva tratamentos ou medicamentos e não prometa que um produto cura doenças.
        - Suplementos não substituem tratamento veterinário.
        - Se o cliente falar de doenças, sintomas ou condições de saúde, oriente a procurar um médico-veterinário e não indique produtos para tratá-las.
        
        7. Limites
        Responda somente sobre a PetVitta Club: produtos, recomendações e histórico de compras. Para qualquer outro assunto, responda:
        "Meu atendimento é voltado aos assuntos da PetVitta Club! 🐾 Posso ajudar você a encontrar rações, petiscos e suplementos para seu pet. Como posso ajudar?"
        
        8. Dados do cliente
        
        Histórico de compras:
        """ + historicoCompras + """
        
        Produtos disponíveis:
        """ + recomendados + """
        
        9. Formato da resposta
        - Para cada produto: nome, uma frase explicando por que é uma boa opção, preço (só se estiver no catálogo) e link com o ID real do produto.
        - Formato do link: [Nome do produto](http://localhost:8080/cliente/detalhes-produto/ID)
        - Termine apenas com a lista dos produtos e uma pergunta curta, sem "Nota:" nem observações.
        
        10. Histórico da conversa
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
        Analise a mensagem atual junto com o histórico da conversa.
        
        REGRAS:
        1. Categorias válidas: Ração, Petisco e Suplemento.
        2. Use a última categoria informada pelo CLIENTE. Se ele mudar de categoria, use a nova. Se ele só informar características do pet, mantenha a anterior.
        3. Não confunda espécie, idade, porte ou restrições alimentares com categoria.
        4. Se houver categoria (na mensagem ou no histórico), ESCLARECER: false. Se não houver nenhuma, CATEGORIA: null e ESCLARECER: true.
        5. TIPO é opcional: se não for informado, retorne null e não peça esclarecimento sobre ele.
        
        BUSCA POR PRODUTO:
        6. Se o cliente pedir um produto específico pelo nome ou marca (ex.: "tem ração Golden?", "quero o Bifinho X"), preencha PRODUTO somente com o nome/marca citado, sem palavras como "tem", "quero", espécie, idade ou porte. Nesse caso, ESCLARECER: false mesmo sem categoria.
        7. Se o cliente continuar perguntando sobre o produto buscado antes (ex.: "tem em 12 kg?", "tem glúten?"), mantenha o mesmo PRODUTO do histórico.
        8. Nos outros casos, PRODUTO: null.
        
        Retorne exclusivamente neste formato:
        CATEGORIA: valor
        TIPO: valor
        ESCLARECER: valor
        ESPECIE: Cachorro, Gato ou null
        PORTE: Pequeno, Médio, Grande ou null
        FAIXA: Filhote, Adulto, Idoso ou null
        GLUTEN: SEM se o cliente disse que o pet não pode glúten, senão null
        PRODUTO: nome ou marca do produto buscado, ou null
        
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

        String categoria = null, tipo = null, especie = null, porte = null, faixa = null, gluten = null, produto = null;

        if (texto != null && !texto.isBlank()) {

            // Separando por linhas
            String[] linhas = texto.split("\\R");

            for (int i = 0; i < linhas.length; i++) {
                int posicao = linhas[i].indexOf(":");

                // index retorna - 1 qndo nao encontrado
                if (posicao == -1) {
                    continue;
                }

                String campo = linhas[i].substring(0, posicao).trim();
                String valor = linhas[i].substring(posicao + 1).trim();

                if ("null".equalsIgnoreCase(valor)) {
                    valor = null;
                }

                if (campo.equalsIgnoreCase("CATEGORIA")) {categoria = valor;}
                if (campo.equalsIgnoreCase("TIPO")) {tipo = valor;}
                if (campo.equalsIgnoreCase("ESPECIE")) especie = valor;
                if (campo.equalsIgnoreCase("PORTE")) porte = valor;
                if (campo.equalsIgnoreCase("FAIXA")) faixa = valor;
                if (campo.equalsIgnoreCase("GLUTEN")) gluten = valor;
                if (campo.equalsIgnoreCase("PRODUTO")) produto = valor;
            }
        }

        // Verifica se a categoria retornada é válida.
        if (!categoriaValida(categoria)) {

            for (int i = mensagens.size() - 1; i >= 0; i--) {
                Mensagem msg = mensagens.get(i);

                if (!"CLIENTE".equalsIgnoreCase(msg.getRemetente())) {
                    continue;
                }

                String conteudo = msg.getConteudo().toLowerCase();

                if (conteudo.contains("ração") || conteudo.contains("rações")) {
                    categoria = "Ração";
                    break;

                } else if (conteudo.contains("petisco") || conteudo.contains("petiscos")) {
                    categoria = "Petisco";
                    break;

                } else if (conteudo.contains("suplemento") || conteudo.contains("suplementos")) {
                    categoria = "Suplemento";
                    break;
                }
            }
        }

        if (!categoriaValida(categoria)) {
            return new String[]{null, null, "true", null, null, null, null, null};
        }

        if (produto != null) {
            return new String[]{categoria, tipo, "false", especie, porte, faixa, gluten, produto};
        }

        return new String[]{categoria, tipo, "false", especie, porte, faixa, gluten, null};
    }

    private boolean categoriaValida(String categoria) {

        return categoria != null
                && (categoria.equalsIgnoreCase("Ração")
                || categoria.equalsIgnoreCase("Petisco")
                || categoria.equalsIgnoreCase("Suplemento"));
    }

}