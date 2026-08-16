const modal = document.getElementById('modalPedidos');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');


// Abrir modal
botoesOlho.forEach(function(botao) {

    botao.addEventListener('click', function() {

        // Encontra a linha do pedido
        const linha = botao.closest('tr');

        // Pega o status selecionado
        const status = linha.querySelector('.dropdown').value;

        // Informações do pedido
        document.getElementById('modalCodigo').textContent = botao.dataset.codigo;
        document.getElementById('modalCliente').textContent = botao.dataset.cliente;
        document.getElementById('modalData').textContent = botao.dataset.data;
        document.getElementById('modalStatus').textContent = status;
        document.getElementById('modalProdutos').textContent =
            botao.dataset.produtos.replaceAll('|', '\n');

        document.getElementById('modalSubtotal').textContent = botao.dataset.subtotal;
        document.getElementById('modalDescontos').textContent = botao.dataset.descontos;
        document.getElementById('modalTotal').textContent = botao.dataset.total;
        document.getElementById('modalEndereco').textContent = botao.dataset.endereco;


        // Informação de acordo com o status
        const labelStatus = document.getElementById('labelStatus');
        const dataStatus = document.getElementById('modalDataStatus');
        const secaoStatus = document.getElementById('secaoStatus');


        // Primeiro esconde a seção
        secaoStatus.style.display = 'none';


        if (status === 'Aprovado') {

            labelStatus.textContent = 'Data de aprovação: ';
            dataStatus.textContent = botao.dataset.dataAprovacao;

            secaoStatus.style.display = 'block';

        } else if (status === 'Em trânsito') {

            labelStatus.textContent = 'Previsão de entrega: ';
            dataStatus.textContent = botao.dataset.previsaoEntrega;

            secaoStatus.style.display = 'block';

        } else if (status === 'Entregue') {

            labelStatus.textContent = 'Data de entrega: ';
            dataStatus.textContent = botao.dataset.dataEntrega;

            secaoStatus.style.display = 'block';

        } else if (status === 'Cancelado') {

            labelStatus.textContent = 'Data do cancelamento: ';
            dataStatus.textContent = botao.dataset.dataCancelamento;

            secaoStatus.style.display = 'block';

        } else if (status === 'Pagamento recusado') {

            labelStatus.textContent = 'Data da recusa: ';
            dataStatus.textContent = botao.dataset.dataRecusa;

            secaoStatus.style.display = 'block';
        }


        // Abre o modal
        modal.classList.add('active');
    });
});


// Fechar modal
btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});