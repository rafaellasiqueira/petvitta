package com.project.petvitta.service.pedido;

import com.project.petvitta.dto.FinalizarCompraDTO;
import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.carrinho.ItemCarrinho;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.cliente.Endereco;
import com.project.petvitta.model.dominio.StatusPedido;
import com.project.petvitta.model.pedido.*;
import com.project.petvitta.repository.carrinho.CarrinhoRepository;
import com.project.petvitta.repository.cliente.CartaoRepository;
import com.project.petvitta.repository.cliente.ClienteRepository;
import com.project.petvitta.repository.cliente.CupomRepository;
import com.project.petvitta.repository.cliente.EnderecoRepository;
import com.project.petvitta.repository.dominio.StatusPedidoRepository;
import com.project.petvitta.repository.dominio.TipoCupomRepository;
import com.project.petvitta.repository.pedido.*;
import com.project.petvitta.service.ProdutoService;
import com.project.petvitta.service.cliente.CupomService;
import jakarta.servlet.http.HttpSession;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final ClienteRepository clienteRepository;
    private final EnderecoRepository enderecoRepository;
    private final CupomRepository cupomRepository;
    private final CartaoRepository cartaoRepository;
    private final StatusPedidoRepository statusPedidoRepository;
    private final TipoCupomRepository tipoCupomRepository;
    private final CartaoCompraRepository cartaoCompraRepository;
    private final EnderecoCompraRepository enderecoCompraRepository;
    private final FreteService freteService;
    private final CupomService cupomService;
    private final PagamentoService pagamentoService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final VerificacaoCompraService verificacaoCompraService;
    private final ProdutoService produtoService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ItemPedidoRepository itemPedidoRepository,
            PagamentoRepository pagamentoRepository,
            CarrinhoRepository carrinhoRepository,
            ClienteRepository clienteRepository,
            EnderecoRepository enderecoRepository,
            CupomRepository cupomRepository,
            CartaoRepository cartaoRepository,
            StatusPedidoRepository statusPedidoRepository,
            TipoCupomRepository tipoCupomRepository,
            CartaoCompraRepository cartaoCompraRepository,
            EnderecoCompraRepository enderecoCompraRepository, FreteService freteService, CupomService cupomService, PagamentoService pagamentoService, VerificacaoCompraService verificacaoCompraService, ProdutoService produtoService

    ) {
        this.pedidoRepository = pedidoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.carrinhoRepository = carrinhoRepository;
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.cupomRepository = cupomRepository;
        this.cartaoRepository = cartaoRepository;
        this.statusPedidoRepository = statusPedidoRepository;
        this.tipoCupomRepository = tipoCupomRepository;
        this.cartaoCompraRepository = cartaoCompraRepository;
        this.enderecoCompraRepository = enderecoCompraRepository;
        this.freteService = freteService;
        this.cupomService = cupomService;
        this.pagamentoService = pagamentoService;
        this.verificacaoCompraService = verificacaoCompraService;
        this.produtoService = produtoService;
    }

    public List<Pedido> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteIdOrderByIdDesc(clienteId);
    }

    public List<Pedido> buscarPorCodigo(String codigo, Long clienteId) {

        List<Pedido> todos = pedidoRepository.findAll();
        List<Pedido> resultado = new ArrayList<>();

        for (int i = 0; i < todos.size(); i++) {
            boolean encontrou = true;
            Pedido pedido = todos.get(i);

            if (codigo != null && !codigo.isEmpty()) {
                String codigoPesquisa = codigo.toUpperCase().replace("PED-", "").replace("PED", "").trim();

                if (!pedido.getCodigo().contains(codigoPesquisa)) {
                    encontrou = false;
                }
            }

            if (!pedido.getCliente().getId().equals(clienteId)) {
                encontrou = false;
            }

            if (encontrou) {
                resultado.add(pedido);
            }
        }

        return resultado;
    }

    @Transactional
    public Pedido finalizarCompra(Long clienteId, FinalizarCompraDTO dto, HttpSession session) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado."));

        // Validar o carrinho
        validarCarrinho(carrinho);

        // Obter o endereço
        EnderecoCompra enderecoCompra = null;

        if (dto.getEnderecoId() != null) {
            Endereco endereco = obterEndereco(cliente, dto);
            enderecoCompra = copiarEndereco(endereco);
        }

        if (dto.getEnderecoTemporarioId() != null) {
            enderecoCompra = obterEnderecoTemporario(cliente, dto);
        }

        if (enderecoCompra == null) {
            throw new IllegalArgumentException(
                    "Selecione um endereço de entrega."
            );
        }

        // Validar se está vazio
        validarItensSelecionados(dto.getItensSelecionados());

        // Calcular subtotal
        BigDecimal subtotal = calcularSubtotal(carrinho, dto.getItensSelecionados());

        // Quantidade de itens selecionados para o frete
        int quantidadeItens = 0;

        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho item = carrinho.getItens().get(i);

            if (dto.getItensSelecionados().contains(item.getId())) {
                quantidadeItens += item.getQuantidade();
            }
        }

        // Estado do endereço
        String siglaEstado = enderecoCompra.getEstado().getSigla();

        // Frete
        BigDecimal frete = freteService.calcularFrete(quantidadeItens, siglaEstado);

        // Buscar cupons
        List<Cupom> cupons = cupomService.buscarCupons(dto.getCuponsIds());

        // Calcular desconto
        BigDecimal desconto = cupomService.calcularDesconto(cupons);

        // Calcular total
        BigDecimal valorCompra = subtotal.add(frete);


        // Gerar cupom de troca
        boolean cupomInvalido = false;

        for (int i = 0; i < cupons.size(); i++) {
            Cupom cupom = cupons.get(i);

            if (cupom.getValidade().isBefore(LocalDateTime.now()) || !cupom.isAtivo()) {
                cupomInvalido = true;
                break;
            }
        }

        if (!cupomInvalido &&  desconto.compareTo(valorCompra) > 0) {
            BigDecimal excedente = desconto.subtract(valorCompra);

            cupomService.gerarCupomTroca(excedente, session);

            desconto = valorCompra;
        }

        BigDecimal total = valorCompra.subtract(desconto);

        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        // Validar pagamento
        pagamentoService.validarPagamento(cliente, dto, total);

        Pedido pedido = new Pedido();

        pedido.setData(LocalDateTime.now());
        pedido.setSubtotal(subtotal);
        pedido.setFrete(frete);
        pedido.setDesconto(desconto);
        pedido.setTotal(total);
        pedido.setCliente(cliente);
        pedido.setEnderecoCompra(enderecoCompra);
        pedido.setCupons(cupons);
        pedido.setCodigo(gerarCodigo());

        StatusPedido status = statusPedidoRepository
                .findByDescricao("Em processamento")
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Status inicial do pedido não encontrado."
                        ));

        pedido.setStatusPedido(status);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        salvarItensPedido(pedidoSalvo, carrinho, dto.getItensSelecionados());

        pagamentoService.salvarPagamentos(pedidoSalvo, cliente, dto);

        List<Long> itensSelecionados = new ArrayList<>(dto.getItensSelecionados());

        if (enderecoCompra != null) {
            enderecoCompra.setUtilizado(true);
        }

        carrinho.getItens().removeIf(
                item -> itensSelecionados.contains(item.getId())
        );

        return pedidoSalvo;
    }

    private void validarCarrinho(Carrinho carrinho) {
        if (carrinho.getItens() == null || carrinho.getItens().isEmpty()) {
            throw new IllegalArgumentException(
                    "O carrinho está vazio."
            );
        }

        if (carrinho.getDataExpiracao() != null && LocalDateTime.now().isAfter(carrinho.getDataExpiracao())) {
            throw new IllegalArgumentException(
                    "O prazo do carrinho expirou. " +
                            "Atualize o carrinho antes de finalizar a compra."
            );
        }
    }

    private Endereco obterEndereco(
            Cliente cliente,
            FinalizarCompraDTO dto
    ) {
        if (dto.getEnderecoId() == null) {
            throw new IllegalArgumentException(
                    "Selecione um endereço de entrega."
            );
        }

        Endereco endereco = enderecoRepository.findById(dto.getEnderecoId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Endereço não encontrado."
                        )
                );

        if (!endereco.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException(
                    "O endereço não pertence ao cliente."
            );
        }

        return endereco;
    }

    private EnderecoCompra obterEnderecoTemporario(
            Cliente cliente,
            FinalizarCompraDTO dto
    ) {
        if (dto.getEnderecoTemporarioId() == null) {
            return null;
        }

        EnderecoCompra endereco = enderecoCompraRepository.findById(
                        dto.getEnderecoTemporarioId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Endereço temporário não encontrado."
                        )
                );

        if (!endereco.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException(
                    "O endereço não pertence ao cliente."
            );
        }

        return endereco;
    }

    private void validarItensSelecionados(List<Long> itensSelecionados) {
        if (itensSelecionados == null || itensSelecionados.isEmpty()) {
            throw new IllegalArgumentException(
                    "Selecione pelo menos um produto."
            );
        }
    }

    private BigDecimal calcularSubtotal(
            Carrinho carrinho,
            List<Long> itensSelecionados
    ) {

        BigDecimal subtotal = BigDecimal.ZERO;

        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho item = carrinho.getItens().get(i);

            if (itensSelecionados.contains(item.getId())) {
                subtotal = subtotal.add(item.getVariacao().getValorVenda()
                        .multiply(BigDecimal.valueOf(item.getQuantidade()))
                );
            }
        }

        return subtotal;
    }

    private void salvarItensPedido(
            Pedido pedido,
            Carrinho carrinho,
            List<Long> itensSelecionados
    ) {
        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho itemCarrinho = carrinho.getItens().get(i);

            if (itensSelecionados.contains(itemCarrinho.getId())) {
                ItemPedido itemPedido = new ItemPedido();
                itemPedido.setPedido(pedido);
                itemPedido.setQuantidade(itemCarrinho.getQuantidade());
                itemPedido.setVariacaoProduto(itemCarrinho.getVariacao());
                itemPedidoRepository.save(itemPedido);
            }
        }
    }

    private String gerarCodigo() {
        int numero;

        do {
            numero = (int) (Math.random() * 900000) + 100000; /* gera numero decimal */
        } while (pedidoRepository.findByCodigo(String.valueOf(numero)).isPresent());

        return String.valueOf(numero);
    }

    private EnderecoCompra copiarEndereco(Endereco endereco) {

        EnderecoCompra copia = new EnderecoCompra();

        copia.setCliente(endereco.getCliente());
        copia.setNomeIdentificacao(endereco.getNomeIdentificacao());
        copia.setTipoEndereco(endereco.getTipoEndereco());
        copia.setTipoResidencia(endereco.getTipoResidencia());
        copia.setTipoLogradouro(endereco.getTipoLogradouro());
        copia.setCep(endereco.getCep());
        copia.setLogradouro(endereco.getLogradouro());
        copia.setBairro(endereco.getBairro());
        copia.setNumero(endereco.getNumero());
        copia.setEstado(endereco.getEstado());
        copia.setCidade(endereco.getCidade());
        copia.setPais(endereco.getPais());
        copia.setObservacoes(endereco.getObservacoes());

        copia.setUtilizado(true);

        return enderecoCompraRepository.save(copia);
    }

    public void alterarStatus(Long pedidoId, String descricao) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();

        StatusPedido status = statusPedidoRepository.findByDescricao(descricao).orElseThrow();

        if (descricao.equals("Em transporte")) {
            definirDataPrevisaoEntrega(pedido);
        }

        if (descricao.equals("Entregue")) {
            definirDataEntrega(pedido);
        }

        if (descricao.equals("Cancelado")) {
            definirDataCancelamento(pedido);
        }

        pedido.setStatusPedido(status);

        pedidoRepository.save(pedido);
    }

    private void definirDataPrevisaoEntrega(Pedido pedido) {
        pedido.setDataPrevisaoEntrega(LocalDateTime.now().plusMonths(1));
    }

    private void definirDataEntrega(Pedido pedido) {
        pedido.setDataEntrega(LocalDateTime.now());
    }

    private void definirDataCancelamento(Pedido pedido) {
        pedido.setDataCancelamento(LocalDateTime.now());
    }

    public List<Pedido> filtrarPedidos(String status, String pesquisa) {
        List<Pedido> todos = pedidoRepository.findAllByOrderByIdDesc();
        List<Pedido> resultado = new ArrayList<>();

        for (int i = 0; i < todos.size(); i++) {
            boolean encontrou = true;
            Pedido pedido = todos.get(i);

            if (status != null && !status.isEmpty() && !status.equals("Todos")) {
                if (!pedido.getStatusPedido().getDescricao().equals(status)) {
                    encontrou = false;
                }
            }

            if (pesquisa != null && !pesquisa.isEmpty()) {
                String pesquisaFormatada = pesquisa.toUpperCase()
                        .replace("PED-", "")
                        .replace("PED", "")
                        .trim();

                String codigo = pedido.getCodigo().toUpperCase();
                String cliente = pedido.getCliente().getNome().toUpperCase();

                if (!codigo.contains(pesquisaFormatada) && !cliente.contains(pesquisa.toUpperCase())) {
                    encontrou = false;
                }
            }

            if (encontrou) {
                resultado.add(pedido);
            }
        }

        return resultado;
    }

    public Map<String, List<BigDecimal>> listarVendasPorCategoria(LocalDate dataInicio, LocalDate dataFim) {
        if(dataInicio == null || dataFim == null) {
            int ano = LocalDate.now().getYear();

            dataInicio = LocalDate.of(ano, 1, 1);
            dataFim = LocalDate.of(ano, 12, 31);
        }

        if (dataFim.isBefore(dataInicio)) {
            throw new IllegalArgumentException(
                    "A data final não pode ser anterior à data inicial."
            );
        }

        if (dataFim.isBefore(dataInicio.plusMonths(1)) || dataFim.isAfter(dataInicio.plusMonths(24))) {
            throw new IllegalArgumentException(
                    "O intervalo entre a data de início e a data de fim deve ser de no mínimo 1 mês e no máximo 24 meses."
            );
        }

        Map<String, List<BigDecimal>> dadosGrafico = new HashMap<>();

        List<String> categorias = produtoService.listarCategorias();

        for(int i = 0; i < categorias.size(); i++) {
            List<BigDecimal> valores = new ArrayList<>();

            LocalDate mesInicio = dataInicio.withDayOfMonth(1);
            LocalDate mesFim = dataFim.withDayOfMonth(1);

            while(!mesInicio.isAfter(mesFim)) {
                valores.add(BigDecimal.ZERO);
                mesInicio = mesInicio.plusMonths(1);
            }

            dadosGrafico.put(categorias.get(i), valores);
        }

        List<Pedido> pedidos = pedidoRepository.findByStatusPedido_Descricao("Entregue");

        for (int i = 0; i < pedidos.size(); i++) {
            Pedido pedido = pedidos.get(i);

            if (pedido.getDataEntrega() == null) {
                continue;
            }

            LocalDate dataEntrega = pedido.getDataEntrega().toLocalDate();

            if (dataEntrega.isBefore(dataInicio) || dataEntrega.isAfter(dataFim)) {
                continue;
            }

            int indice = (dataEntrega.getYear() - dataInicio.getYear()) * 12
                    + dataEntrega.getMonthValue() - dataInicio.getMonthValue();

            for (int j = 0; j < pedido.getItens().size(); j++) {
                ItemPedido item = pedido.getItens().get(j);

                String categoria = item.getVariacaoProduto().getProduto().getCategoria();

                if (dadosGrafico.containsKey(categoria)) {
                    BigDecimal total = item.getVariacaoProduto()
                            .getValorVenda()
                            .multiply(BigDecimal.valueOf(item.getQuantidade()));

                    List<BigDecimal> valores = dadosGrafico.get(categoria);

                    valores.set(indice, valores.get(indice).add(total));
                }
            }
        }

        return dadosGrafico;
    }

    public void agendarVerificacaoCompra(Long pedidoId) {
        scheduler.schedule(
                () -> verificacaoCompraService.processarVerificacaoCompra(pedidoId),
                5,
                TimeUnit.SECONDS
        );
    }
}
