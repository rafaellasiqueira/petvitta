// Toast
function adicionarCarrinho() {
    const toast = document.getElementById("toast");

    toast.classList.add("ativo"); // Adiciona a classe CSS que o elemento está ativo

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 2000);
}


// Precos
const precos = {
    '10.1 KG': 156.75,
    '15 KG': 199.90,
    '20 KG': 249.90
};

const inputQtd = document.querySelector('.seletor-quantidade input');
const [btnMenos, btnMais] = document.querySelectorAll('.btn-qtd');
const elementoPreco = document.querySelector('.preco');
const botoesTamanho = document.querySelectorAll('.tamanho-opcao');

let precoUnitario = precos['10.1 KG'];

function calcularTotal() {
    let valorTotal = precoUnitario * inputQtd.value;
    elementoPreco.innerText = 'R$ ' + valorTotal.toFixed(2).replace('.', ',');
}

botoesTamanho.forEach(btn => {
    btn.onclick = function() {
        botoesTamanho.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        let tamanho = btn.innerText;
        precoUnitario = precos[tamanho];
        calcularTotal();
    };
});

btnMais.onclick = function() {
    inputQtd.value++;
    calcularTotal();
};

btnMenos.onclick = function() {
    if (inputQtd.value > 1) {
        inputQtd.value--;
        calcularTotal();
    }
};