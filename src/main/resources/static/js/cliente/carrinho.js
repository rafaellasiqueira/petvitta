// Quantidade
document.querySelectorAll('.seletor-quantidade').forEach(seletor => {

    const inputQtd = seletor.querySelector('input');
    const btnMenos = seletor.querySelector('.btn-qtd.menos');
    const btnMais = seletor.querySelector('.btn-qtd.mais');

    btnMais.onclick = () => {
        inputQtd.value++;
        atualizarSubtotal();
    };

    btnMenos.onclick = () => {
        if (inputQtd.value > 1) {
            inputQtd.value--;
            atualizarSubtotal();
        }
    };

});

// Selecionar todos
const checkboxTodos = document.getElementById("todos");
const checkboxesProdutos = document.querySelectorAll(".checkbox-produto");

checkboxesProdutos.forEach(checkbox => {
    checkbox.onclick = function() {
        atualizarSubtotal();

        if (!this.checked) {
            checkboxTodos.checked = false;
        }
    };
});

checkboxTodos.onclick = function() {

    for (let i = 0; i < checkboxesProdutos.length; i++) {
        checkboxesProdutos[i].checked = checkboxTodos.checked;
    }

    for (let i = 0; i < checkboxesProdutos.length; i++) {
        checkboxesProdutos[i].onclick = function() {
            if (this.checked === false) {
                checkboxTodos.checked = false;
            }

            atualizarSubtotal();
        };
    }

    atualizarSubtotal();
};

// Limpar carrinho
const btnLimpar = document.querySelector(".btn-limpar")

btnLimpar.onclick = function() {
    const produtos = document.querySelectorAll(".produto");

    for (let i = 0; i < produtos.length; i++) {
        produtos[i].remove();
    }
};

// Excluir produto
const botoesExcluir = document.querySelectorAll(".btn-excluir");

for (let i = 0; i < botoesExcluir.length; i++) {
    botoesExcluir[i].onclick = function() {
        const produto = botoesExcluir[i].closest(".produto");
        produto.remove();
    };
}

// Mudar o tamanho
document.querySelectorAll('.produto').forEach(produto => {

    const botoesTamanho = produto.querySelectorAll('.tamanho-opcao');

    botoesTamanho.forEach(btn => {
        btn.onclick = () => {
            botoesTamanho.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            atualizarSubtotal();
        };
    });
});

// Atualizar subtotal
function atualizarSubtotal() {
    let total = 0;

    document.querySelectorAll('.produto').forEach(produto => {
        const checkbox = produto.querySelector('.checkbox-produto');

        if (!checkbox.checked) {
            return;
        }

        const quantidade = parseInt(
            produto.querySelector('input[type="number"]').value
        ) || 1;

        const tamanho = produto.querySelector('.tamanho-opcao.active');
        const preco = parseFloat(tamanho.dataset.preco);
        total += preco * quantidade;
    });

    document.getElementById('subtotal').innerText =
        total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
}

