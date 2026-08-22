const modal = document.getElementById('modalPedidos');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');


// =========================================================
// ABRIR MODAL
// =========================================================

botoesOlho.forEach(function(botao) {

    botao.addEventListener('click', function() {

        // Encontra a linha do pedido
        const linha = botao.closest('tr');

        // Pega o status selecionado
        const status = linha.querySelector('.dropdown').value;

        // =====================================================
        // INFORMAÇÕES DO PEDIDO
        // =====================================================

        document.getElementById('modalCodigo').textContent =
            botao.dataset.codigo;

        document.getElementById('modalCliente').textContent =
            botao.dataset.cliente;

        document.getElementById('modalData').textContent =
            botao.dataset.data;

        document.getElementById('modalStatus').textContent =
            status;

        document.getElementById('modalProdutos').textContent =
            botao.dataset.produtos.replaceAll('|', '\n');

        document.getElementById('modalSubtotal').textContent =
            botao.dataset.subtotal;

        document.getElementById('modalDescontos').textContent =
            botao.dataset.descontos;

        document.getElementById('modalTotal').textContent =
            botao.dataset.total;

        document.getElementById('modalEndereco').textContent =
            botao.dataset.endereco;


        // =====================================================
        // INFORMAÇÃO DE ACORDO COM O STATUS
        // =====================================================

        const labelStatus = document.getElementById('labelStatus');
        const dataStatus = document.getElementById('modalDataStatus');
        const secaoStatus = document.getElementById('secaoStatus');

        // Esconde a seção inicialmente
        secaoStatus.style.display = 'none';

        // Limpa os valores anteriores
        labelStatus.textContent = '';
        dataStatus.textContent = '';


        // =====================================================
        // PAGAMENTO REALIZADO
        // =====================================================

        if (status === 'Pagamento realizado') {

            labelStatus.textContent = 'Data do pagamento: ';

            dataStatus.textContent =
                botao.dataset.dataPagamento;

            secaoStatus.style.display = 'block';
        }


        // =====================================================
        // EM TRÂNSITO
        // =====================================================

        else if (status === 'Em trânsito') {

            labelStatus.textContent = 'Previsão de entrega: ';

            dataStatus.textContent =
                botao.dataset.previsaoEntrega;

            secaoStatus.style.display = 'block';
        }


        // =====================================================
        // ENTREGUE
        // =====================================================

        else if (status === 'Entregue') {

            labelStatus.textContent = 'Data de entrega: ';

            dataStatus.textContent =
                botao.dataset.dataEntrega;

            secaoStatus.style.display = 'block';
        }


        // =====================================================
        // CANCELADO
        // =====================================================

        else if (status === 'Cancelado') {

            labelStatus.textContent = 'Data do cancelamento: ';

            dataStatus.textContent =
                botao.dataset.dataCancelamento;

            secaoStatus.style.display = 'block';
        }


        // =====================================================
        // PAGAMENTO RECUSADO
        // =====================================================

        else if (status === 'Pagamento recusado') {

            labelStatus.textContent = 'Data da recusa: ';

            dataStatus.textContent =
                botao.dataset.dataRecusa;

            secaoStatus.style.display = 'block';
        }


        // =====================================================
        // ABRIR MODAL
        // =====================================================

        modal.classList.add('active');
    });
});


// =========================================================
// FECHAR MODAL
// =========================================================

btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});