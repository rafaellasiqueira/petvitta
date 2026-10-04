function atualizarSubtotal() {
    let tamanho = document.querySelector('.tamanho-opcao.active');
    let quantidade = document.querySelector('.seletor-quantidade input');
    let preco = document.querySelector('.preco');

    let valor = parseFloat(tamanho.dataset.valor);
    let qtd = parseInt(quantidade.value);
    let total = valor * qtd;

    preco.innerText = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


// Quantidade e tamanho
const inputQtd = document.querySelector('.seletor-quantidade input');
const btnMenos = document.querySelector('.btn-qtd.menos');
const btnMais = document.querySelector('.btn-qtd.mais');
const botoesTamanho = document.querySelectorAll('.tamanho-opcao');


// Primeiro tamanho
const primeiroTamanho = document.querySelector('.tamanho-opcao');

if (primeiroTamanho) {
    primeiroTamanho.classList.add('active');
    atualizarSubtotal();
}


// Trocar tamanho
botoesTamanho.forEach(btn => {
    btn.onclick = function() {
        botoesTamanho.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        atualizarSubtotal();
    };
});

btnMais.onclick = function() {
    inputQtd.value++;
    atualizarSubtotal();
    verificarEstoque();
};

btnMenos.onclick = function() {
    if (inputQtd.value > 1) {
        inputQtd.value--;
        atualizarSubtotal();
        verificarEstoque();
    }
};

inputQtd.addEventListener('input', function() {
    if (this.value < 1) {
        this.value = 1;
    }
    atualizarSubtotal();
    verificarEstoque();
});

// Estoque
const mensagemEstoque = document.querySelector('#mensagemEstoque');

function verificarEstoque() {
    const tamanho = document.querySelector('.tamanho-opcao.active');
    const quantidade = parseInt(inputQtd.value);
    const estoque = parseInt(tamanho.dataset.estoque);

    if (quantidade > estoque) {
        mensagemEstoque.textContent = 'Quantidade maior que o estoque disponível.';
        return false;
    }

    mensagemEstoque.textContent = '';
    return true;
}

// Enviar
const formAdicionar = document.querySelector('#formAdicionar');
const btnAdicionar = document.querySelector('.btn-adicionar-carrinho');

btnAdicionar.addEventListener('click', function() {

    const tamanho = document.querySelector('.tamanho-opcao.active');
    const quantidade = document.querySelector('[name="quantidade"]');
    const variacaoId = document.querySelector('[name="variacaoId"]');

    if (!verificarEstoque()) {
        return;
    }

    variacaoId.value = tamanho.dataset.id;
    quantidade.value = inputQtd.value;

    formAdicionar.action = '/cliente/carrinho/adicionar';

    formAdicionar.submit();
});

