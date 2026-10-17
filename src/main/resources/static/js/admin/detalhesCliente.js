document.addEventListener('DOMContentLoaded', function () {

    // Modal do pedido
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

            if (botao.dataset.status === "Reprovada") {
                pedidoStatus.textContent = "Reprovada";
            } else {
                pedidoStatus.textContent = "Aprovada";
            }

            const temCartao = botao.dataset.cartao === "true";
            const temCupom = botao.dataset.cupom === "true";

            let pagamento = "";

            if (temCartao && temCupom) {
                pagamento = "Cartão + Cupom";
            } else if (temCartao) {
                pagamento = "Cartão";
            } else if (temCupom) {
                pagamento = "Cupom";
            }
            pedidoPagamento.textContent = pagamento;

            pedidoValor.textContent = botao.dataset.valor;

            modal.classList.add('active');
        });
    });


    // Fechar pelo X
    btnFechar.addEventListener('click', function () {
        modal.classList.remove('active');
    });

});