const modal = document.getElementById('modalPedidos');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');

// Abre o modal
botoesOlho.forEach(function(botao) {

    botao.addEventListener('click', function() {

        const linha = botao.closest('tr');
        const status = linha.querySelector('.dropdown').value;

        // Informações do pedido
        document.getElementById('modalCodigo').textContent = botao.dataset.codigo;
        document.getElementById('modalCliente').textContent = botao.dataset.cliente;
        document.getElementById('modalData').textContent = botao.dataset.data;
        document.getElementById('modalStatus').textContent = status;
        document.getElementById('modalProdutos').textContent = botao.dataset.produtos.replaceAll('|', '\n');
        document.getElementById('modalSubtotal').textContent = botao.dataset.subtotal;
        document.getElementById('modalDescontos').textContent = botao.dataset.descontos;
        document.getElementById('modalTotal').textContent = botao.dataset.total;
        document.getElementById('modalEndereco').textContent = botao.dataset.endereco;

        const labelStatus = document.getElementById('labelStatus');
        const dataStatus = document.getElementById('modalDataStatus');
        const secaoStatus = document.getElementById('secaoStatus');

        // Limpa
        secaoStatus.style.display = 'none';
        labelStatus.textContent = '';
        dataStatus.textContent = '';

        // Pagamento realizado
        if (status === 'Pagamento realizado') {
            labelStatus.textContent = 'Data do pagamento: ';
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = 'block';
        }

        // Em trânsito
        if (status === 'Em trânsito') {
            labelStatus.textContent = 'Data prevista de entrega: ';
            dataStatus.textContent = dataHoje(10);
            secaoStatus.style.display = 'block';
        }

        // Entregue
        if (status === 'Entregue') {
            labelStatus.textContent = 'Data de entrega: ';
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = 'block';
        }

        // Cancelado
        if (status === 'Cancelado') {
            labelStatus.textContent = 'Data do cancelamento: ';
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = 'block';
        }

        // Pagamento recusado
        if (status === 'Pagamento recusado') {
            labelStatus.textContent = 'Data da recusa: ';
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = 'block';
        }

        // Abre o modal
        modal.classList.add('active');
    });
});

// Data de hoje
function dataHoje(dias = 0) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data.toLocaleDateString('pt-BR');
}

// Fecha o modal
btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});