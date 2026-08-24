function atualizarSubtotal() {
    let tamanho = document.querySelector('.tamanho-opcao.active');
    let quantidade = document.querySelector('.seletor-quantidade input');
    let preco = document.querySelector('.preco');

    let valor = parseFloat(tamanho.dataset.preco);
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

// Tamanho
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
};

btnMenos.onclick = function() {
    if (inputQtd.value > 1) {
        inputQtd.value--;
        atualizarSubtotal();
    }
};

inputQtd.addEventListener('input', function() {
    if (this.value < 1) {
        this.value = 1;
    }

    atualizarSubtotal();
});

// Toast
function adicionarCarrinho() {
    const toast = document.getElementById("toast");

    toast.classList.add("ativo");

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 2000);
}