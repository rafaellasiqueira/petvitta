package com.project.petvitta.service;

import com.project.petvitta.model.dominio.*;
import com.project.petvitta.model.produto.*;
import com.project.petvitta.repository.dominio.*;
import com.project.petvitta.repository.produto.ProdutoRepository;
import com.project.petvitta.repository.produto.VariacaoProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final TipoRacaoRepository tipoRacaoRepository;
    private final TipoPetiscoRepository tipoPetiscoRepository;
    private final FormaApresentacaoRepository formaApresentacaoRepository;
    private final EspecieRepository especieRepository;
    private final FaixaEtariaRepository faixaEtariaRepository;
    private final PorteRepository porteRepository;
    private final VariacaoProdutoRepository variacaoProdutoRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            TipoRacaoRepository tipoRacaoRepository,
            TipoPetiscoRepository tipoPetiscoRepository,
            FormaApresentacaoRepository formaApresentacaoRepository,
            EspecieRepository especieRepository,
            FaixaEtariaRepository faixaEtariaRepository,
            PorteRepository porteRepository, VariacaoProdutoRepository variacaoProdutoRepository) {

        this.produtoRepository = produtoRepository;
        this.tipoRacaoRepository = tipoRacaoRepository;
        this.tipoPetiscoRepository = tipoPetiscoRepository;
        this.formaApresentacaoRepository = formaApresentacaoRepository;
        this.especieRepository = especieRepository;
        this.faixaEtariaRepository = faixaEtariaRepository;
        this.porteRepository = porteRepository;
        this.variacaoProdutoRepository = variacaoProdutoRepository;
    }

    public List<TipoRacao> listarTiposRacao() {
        return tipoRacaoRepository.findAll();
    }

    public List<TipoPetisco> listarTiposPetisco() {
        return tipoPetiscoRepository.findAll();
    }

    public List<FormaApresentacao> listarFormasApresentacao() {
        return formaApresentacaoRepository.findAll();
    }

    public List<Especie> listarEspecies() {
        return especieRepository.findAll();
    }

    public List<FaixaEtaria> listarFaixasEtarias() {
        return faixaEtariaRepository.findAll();
    }

    public List<Porte> listarPortes() {
        return porteRepository.findAll();
    }

    public List<Produto> filtrar(
            String verTodos,
            String nome,
            List<String> tipoRacao,
            List<String> tipoPetisco,
            List<String> formaApresentacao,
            List<String> especie,
            List<String> idade,
            List<String> porte,
            Boolean transgenico,
            Boolean gluten,
            BigDecimal precoMinimo,
            BigDecimal precoMaximo,
            String categoria) {

        List<Produto> produtos = produtoRepository.findAll();
        List<Produto> resultado = new ArrayList<>();

        for(int i = 0; i < produtos.size(); i++) {
            Produto produto = produtos.get(i);
            boolean encontrou = true;

            // Ver todos
            if(verTodos != null) {
                String categoriaProduto = produto.getCategoria();

                if(!categoriaProduto.equalsIgnoreCase(verTodos)) {
                    encontrou = false;
                }
            }

            // Tipo Racao
            if (tipoRacao != null && !tipoRacao.isEmpty()) {
                if (produto instanceof Racao) {
                    Racao racao = (Racao) produto;

                    String tipoRacaoProduto = racao.getTipoRacao().getNome();

                    if (!tipoRacao.contains(tipoRacaoProduto)) {
                        encontrou = false;
                    }
                } else {
                    encontrou = false;
                }
            }

            // Tipo Petisco
            if (tipoPetisco != null && !tipoPetisco.isEmpty()) {
                if (produto instanceof Petisco) {
                    Petisco petisco = (Petisco) produto;

                    String tipoPetiscoProduto = petisco.getTipoPetisco().getNome();

                    if (!tipoPetisco.contains(tipoPetiscoProduto)) {
                        encontrou = false;
                    }
                } else {
                    encontrou = false;
                }
            }

            // Forma apresentação
            if (formaApresentacao != null && !formaApresentacao.isEmpty()) {
                if (produto instanceof Suplemento) {
                    Suplemento suplemento = (Suplemento) produto;

                    String formaApresentacaoProduto = suplemento.getFormaApresentacao().getNome();

                    if (!formaApresentacao.contains(formaApresentacaoProduto)) {
                        encontrou = false;
                    }
                } else {
                    encontrou = false;
                }
            }

            // Espécie
            if (especie != null && !especie.isEmpty()) {
                boolean encontrouEspecie = false;

                for (int j = 0; j < produto.getEspecies().size(); j++) {

                    String especieProduto = produto.getEspecies().get(j).getNome();

                    if (especie.contains(especieProduto)) {
                        encontrouEspecie = true;
                        break;
                    }
                }

                if (!encontrouEspecie) {
                    encontrou = false;
                }
            }

            // Idade
            if (idade != null && !idade.isEmpty()) {
                boolean encontrouIdade = false;

                for (int j = 0; j < produto.getFaixasEtarias().size(); j++) {

                    String idadeProduto =
                            produto.getFaixasEtarias().get(j).getNome();

                    if (idade.contains(idadeProduto)) {
                        encontrouIdade = true;
                        break;
                    }
                }

                if (!encontrouIdade) {
                    encontrou = false;
                }
            }

            // Porte
            if (porte != null && !porte.isEmpty()) {
                boolean encontrouPorte = false;

                for (int j = 0; j < produto.getPortes().size(); j++) {

                    String porteProduto =
                            produto.getPortes().get(j).getNome();

                    if (porte.contains(porteProduto)) {
                        encontrouPorte = true;
                        break;
                    }
                }

                if (!encontrouPorte) {
                    encontrou = false;
                }
            }

            // Transgênico
            if (transgenico != null) {
                if (produto.isContemTransgenico() != transgenico) {
                    encontrou = false;
                }
            }

            // Glúten
            if (gluten != null) {
                if (produto.isContemGluten() != gluten) { // Metodo getter
                    encontrou = false;
                }
            }

            // Faixa de preço
            if (precoMinimo != null || precoMaximo != null) {

                BigDecimal valorMinimo = produto.getValorMinimo();
                BigDecimal valorMaximo = produto.getValorMaximo();

                if (valorMinimo == null || valorMaximo == null) {

                    encontrou = false;

                } else {

                    // Preço mínimo informado
                    if (precoMinimo != null &&
                            valorMinimo.compareTo(precoMinimo) < 0) {

                        encontrou = false;
                    }

                    // Preço máximo informado
                    if (precoMaximo != null &&
                            valorMaximo.compareTo(precoMaximo) > 0) {

                        encontrou = false;
                    }
                }
            }

            // Filtro por categoria
            if (categoria != null && !categoria.isBlank()) {

                if (!categoria.equalsIgnoreCase(produto.getCategoria())) {
                    encontrou = false;
                }
            }

            // Filtro por nome
            if (nome != null && !nome.isBlank()) {
                if (!produto.getNome().toLowerCase().contains(nome.toLowerCase())) {
                    encontrou = false;
                }
            }

            if (encontrou) {
                resultado.add(produto);
            }
        }
        return resultado;
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Produto não encontrado."));
    }

    // Metodo do pedidos do admin
    public List<VariacaoProduto> filtrarEstoque(String status, String pesquisa) {

        List<VariacaoProduto> variacoes = variacaoProdutoRepository.findAll();
        List<VariacaoProduto> resultado = new ArrayList<>();


        for (int i = 0; i < variacoes.size(); i++) {
            VariacaoProduto variacao = variacoes.get(i);

            boolean encontrou = true;

            // Filtro por status
            if (status != null && !status.isBlank() && !status.equals("Todos")) {
                if (!variacao.getStatusEstoque().equalsIgnoreCase(status)) {
                    encontrou = false;
                }
            }

            // Filtro por nome
            if (pesquisa != null && !pesquisa.isBlank()) {

                String nomeProduto = variacao.getProduto().getNome().toLowerCase();
                String nomePesquisa = pesquisa.trim().toLowerCase();

                if (!nomeProduto.contains(nomePesquisa)) {
                    encontrou = false;
                }
            }

            if (encontrou) {
                resultado.add(variacao);
            }
        }

        return resultado;
    }


}
