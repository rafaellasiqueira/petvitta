const modal = document.getElementById('modalDetalhesPedido');
const btnFechar = document.getElementById('btnFecharModalPedido');
const botoesDetalhes = document.querySelectorAll('.btn-ver-pedido');

const pedidoId = document.getElementById('modalPedidoId');
const pedidoData = document.getElementById('modalPedidoData');
const pedidoStatus = document.getElementById('modalPedidoStatus');
const pedidoPagamento = document.getElementById('modalPedidoPagamento');
const pedidoItens = document.getElementById('modalPedidoItens');
const pedidoValor = document.getElementById('modalPedidoValor');

// Abrir modal de detalhes
botoesDetalhes.forEach(botao => {
    botao.addEventListener('click', function () {
        pedidoId.textContent = botao.dataset.pedido;
        pedidoData.textContent = botao.dataset.data;
        pedidoStatus.textContent = botao.dataset.status;
        pedidoPagamento.textContent = botao.dataset.pagamento;
        pedidoItens.textContent = botao.dataset.itens;
        pedidoValor.textContent = botao.dataset.valor;

        modal.classList.add('active');
    });
});

// Fechar pelo X
btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});