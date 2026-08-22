// =========================================================
// MODAL DE DETALHES
// =========================================================

const modal = document.getElementById('modalTrocas');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');


// Abre o modal de detalhes
botoesOlho.forEach(botao => {

    botao.addEventListener('click', function() {

        document.getElementById('modalCodigo').innerText =
            botao.dataset.codigo;

        document.getElementById('modalCliente').innerText =
            botao.dataset.cliente;

        document.getElementById('modalProduto').innerText =
            botao.dataset.produto;

        document.getElementById('modalMotivo').innerText =
            botao.dataset.motivo;

        document.getElementById('modalSolicitado').innerText =
            botao.dataset.solicitado;

        modal.classList.add('active');
    });
});


// Fecha o modal de detalhes
btnFechar.addEventListener('click', function() {

    modal.classList.remove('active');

});


// =========================================================
// MODAL DE ESTOQUE
// =========================================================

const modalEstoque = document.getElementById('modalEstoque');
const btnFecharEstoque = document.getElementById('btnFecharEstoque');
const btnConfirmarEstoque = document.getElementById('btnConfirmarEstoque');
const listaItensEstoque = document.getElementById('listaItensEstoque');


// Pega todos os dropdowns da tabela
const dropdowns = document.querySelectorAll('.dropdown');


// Guarda qual linha está sendo processada
let linhaAtual = null;


// Detecta alteração do status
dropdowns.forEach(dropdown => {

    dropdown.addEventListener('change', function() {

        const novoStatus = dropdown.value;

        // Encontra a linha do pedido
        const linha = dropdown.closest('tr');

        // Guarda a linha atual
        linhaAtual = linha;


        // =====================================================
        // ITEM RECEBIDO
        // =====================================================

        if (novoStatus === 'Item recebido') {

            // Pega o botão de detalhes da mesma linha
            const botaoOlho = linha.querySelector('.btn-detalhes');

            // Pega os produtos
            const produto = botaoOlho.dataset.produto;


            // Limpa a lista anterior
            listaItensEstoque.innerHTML = '';


            // Separa os produtos pela vírgula
            const itens = produto.split(',');


            // Cria os checkboxes
            itens.forEach(item => {

                const div = document.createElement('div');

                div.classList.add('item-estoque-linha');


                const checkbox = document.createElement('input');

                checkbox.type = 'checkbox';
                checkbox.value = item.trim();
                checkbox.checked = true;

                checkbox.classList.add('checkbox');


                const texto = document.createElement('span');

                texto.innerText = item.trim();
                texto.classList.add('texto-item');


                div.appendChild(checkbox);
                div.appendChild(texto);

                listaItensEstoque.appendChild(div);
            });


            // Abre o modal de estoque
            modalEstoque.classList.add('active');
        }

    });

});


// =========================================================
// FECHAR MODAL DE ESTOQUE
// =========================================================

btnFecharEstoque.addEventListener('click', function() {

    modalEstoque.classList.remove('active');

});


// =========================================================
// MODAL DE RESUMO
// =========================================================

const modalResumo = document.getElementById('modalResumo');
const btnFecharResumo = document.getElementById('btnFecharResumo');

const resumoItens = document.getElementById('resumoItens');
const resumoCupom = document.getElementById('resumoCupom');


// =========================================================
// CONFIRMAR ESTOQUE
// =========================================================

btnConfirmarEstoque.addEventListener('click', function() {

    // Pega somente os itens marcados
    const itensSelecionados =
        listaItensEstoque.querySelectorAll(
            'input[type="checkbox"]:checked'
        );


    // Limpa o resumo
    resumoItens.innerHTML = '';


    // Adiciona os itens ao resumo
    itensSelecionados.forEach(item => {

        const li = document.createElement('li');

        li.innerText =
            item.value + ' voltou para o estoque';

        resumoItens.appendChild(li);

    });


    // =====================================================
    // GERA CUPOM
    // =====================================================

    const numero =
        Math.floor(10000 + Math.random() * 90000);

    const cupom =
        'TROCA-' + numero;

    resumoCupom.innerText = cupom;


    // =====================================================
    // ALTERA O STATUS
    // =====================================================

    if (linhaAtual) {

        const dropdown =
            linhaAtual.querySelector('.dropdown');

        dropdown.value = 'Troca processada';

    }


    // Fecha modal de estoque
    modalEstoque.classList.remove('active');


    // Abre modal de resumo
    modalResumo.classList.add('active');

});


// =========================================================
// FECHAR MODAL DE RESUMO
// =========================================================

btnFecharResumo.addEventListener('click', function() {

    modalResumo.classList.remove('active');

});