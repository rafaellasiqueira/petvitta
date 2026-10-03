package com.project.petvitta.service;

import com.project.petvitta.dto.CartaoPagamentoDTO;
import com.project.petvitta.dto.FinalizarCompraDTO;
import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.carrinho.ItemCarrinho;
import com.project.petvitta.model.cliente.Cartao;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.cliente.Endereco;
import com.project.petvitta.model.dominio.StatusPedido;
import com.project.petvitta.model.dominio.TipoCupom;
import com.project.petvitta.model.dominio.TipoTelefone;
import com.project.petvitta.model.pedido.ItemPedido;
import com.project.petvitta.model.pedido.Pagamento;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.repository.carrinho.CarrinhoRepository;
import com.project.petvitta.repository.cliente.CartaoRepository;
import com.project.petvitta.repository.cliente.ClienteRepository;
import com.project.petvitta.repository.cliente.CupomRepository;
import com.project.petvitta.repository.cliente.EnderecoRepository;
import com.project.petvitta.repository.dominio.StatusPedidoRepository;
import com.project.petvitta.repository.dominio.TipoCupomRepository;
import com.project.petvitta.repository.pedido.ItemPedidoRepository;
import com.project.petvitta.repository.pedido.PagamentoRepository;
import com.project.petvitta.repository.pedido.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
            TipoCupomRepository tipoCupomRepository
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
    }

    public List<Pedido> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
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
    public Pedido finalizarCompra(Long clienteId, FinalizarCompraDTO dto) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        Carrinho carrinho = carrinhoRepository.findByClienteId(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado."));

        // Validar o carrinho
        validarCarrinho(carrinho);

        // Obter o endereço
        Endereco endereco = obterEndereco(cliente, dto);

        // Validar se está vazio
        validarItensSelecionados(dto.getItensSelecionados());

        // Calcular subtotal
        BigDecimal subtotal = calcularSubtotal(carrinho, dto.getItensSelecionados());

        // Frete
        BigDecimal frete = calcularFrete(subtotal);

        // Buscar cupons
        List<Cupom> cupons = buscarCupons(dto.getCuponsIds());

        // Calcular desconto
        BigDecimal desconto = calcularDesconto(cupons);

        // Calcular total
        BigDecimal valorCompra = subtotal.add(frete);

        if (desconto.compareTo(valorCompra) > 0) {
            BigDecimal excedente = desconto.subtract(valorCompra);

            gerarCupomTroca(excedente);

            desconto = valorCompra;
        }

        BigDecimal total = valorCompra.subtract(desconto);

        // Validar pagamento
        validarPagamento(cliente, dto, total);

        Pedido pedido = new Pedido();

        pedido.setData(LocalDateTime.now());
        pedido.setSubtotal(subtotal);
        pedido.setFrete(frete);
        pedido.setDesconto(desconto);
        pedido.setTotal(total);
        pedido.setCliente(cliente);
        pedido.setEndereco(endereco);
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

        salvarPagamentos(pedidoSalvo, cliente, dto);

        carrinho.getItens().removeIf(item -> dto.getItensSelecionados().contains(item.getId()));

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

    private BigDecimal calcularFrete(BigDecimal subtotal) {
        if (subtotal.compareTo(new BigDecimal("100.00")) < 0) {
            return new BigDecimal("20.00");
        }

        if (subtotal.compareTo(new BigDecimal("200.00")) < 0) {
            return new BigDecimal("15.00");
        }

        return new BigDecimal("10.00");
    }

    private List<Cupom> buscarCupons(List<Long> cuponsIds) {
        if (cuponsIds == null || cuponsIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Cupom> cupons = new ArrayList<>();

        int promocionais = 0;

        for (int i = 0; i < cuponsIds.size(); i++) {
            Cupom cupom = cupomRepository.findById(cuponsIds.get(i))
                    .orElseThrow(() -> new IllegalArgumentException("Cupom não encontrado."));

            if (cupom.getValidade().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException(
                        "O cupom " + cupom.getCodigo() + " está vencido."
                );
            }

            if ("Promocional".equalsIgnoreCase(cupom.getTipoCupom().getNome())) {
                promocionais++;
            }
            cupons.add(cupom);
        }

        if (promocionais > 1) {
            throw new IllegalArgumentException(
                    "Apenas um cupom promocional pode ser utilizado por compra."
            );
        }

        return cupons;
    }

    private BigDecimal calcularDesconto(List<Cupom> cupons) {

        BigDecimal desconto = BigDecimal.ZERO;

        for (int i = 0; i < cupons.size(); i++) {
            desconto = desconto.add(cupons.get(i).getValor());
        }

        return desconto;
    }

    private void validarPagamento(
            Cliente cliente,
            FinalizarCompraDTO dto,
            BigDecimal total
    ) {
        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal valorPago = BigDecimal.ZERO;
        int quantidadeCartoes = 0;

        boolean possuiCupom = dto.getCuponsIds() != null && !dto.getCuponsIds().isEmpty();

        if (dto.getCartoes() != null) {
            for (int i = 0; i < dto.getCartoes().size(); i++) {
                Long cartaoId = dto.getCartoes().get(i).getCartaoId();
                BigDecimal valor = dto.getCartoes().get(i).getValor();

                if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
                    continue; // Se for zero ele pula
                }

                Cartao cartao = cartaoRepository.findById(cartaoId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Cartão não encontrado."));

                if (!cartao.getCliente().getId().equals(cliente.getId())) {
                    throw new IllegalArgumentException(
                            "O cartão não pertence ao cliente."
                    );
                }

                validarValorCartaoCupom(valor, total, possuiCupom);

                valorPago = valorPago.add(valor);
                quantidadeCartoes++;
            }
        }

        if (quantidadeCartoes == 0) {
            throw new IllegalArgumentException(
                    "Selecione ao menos uma forma de pagamento."
            );
        }

        if (valorPago.compareTo(total) != 0) {
            throw new IllegalArgumentException(
                    "O valor dos cartões deve ser igual ao total da compra."
            );
        }
    }

    private void validarValorCartaoCupom(
            BigDecimal valor,
            BigDecimal total,
            boolean possuiCupom
    ) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "O valor do cartão deve ser maior que zero."
            );
        }

        if (valor.compareTo(new BigDecimal("10.00")) < 0 && !(possuiCupom && total.compareTo(new BigDecimal("10.00")) < 0)) {
            throw new IllegalArgumentException(
                    "Cada cartão deve pagar no mínimo R$ 10,00."
            );
        }
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

    private void salvarPagamentos(
            Pedido pedido,
            Cliente cliente,
            FinalizarCompraDTO dto
    ) {
        if (dto.getCartoes() == null) {
            return;
        }

        for (int i = 0; i < dto.getCartoes().size(); i++) {
            CartaoPagamentoDTO cartaoDTO = dto.getCartoes().get(i);
            BigDecimal valor = cartaoDTO.getValor();

            if (valor != null && valor.compareTo(BigDecimal.ZERO) > 0) {
                Cartao cartao = cartaoRepository.findById(cartaoDTO.getCartaoId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Cartão não encontrado."));

                if (!cartao.getCliente().getId().equals(cliente.getId())) {
                    throw new IllegalArgumentException(
                            "O cartão não pertence ao cliente."
                    );
                }

                Pagamento pagamento = new Pagamento();
                pagamento.setPedido(pedido);
                pagamento.setCartao(cartao);
                pagamento.setValor(valor);

                pagamentoRepository.save(pagamento);
            }
        }
    }

    private void gerarCupomTroca(BigDecimal valor) {
        Cupom cupom = new Cupom();

        cupom.setCodigo("TROCA" + System.currentTimeMillis());
        cupom.setValor(valor);
        cupom.setValidade(LocalDate.now().plusDays(30));

        TipoCupom tipoTroca = tipoCupomRepository.findById(2L)
                .orElseThrow(() ->
                        new IllegalArgumentException("Tipo de cupom não encontrado."));

        cupom.setTipoCupom(tipoTroca);

        cupomRepository.save(cupom);
    }

    private String gerarCodigo() {
        int numero;

        do {
            numero = (int) (Math.random() * 900000) + 100000; /* gera numero decimal */
        } while (pedidoRepository.findByCodigo(String.valueOf(numero)).isPresent());

        return String.valueOf(numero);
    }

    public void alterarStatus(Long pedidoId, String descricao) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();

        StatusPedido status = statusPedidoRepository.findByDescricao(descricao).orElseThrow();

        if (descricao.equals("Aprovada")) {
            definirDataAprovacao(pedido);
        }

        if (descricao.equals("Reprovada")) {
            definirDataReprovacao(pedido);
        }

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

    public List<StatusPedido> listarProximosStatus(String statusAtual) {
        List<StatusPedido> status = new ArrayList<>();

        if (statusAtual.equals("Em processamento")) {
            status.add(statusPedidoRepository.findByDescricao("Aprovada").orElseThrow());
            status.add(statusPedidoRepository.findByDescricao("Reprovada").orElseThrow());
        }

        if (statusAtual.equals("Aprovada")) {
            status.add(statusPedidoRepository.findByDescricao("Em transporte").orElseThrow());
        }

        if (statusAtual.equals("Em transporte")) {
            status.add(statusPedidoRepository.findByDescricao("Entregue").orElseThrow());
        }

        return status;
    }

    private void definirDataAprovacao(Pedido pedido) {
        pedido.setDataAprovacao(LocalDateTime.now());
    }

    private void definirDataReprovacao(Pedido pedido) {
        pedido.setDataReprovacaoPagamento(LocalDateTime.now());
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
        List<Pedido> todos = pedidoRepository.findAll();
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
}
