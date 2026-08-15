const modal = document.getElementById('modalTrocas');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');


// Modal detalhes
botoesOlho.forEach(botao => {

    botao.addEventListener('click', function() {
        document.getElementById('modalCodigo').innerText = botao.dataset.codigo;
        document.getElementById('modalCliente').innerText = botao.dataset.cliente;
        document.getElementById('modalProduto').innerText = botao.dataset.produto;
        document.getElementById('modalMotivo').innerText = botao.dataset.motivo;
        document.getElementById('modalSolicitado').innerText = botao.dataset.solicitado;
        modal.classList.add('active');
    });
});

// fechar o modal de detalhes
btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});

// modal de estoque
const modalEstoque = document.getElementById('modalEstoque');
const btnFecharEstoque = document.getElementById('btnFecharEstoque');
const btnConfirmarEstoque = document.getElementById('btnConfirmarEstoque');
const listaItensEstoque = document.getElementById('listaItensEstoque');

// pega os dropdowns da tabelas
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', function() { // sempre quando alguem escolhe ele verifica
        // Se escolheu "Itens recebidos"
        if (dropdown.value === 'Itens recebidos') {
            // Pega a linha onde o select foi clicado
            const linha = dropdown.closest('tr');
            // Pega o produto dessa linha
            const botaoOlho = linha.querySelector('.btn-detalhes');
            const produto = botaoOlho.dataset.produto;
            // Limpa a lista
            listaItensEstoque.innerHTML = '';
            // Separa os produtos pela vírgula
            const itens = produto.split(',');
            // Cria os checkboxes
            itens.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('item-estoque-linha'); // Classe do container

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = item.trim();
                checkbox.checked = true;
                checkbox.classList.add('checkbox'); // Classe do checkbox

                const texto = document.createElement('span');
                texto.innerText = item.trim();
                texto.classList.add('texto-item'); // Classe da fonte

                div.appendChild(checkbox);
                div.appendChild(texto);
                listaItensEstoque.appendChild(div);
            });
            // Abre o modal
            modalEstoque.classList.add('active');
        }
    });
});

// fecha o modal de estoque
btnFecharEstoque.addEventListener('click', function() {
    modalEstoque.classList.remove('active');
});


// modal resumo
const modalResumo = document.getElementById('modalResumo');
const btnFecharResumo = document.getElementById('btnFecharResumo');
const resumoItens = document.getElementById('resumoItens');
const resumoCupom = document.getElementById('resumoCupom');

// confirma estoque
btnConfirmarEstoque.addEventListener('click', function() {
    // Pega os itens marcados
    const itensSelecionados = listaItensEstoque.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    // Limpa o resumo
    resumoItens.innerHTML = '';

    // Coloca cada item no resumo
    itensSelecionados.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item.value + ' voltou para o estoque';
        resumoItens.appendChild(li);
    });

    // Gera o código do cupom
    const numero = Math.floor(10000 + Math.random() * 90000);
    const cupom = 'TROCA-' + numero;
    resumoCupom.innerText = cupom;

    // Fecha o modal de estoque
    modalEstoque.classList.remove('active');

    // Abre o modal de resumo
    modalResumo.classList.add('active');
});

// fecha o modal de resumo
btnFecharResumo.addEventListener('click', function() {
    modalResumo.classList.remove('active');
});