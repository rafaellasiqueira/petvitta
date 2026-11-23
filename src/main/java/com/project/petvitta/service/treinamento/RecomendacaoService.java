package com.project.petvitta.service.treinamento;

import com.project.petvitta.model.chat.Mensagem;
import com.project.petvitta.model.pedido.ItemPedido;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.produto.*;
import com.project.petvitta.model.treinamento.ModeloVersao;
import com.project.petvitta.model.treinamento.RecomendacaoCliente;

import com.project.petvitta.repository.chat.MensagemRepository;
import com.project.petvitta.repository.pedido.PedidoRepository;
import com.project.petvitta.repository.produto.ProdutoRepository;
import com.project.petvitta.repository.treinamento.ModeloVersaoRepository;
import com.project.petvitta.repository.treinamento.RecomendacaoClienteRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.*;

/**
 * Modelo de recomendação treinado com as VENDAS e o FEEDBACK do chat.
 *
 * Ideia: "quem comprou A também comprou B".
 *  1) Conta quantas vezes cada par de produtos foi comprado/curtido pelo mesmo cliente.
 *  2) Para cada cliente, produtos que combinam com os que ele já tem ganham pontos.
 *  3) "Útil" no chat soma pontos; "Não útil" tira o produto da lista daquele cliente.
 *  4) Cada treino gera uma NOVA VERSÃO, guardando quantos dados entraram.
 */
@Service
public class RecomendacaoService {

    private final PedidoRepository pedidoRepository;
    private final MensagemRepository mensagemRepository;
    private final ProdutoRepository produtoRepository;
    private final ModeloVersaoRepository versaoRepository;
    private final RecomendacaoClienteRepository recomendacaoRepository;

    private final Long clienteGeral = 0L;
    private final double util = 0.5;
    private final double naoUtil = -0.5;
    private final double pesoPopularidade = 0.05;

    public RecomendacaoService(PedidoRepository pedidoRepository,
                               MensagemRepository mensagemRepository,
                               ProdutoRepository produtoRepository,
                               ModeloVersaoRepository versaoRepository,
                               RecomendacaoClienteRepository recomendacaoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.mensagemRepository = mensagemRepository;
        this.produtoRepository = produtoRepository;
        this.versaoRepository = versaoRepository;
        this.recomendacaoRepository = recomendacaoRepository;
    }

    // Treinamento
    @Transactional
    public synchronized ModeloVersao treinar() {

        // Popularidade dos produtos
        List<Produto> produtos = produtoRepository.findByAtivoTrue();
        List<Pedido> pedidos = pedidoRepository.findAll();

        Map<Long, Set<Long>> compras = new HashMap<>();
        Map<Long, Double> popularidade = new HashMap<>();

        int qtdCompras = 0;

        for (int i = 0; i < pedidos.size(); i++) {
            Pedido pedido = pedidos.get(i);

            if (pedido.getCliente() == null || pedido.getStatusPedido() == null) {
                continue;
            }

            String status = pedido.getStatusPedido().getDescricao();

            if (!status.equalsIgnoreCase("Aprovada")
                    && !status.equalsIgnoreCase("Em transporte")
                    && !status.equalsIgnoreCase("Entregue")) {
                continue;
            }

            Long clienteId = pedido.getCliente().getId();

            if (!compras.containsKey(clienteId)) {
                compras.put(clienteId, new HashSet<>());
            }

            List<ItemPedido> itens = pedido.getItens();

            for (int j = 0; j < itens.size(); j++) {
                ItemPedido item = itens.get(j);

                if (item.getVariacaoProduto() == null || item.getVariacaoProduto().getProduto() == null) {
                    continue;
                }

                Long produtoId = item.getVariacaoProduto().getProduto().getId();

                // Verifica se o produto ainda não foi registrado para esse cliente
                boolean produtoNovo = compras.get(clienteId).add(produtoId);

                if (produtoNovo) {
                    qtdCompras++;

                    Double popularidadeAtual = 0.0;

                    if (popularidade.containsKey(produtoId)) {
                        popularidadeAtual = popularidade.get(produtoId);
                    }

                    popularidade.put(produtoId, popularidadeAtual + 1);
                }
            }
        }

        // Buscar avaliações do chat
        List<Mensagem> mensagens = mensagemRepository.findByRemetenteAndAvaliacaoIsNotNullOrderByDataEnvioAsc("IA");

        Map<Long, Map<Long, Double>> feedbacks = new HashMap<>();

        int qtdFeedbacks = 0;

        for (int i = 0; i < mensagens.size(); i++) {
            Mensagem mensagem = mensagens.get(i);

            if (mensagem.getConversa() == null || mensagem.getConversa().getCliente() == null) {
                continue;
            }

            Long clienteId = mensagem.getConversa().getCliente().getId();

            double peso;

            if (mensagem.getAvaliacao().equalsIgnoreCase("Útil")) {
                peso = util;
            } else if (mensagem.getAvaliacao().equalsIgnoreCase("Não útil")) {
                peso = naoUtil;
            } else {
                continue;
            }

            qtdFeedbacks++;

            List<Long> ids = idsCitados(mensagem.getConteudo());

            if (!feedbacks.containsKey(clienteId)) {
                feedbacks.put(clienteId, new HashMap<>());
            }

            // Pego o map q pertence ao cliente
            Map<Long, Double> avaliados = feedbacks.get(clienteId);

            for (int j = 0; j < ids.size(); j++) {
                Long produtoId = ids.get(j);

                if (!avaliados.containsKey(produtoId)) {
                    avaliados.put(produtoId, 0.0);
                }

                avaliados.put(produtoId, avaliados.get(produtoId) + peso);
            }
        }

        // Juntar compras e avaliações positivas
        Set<Long> clientes = new HashSet<>(compras.keySet());
        clientes.addAll(feedbacks.keySet());

        List<Long> listaClientes = new ArrayList<>(clientes);

        Map<Long, Set<Long>> positivos = new HashMap<>();

        for (int i = 0; i < listaClientes.size(); i++) {
            Long clienteId = listaClientes.get(i);

            Set<Long> lista = new HashSet<>();

            // Adicionar produtos comprados
            if (compras.containsKey(clienteId)) {
                lista.addAll(compras.get(clienteId));
            }

            // Adicionar produtos avaliados positivamente
            if (feedbacks.containsKey(clienteId)) {
                Map<Long, Double> avaliados = feedbacks.get(clienteId);

                List<Long> ids = new ArrayList<>(avaliados.keySet());

                for (int j = 0; j < ids.size(); j++) {
                    Long produtoId = ids.get(j);
                    if (avaliados.get(produtoId) > 0) {
                        lista.add(produtoId);
                    }
                }
            }

            positivos.put(clienteId, lista);
        }

        // Verificar a popularidade do produto
        Map<Long, Map<Long, Integer>> juntos = new HashMap<>();

        for (int i = 0; i < listaClientes.size(); i++) {
            Long clienteId = listaClientes.get(i);

            List<Long> lista = new ArrayList<>(positivos.get(clienteId));

            for (int j = 0; j < lista.size(); j++) {
                for (int k = 0; k < lista.size(); k++) {

                    if (j != k) {
                        Long produtoA = lista.get(j);
                        Long produtoB = lista.get(k);

                        if (!juntos.containsKey(produtoA)) {
                            juntos.put(produtoA, new HashMap<>());
                        }

                        if (!juntos.get(produtoA).containsKey(produtoB)) {
                            juntos.get(produtoA).put(produtoB, 0);
                        }

                        juntos.get(produtoA).put(
                                produtoB,
                                juntos.get(produtoA).get(produtoB) + 1
                        );
                    }
                }
            }
        }

        // Criar uma nova versão do modelo
        ModeloVersao ultima = versaoRepository.findTopByOrderByIdDesc().orElse(null);

        int feedbacksAnteriores = 0;

        if (ultima != null) {
            feedbacksAnteriores = ultima.getQtdFeedbacks();
        }

        ModeloVersao versao = new ModeloVersao();

        versao.setDataTreinamento(LocalDateTime.now());
        versao.setQtdCompras(qtdCompras);
        versao.setQtdFeedbacks(qtdFeedbacks);

        int novos = qtdFeedbacks - feedbacksAnteriores;

        if (novos < 0) {
            novos = 0;
        }

        versao.setQtdFeedbacksNovos(novos);

        versao = versaoRepository.save(versao);


        // Calcular as recomendações
        List<Long> clientesRecomendacao = new ArrayList<>(clientes);
        clientesRecomendacao.add(clienteGeral);

        List<RecomendacaoCliente> recomendacoes = new ArrayList<>();

        for (int i = 0; i < clientesRecomendacao.size(); i++) {
            Long clienteId = clientesRecomendacao.get(i);

            Set<Long> comprados = compras.get(clienteId);
            Set<Long> positivosCliente = positivos.get(clienteId);
            Map<Long, Double> avaliados = feedbacks.get(clienteId);

            List<ProdutoPontuacao> ranking = new ArrayList<>();

            for (int j = 0; j < produtos.size(); j++) {
                Long produtoId = produtos.get(j).getId();

                if (comprados != null && comprados.contains(produtoId)) {
                    continue;
                }

                if (avaliados != null && avaliados.containsKey(produtoId)
                        && avaliados.get(produtoId) < 0) {
                    continue;
                }

                double pontos = 0;

                if (popularidade.containsKey(produtoId)) {
                    pontos = popularidade.get(produtoId) * pesoPopularidade;
                }

                if (positivosCliente != null) {
                    List<Long> meusProdutos = new ArrayList<>(positivosCliente);

                    for (int k = 0; k < meusProdutos.size(); k++) {
                        Long meuProduto = meusProdutos.get(k);

                        if (juntos.containsKey(meuProduto)
                                && juntos.get(meuProduto).containsKey(produtoId)) {
                            pontos += juntos.get(meuProduto).get(produtoId);
                        }
                    }
                }

                if (avaliados != null && avaliados.containsKey(produtoId)) {
                    pontos += avaliados.get(produtoId);
                }

                if (pontos > 0) {
                    ranking.add(new ProdutoPontuacao(produtoId, pontos));
                }
            }

            // Ordenar pela maior pontuação
            ranking.sort((a, b) -> Double.compare(b.score, a.score));

            // Salvar as recomendações
            for (int j = 0; j < ranking.size(); j++) {
                ProdutoPontuacao produto = ranking.get(j);

                RecomendacaoCliente recomendacao = new RecomendacaoCliente();
                recomendacao.setModeloVersaoId(versao.getId());
                recomendacao.setClienteId(clienteId);
                recomendacao.setProdutoId(produto.produtoId);
                recomendacao.setScore(produto.score);

                recomendacoes.add(recomendacao);
            }
        }

        // Salvar recomendações no banco
        recomendacaoRepository.saveAll(recomendacoes);

        versao.setQtdRecomendacoes(recomendacoes.size());

        return versaoRepository.save(versao);
    }

    // Recomendar



    public List<Produto> recomendar(
            Long clienteId,
            int limite,
            String categoria,
            String tipo) {

        ModeloVersao versao = versaoRepository.findTopByOrderByIdDesc()
                .orElse(null);

        if (versao == null) {
            return new ArrayList<>();
        }

        List<RecomendacaoCliente> recomendacoes =
                recomendacaoRepository.findByModeloVersaoIdAndClienteIdOrderByScoreDesc(
                        versao.getId(), clienteId);

        List<Produto> resultado = buscarProdutosFiltrados(
                recomendacoes, limite, categoria, tipo);

        // Se não encontrou produtos para o cliente, tenta as recomendações gerais
        if (resultado.isEmpty()) {

            List<RecomendacaoCliente> recomendacoesGerais =
                    recomendacaoRepository.findByModeloVersaoIdAndClienteIdOrderByScoreDesc(
                            versao.getId(), clienteGeral);

            resultado = buscarProdutosFiltrados(
                    recomendacoesGerais, limite, categoria, tipo);
        }

        return resultado;
    }

    private List<Produto> buscarProdutosFiltrados(
            List<RecomendacaoCliente> recomendacoes,
            int limite,
            String categoria,
            String tipo) {

        List<Produto> resultado = new ArrayList<>();

        for (int i = 0; i < recomendacoes.size(); i++) {

            Long produtoId = recomendacoes.get(i).getProdutoId();

            Produto produto = produtoRepository.findById(produtoId).orElse(null);

            if (produto == null || !produto.isAtivo()) {
                continue;
            }

            if (!correspondeCategoria(produto, categoria, tipo)) {
                continue;
            }

            resultado.add(produto);

            if (resultado.size() >= limite) {
                break;
            }
        }

        return resultado;
    }



    // Prepara os produtos recomendados para o Gemini

    public String textoRecomendacoes(
            Long clienteId,
            int limite,
            String categoria,
            String tipo) {

        List<Produto> produtos = recomendar(
                clienteId,
                limite,
                categoria,
                tipo
        );

        if (produtos.isEmpty()) {
            return "Nenhum produto recomendado disponível para os filtros informados.";
        }

        String texto = "";

        for (int i = 0; i < produtos.size(); i++) {

            Produto produto = produtos.get(i);

            texto += "\nPRODUTO " + (i + 1) + "\n";

            texto += "ID: " + produto.getId() + "\n";
            texto += "Nome: " + produto.getNome() + "\n";
            texto += "Marca: " + produto.getMarca() + "\n";
            texto += "Categoria: " + produto.getCategoria() + "\n";
            texto += "Descrição: " + produto.getDescricao() + "\n";

            texto += "Composição nutricional: "
                    + produto.getComposicaoNutricional() + "\n";

            texto += "Contém transgênico: "
                    + (produto.isContemTransgenico() ? "Sim" : "Não") + "\n";

            texto += "Contém glúten: "
                    + (produto.isContemGluten() ? "Sim" : "Não") + "\n";

            texto += "Espécies: ";

            for (int j = 0; j < produto.getEspecies().size(); j++) {
                texto += produto.getEspecies().get(j).getNome() + ", ";
            }

            texto += "\nPortes: ";

            for (int j = 0; j < produto.getPortes().size(); j++) {
                texto += produto.getPortes().get(j).getNome() + ", ";
            }

            texto += "\nFaixas etárias: ";

            for (int j = 0; j < produto.getFaixasEtarias().size(); j++) {
                texto += produto.getFaixasEtarias().get(j).getNome() + ", ";
            }

            texto += "\nSabores: ";

            for (int j = 0; j < produto.getSabores().size(); j++) {
                texto += produto.getSabores().get(j).getNome() + ", ";
            }

            texto += "\n";

            if (produto instanceof Racao racao) {

                texto += "Tipo de ração: "
                        + racao.getTipoRacao().getNome() + "\n";

                texto += "Tamanho do grão: "
                        + racao.getTamanhoGrao().getNome() + "\n";

            } else if (produto instanceof Petisco petisco) {

                texto += "Tipo de petisco: "
                        + petisco.getTipoPetisco().getNome() + "\n";

            } else if (produto instanceof Suplemento suplemento) {

                texto += "Forma de apresentação: "
                        + suplemento.getFormaApresentacao().getNome() + "\n";
            }

            texto += "Variações disponíveis:\n";

            for (int j = 0; j < produto.getVariacoes().size(); j++) {

                VariacaoProduto variacao = produto.getVariacoes().get(j);

                texto += "- Tamanho: " + variacao.getTamanho();
                texto += ", Preço: R$ " + variacao.getValorVenda();
                texto += ", Estoque: " + variacao.getEstoqueAtual() + "\n";
            }

            texto += "Quantidade recomendada:\n";

            for (int j = 0; j < produto.getQuantidadeRecomendada().size(); j++) {

                QuantidadeRecomendada quantidade =
                        produto.getQuantidadeRecomendada().get(j);

                texto += "- Peso do animal: " + quantidade.getPesoAnimal();
                texto += ", Quantidade: "
                        + quantidade.getQuantidadeRecomendada() + "\n";
            }

            texto += "------------------------------\n";
        }

        return texto;
    }




    private boolean correspondeCategoria(
            Produto produto,
            String categoria,
            String tipo) {

        // Verifica a categoria
        if (categoria != null && !categoria.isBlank()) {

            if (produto.getCategoria() == null ||
                    !normalizar(produto.getCategoria())
                            .equals(normalizar(categoria))) {
                return false;
            }
        }

        // Se o cliente não informou o tipo, aceita todos os tipos
        if (tipo == null || tipo.isBlank()) {
            return true;
        }

        String tipoProduto = null;

        // Identifica o tipo específico da ração
        if (produto instanceof Racao racao) {

            if (racao.getTipoRacao() != null) {
                tipoProduto = racao.getTipoRacao().getNome();
            }

            // Identifica o tipo específico do petisco
        } else if (produto instanceof Petisco petisco) {

            if (petisco.getTipoPetisco() != null) {
                tipoProduto = petisco.getTipoPetisco().getNome();
            }

            // Identifica a forma de apresentação do suplemento
        } else if (produto instanceof Suplemento suplemento) {

            if (suplemento.getFormaApresentacao() != null) {
                tipoProduto = suplemento.getFormaApresentacao().getNome();
            }
        }

        return tipoProduto != null &&
                normalizar(tipoProduto).equals(normalizar(tipo));
    }



    private String normalizar(String texto) {

        return Normalizer.normalize(
                texto.trim().toLowerCase(),
                Normalizer.Form.NFD
        ).replaceAll("\\p{M}", "");
    }




    // Identifica os produtos citados nas respostas da IA (pelo link)
    private List<Long> idsCitados(String conteudo) {

        List<Long> ids = new ArrayList<>();

        if (conteudo == null) {
            return ids;
        }

        // Trechos que começam com detalhes-produto
        String[] partes = conteudo.split("detalhes-produto/");

        for (int i = 1; i < partes.length; i++) {
            String numero = partes[i].split("[^0-9]")[0];

            Long id = Long.valueOf(numero);

            if (!ids.contains(id)) {
                ids.add(id);
            }
        }

        return ids;
    }


    private static class ProdutoPontuacao {

        Long produtoId;
        double score;

        ProdutoPontuacao(Long produtoId, double score) {
            this.produtoId = produtoId;
            this.score = score;
        }
    }
}