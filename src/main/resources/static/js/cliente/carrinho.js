// Atualizar subtotal
function atualizarSubtotal() {
    let total = 0;
    let produtos = document.querySelectorAll('.produto');

    produtos.forEach(produto => {
        let checkbox = produto.querySelector('.checkbox-produto');

        if (checkbox.checked) {
            let quantidade = produto.querySelector('.seletor-quantidade input');
            let tamanho = produto.querySelector('.tamanho-opcao.active');

            let valor = parseFloat(tamanho.dataset.valor);
            let qtd = parseInt(quantidade.value);

            total = total + (valor * qtd);
        }
    });

    let subtotal = document.getElementById('subtotal');

    subtotal.innerText = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

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

    inputQtd.addEventListener('input', function() {
        if (this.value < 1) {
            this.value = 1;
        }

        atualizarSubtotal();
    });

});

// Mudar o tamanho
document.querySelectorAll('.produto').forEach(produto => {

    const botoesTamanho = produto.querySelectorAll('.tamanho-opcao');

    botoesTamanho.forEach(btn => {
        btn.onclick = () => {
            botoesTamanho.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            atualizarSubtotal();

            let tamanho = produto.querySelector('.tamanho-opcao.active');
            let valorAtualizado = produto.querySelector('.preco-produto');

            valorAtualizado.innerText = tamanho.dataset.valor;
        };
    });
});

// Checkbox
const checkboxTodos = document.getElementById("todos");
const checkboxesProdutos = document.querySelectorAll(".checkbox-produto");

// Checkbox de produto
checkboxesProdutos.forEach(checkbox => {
    checkbox.onclick = function() {
        atualizarSubtotal();

        if (!this.checked) {
            checkboxTodos.checked = false;
        }
    };
});

// Checkbox todos
checkboxTodos.onclick = function() {
    checkboxesProdutos.forEach(checkbox => {
        checkbox.checked = checkboxTodos.checked;
    });
    atualizarSubtotal();
};

// Finalizar a compra
const btnFinalizarCompra = document.querySelector('.btn-finalizar-a-compra');

btnFinalizarCompra.addEventListener('click', function(event) {
    const produtosSelecionados = document.querySelectorAll('.checkbox-produto:checked');

    // Se nenhum produto estiver selecionado, impede o redirecionamento e exibe o toast
    if (produtosSelecionados.length === 0) {
        event.preventDefault();
        mostrarToast();
    }
});




