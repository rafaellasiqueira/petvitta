function atualizarSubtotal() {
    let tamanho = document.querySelector('.tamanho-opcao.active');
    let quantidade = document.querySelector('.seletor-quantidade input');
    let preco = document.querySelector('.preco');

    if (tamanho) {
        let valor = parseFloat(tamanho.dataset.preco);
        let qtd = parseInt(quantidade.value);
        let total = valor * qtd;

        preco.innerText = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Quantidade

const inputQtd = document.querySelector('.seletor-quantidade input');
const btnMenos = document.querySelector('.btn-qtd.menos');
const btnMais = document.querySelector('.btn-qtd.mais');
const botoesTamanho = document.querySelectorAll('.tamanho-opcao');

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

// Toast
function adicionarCarrinho() {
    const toast = document.getElementById("toast");

    toast.classList.add("ativo");

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 2000);
}