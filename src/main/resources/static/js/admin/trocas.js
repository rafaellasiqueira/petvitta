// ==============================
// MODAL DE DETALHES DA TROCA
// ==============================

const modal = document.getElementById('modalTrocas');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');

botoesOlho.forEach(botao => {

    botao.addEventListener('click', function () {

        const linha = botao.closest('tr');
        const status = linha.querySelector('.dropdown').value;

        document.getElementById('modalCodigo').innerText = botao.dataset.codigo;
        document.getElementById('modalCliente').innerText = botao.dataset.cliente;
        document.getElementById('modalProduto').innerText = botao.dataset.produto;
        document.getElementById('modalMotivo').innerText = botao.dataset.motivo;
        document.getElementById('modalJustificativa').innerText = botao.dataset.justificativa;
        document.getElementById('modalSolicitado').innerText = botao.dataset.solicitado;

        // Status da troca
        const secaoStatus = document.getElementById('secaoStatus');
        const labelStatus = document.getElementById('labelStatus');
        const dataStatus = document.getElementById('modalDataStatus');

        secaoStatus.style.display = 'none';

        let mensagemStatus = '';

        if (status === 'Troca aceita') {
            mensagemStatus = 'Troca aceita em: ';
        }

        if (status === 'Item enviado') {
            mensagemStatus = 'Item enviado em: ';
        }

        if (status === 'Item recebido') {
            mensagemStatus = 'Item recebido em: ';
        }

        if (status === 'Troca processada') {
            mensagemStatus = 'Troca processada em: ';
        }

        if (status === 'Recusada') {
            mensagemStatus = 'Recusada em: ';
        }

        if (mensagemStatus !== '') {
            labelStatus.innerText = mensagemStatus;
            dataStatus.innerText = dataHoje();
            secaoStatus.style.display = 'block';
        }

        modal.classList.add('active');
    });
});


// Fecha o modal

btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});


// Data atual

function dataHoje() {
    return new Date().toLocaleDateString('pt-BR');
}


// ==============================
// MODAL DE ESTOQUE
// ==============================

const modalEstoque = document.getElementById('modalEstoque');
const btnFecharEstoque = document.getElementById('btnFecharEstoque');
const btnConfirmarEstoque = document.getElementById('btnConfirmarEstoque');
const listaItensEstoque = document.getElementById('listaItensEstoque');

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {

    dropdown.addEventListener('change', function () {

        if (dropdown.value === 'Item recebido') {

            const linha = dropdown.closest('tr');
            const botaoOlho = linha.querySelector('.btn-detalhes');

            const produto = botaoOlho.dataset.produto;

            listaItensEstoque.innerHTML = '';

            const itens = produto.split(',');

            itens.forEach(item => {

                const div = document.createElement('div');
                div.classList.add('item-estoque-linha');

                const texto = document.createElement('span');
                texto.innerText = item.trim();

                const quantidade = document.createElement('input');
                quantidade.type = 'number';
                quantidade.min = '1';
                quantidade.value = '1';
                quantidade.classList.add('quantidade-item');

                div.appendChild(texto);
                div.appendChild(quantidade);

                listaItensEstoque.appendChild(div);
            });

            modalEstoque.classList.add('active');
        }
    });
});


// ==============================
// FECHAR MODAL DE ESTOQUE
// ==============================

btnFecharEstoque.addEventListener('click', function () {
    modalEstoque.classList.remove('active');
});


// ==============================
// MODAL DE RESUMO
// ==============================

const modalResumo = document.getElementById('modalResumo');
const btnFecharResumo = document.getElementById('btnFecharResumo');

const resumoItens = document.getElementById('resumoItens');
const resumoCupom = document.getElementById('resumoCupom');


// Confirmar recebimento

btnConfirmarEstoque.addEventListener('click', function () {

    resumoItens.innerHTML = '';

    const itens = listaItensEstoque.querySelectorAll('.item-estoque-linha');

    itens.forEach(item => {

        const produto = item.querySelector('span').innerText;
        const quantidade = item.querySelector('.quantidade-item').value;

        const li = document.createElement('li');

        li.innerText = produto + ' - Quantidade: ' + quantidade;

        resumoItens.appendChild(li);
    });


    // Cupom fictício para o protótipo

    resumoCupom.innerText = 'TROCA-2026-001';


    modalEstoque.classList.remove('active');
    modalResumo.classList.add('active');
});


// Fechar modal de resumo

btnFecharResumo.addEventListener('click', function () {
    modalResumo.classList.remove('active');
});