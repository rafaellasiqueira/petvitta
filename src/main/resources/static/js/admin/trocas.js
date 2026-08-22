const modal = document.getElementById('modalTrocas');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');

botoesOlho.forEach(botao => {

    botao.addEventListener('click', function() {

        const linha = botao.closest('tr');
        const status = linha.querySelector('.dropdown').value;

        document.getElementById('modalCodigo').innerText = botao.dataset.codigo;
        document.getElementById('modalCliente').innerText = botao.dataset.cliente;
        document.getElementById('modalStatus').innerText = status;
        document.getElementById('modalProduto').innerText = botao.dataset.produto;
        document.getElementById('modalMotivo').innerText = botao.dataset.motivo;
        document.getElementById('modalSolicitado').innerText = botao.dataset.solicitado;

        const secaoStatus = document.getElementById('secaoStatus');
        const labelStatus = document.getElementById('labelStatus');
        const dataStatus = document.getElementById('modalDataStatus');

        secaoStatus.style.display = 'none';
        labelStatus.innerText = '';
        dataStatus.innerText = '';

        if (status === 'Troca aceita') {
            labelStatus.innerText = 'Troca aceita em: ';
            dataStatus.innerText = dataHoje();
            secaoStatus.style.display = 'block';
        }

        if (status === 'Item enviado') {
            labelStatus.innerText = 'Item enviado em: ';
            dataStatus.innerText = dataHoje();
            secaoStatus.style.display = 'block';
        }

        if (status === 'Item recebido') {
            labelStatus.innerText = 'Item recebido em: ';
            dataStatus.innerText = dataHoje();
            secaoStatus.style.display = 'block';
        }

        if (status === 'Troca processada') {
            labelStatus.innerText = 'Troca processada em: ';
            dataStatus.innerText = dataHoje();
            secaoStatus.style.display = 'block';
        }

        if (status === 'Recusada') {
                    labelStatus.innerText = 'Recusada em: ';
                    dataStatus.innerText = dataHoje();
                    secaoStatus.style.display = 'block';
        }

        modal.classList.add('active');
    });
});

btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});

function dataHoje() {
    return new Date().toLocaleDateString('pt-BR');
}


// Modal de estoque
const modalEstoque = document.getElementById('modalEstoque');
const btnFecharEstoque = document.getElementById('btnFecharEstoque');
const btnConfirmarEstoque = document.getElementById('btnConfirmarEstoque');
const listaItensEstoque = document.getElementById('listaItensEstoque');
const dropdowns = document.querySelectorAll('.dropdown');
let linhaAtual = null;

// Detecta alteração do status
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', function() {
        const novoStatus = dropdown.value;
        const linha = dropdown.closest('tr');
        linhaAtual = linha;

        // Item recebido
        if (novoStatus === 'Item recebido') {

            const botaoOlho = linha.querySelector('.btn-detalhes');
            const produto = botaoOlho.dataset.produto;

            listaItensEstoque.innerHTML = '';

            const itens = produto.split(',');

            itens.forEach(item => {

                const div = document.createElement('div');
                div.classList.add('item-estoque-linha');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.value = item.trim();

                const texto = document.createElement('span');
                texto.innerText = item.trim();

                const quantidade = document.createElement('input');
                quantidade.type = 'number';
                quantidade.min = 1;
                quantidade.max = parseInt(item.trim().match(/^\d+/)[0]);
                quantidade.value = 1;
                quantidade.classList.add('quantidade-item');

                div.appendChild(checkbox);
                div.appendChild(texto);
                div.appendChild(quantidade);

                listaItensEstoque.appendChild(div);
            });


            modalEstoque.classList.add('active');
        }
    });
});


// Fecha o modal de estoque
btnFecharEstoque.addEventListener('click', function() {
    modalEstoque.classList.remove('active');
});

// Modal de resumo
const modalResumo = document.getElementById('modalResumo');
const btnFecharResumo = document.getElementById('btnFecharResumo');
const resumoItens = document.getElementById('resumoItens');
const resumoCupom = document.getElementById('resumoCupom');

// Confirmar estoque
btnConfirmarEstoque.addEventListener('click', function() {
    const itensSelecionados = listaItensEstoque.querySelectorAll(
            'input[type="checkbox"]:checked'
    );

    resumoItens.innerHTML = '';

    itensSelecionados.forEach(item => {

        const linha = item.parentElement;

        const quantidade = linha.querySelector('.quantidade-item').value;

        const li = document.createElement('li');
        li.innerText =
            item.value + ' - Quantidade: ' + quantidade;

        resumoItens.appendChild(li);
    });


    // Gera o cupom
    const numero = Math.floor(10000 + Math.random() * 90000);
    const cupom = 'TROCA-' + numero;
    resumoCupom.innerText = cupom;

    // Altera o status
    if (linhaAtual) {
        const dropdown = linhaAtual.querySelector('.dropdown');
        dropdown.value = 'Troca processada';
    }

    // Fecha modal de estoque
    modalEstoque.classList.remove('active');

    // Abre modal de resumo
    modalResumo.classList.add('active');
});

// Fecha o modal de resumo
btnFecharResumo.addEventListener('click', function() {
    modalResumo.classList.remove('active');
});