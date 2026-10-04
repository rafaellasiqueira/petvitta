function atualizarSubtotal() {
    let total = 0;

    const produtosSelecionados = document.querySelectorAll(
        '.produto:has(.checkbox-produto:checked)'
    );

    produtosSelecionados.forEach(produto => {
        const tamanho = produto.querySelector('.tamanho-opcao.active');
        const quantidade = produto.querySelector('.seletor-quantidade input');

        const valor = parseFloat(tamanho.dataset.valor);
        const qtd = parseInt(quantidade.value);

        total += valor * qtd;
    });

    document.getElementById('subtotal').innerText =
        total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
}

function alterarQuantidade(itemId, quantidade) {
    fetch(`/cliente/carrinho/quantidade?itemId=${itemId}&quantidade=${quantidade}`, {
        method: 'POST'
    });
}

function alterarTamanho(itemId, variacaoId) {
    fetch(`/cliente/carrinho/tamanho?itemId=${itemId}&variacaoId=${variacaoId}`, {
        method: 'POST'
    });
}

function verificarEstoque(produto) {
    const tamanho = produto.querySelector('.tamanho-opcao.active');
    const quantidadeInput = produto.querySelector('.seletor-quantidade input');
    const mensagemEstoque = produto.querySelector('.mensagem-estoque');

    const quantidade = parseInt(quantidadeInput.value);
    const estoque = parseInt(tamanho.dataset.estoque);

    if (quantidade > estoque) {
        mensagemEstoque.textContent = 'Quantidade maior que o estoque disponível.';

        return false;
    }

    mensagemEstoque.textContent = '';
    return true;
}

document.querySelectorAll('.seletor-quantidade').forEach(seletor => {
    const inputQtd = seletor.querySelector('input');
    const btnMenos = seletor.querySelector('.btn-qtd.menos');
    const btnMais = seletor.querySelector('.btn-qtd.mais');
    const produto = seletor.closest('.produto');
    const itemId = produto.dataset.itemId;

    btnMais.onclick = () => {
        inputQtd.value = parseInt(inputQtd.value) + 1;

        alterarQuantidade(itemId, inputQtd.value);
        verificarEstoque(produto);
        atualizarSubtotal();
    };

    btnMenos.onclick = () => {
        if (parseInt(inputQtd.value) <= 1) {
            return;
        }

        inputQtd.value = parseInt(inputQtd.value) - 1;

        alterarQuantidade(itemId, inputQtd.value);
        verificarEstoque(produto);
        atualizarSubtotal();
    };

    inputQtd.addEventListener('input', function () {
        let quantidade = parseInt(this.value);

        if (quantidade < 1) {
            quantidade = 1;
            this.value = 1;
        }

        verificarEstoque(produto);
        atualizarSubtotal();
    });

    inputQtd.addEventListener('change', function () {
        let quantidade = parseInt(this.value);

        if (quantidade < 1) {
            quantidade = 1;
            this.value = 1;
        }

        if (verificarEstoque(produto)) {
            alterarQuantidade(itemId, quantidade);
        }

        atualizarSubtotal();
    });

});

// Tamanho
document.querySelectorAll('.produto').forEach(produto => {
    const botoesTamanho = produto.querySelectorAll('.tamanho-opcao');

    botoesTamanho.forEach(btn => {
        btn.onclick = () => {

            botoesTamanho.forEach(botao => {
                botao.classList.remove('active');
            });

            btn.classList.add('active');

            const itemId = produto.dataset.itemId;
            const variacaoId = btn.dataset.variacaoId;

            alterarTamanho(itemId, variacaoId);

            const valorAtualizado = produto.querySelector('.preco-produto');

            if (valorAtualizado) {
                valorAtualizado.innerText = btn.dataset.valor;
            }

            verificarEstoque(produto);
            atualizarSubtotal();
        };

    });

});

// Selecionar todos
const checkboxTodos = document.getElementById('todos');
const checkboxesProdutos = document.querySelectorAll('.checkbox-produto');

// Desmarca o checkbox de todos
checkboxesProdutos.forEach(checkbox => {
    checkbox.addEventListener('change', function () {

        if (!this.checked && checkboxTodos) {
            checkboxTodos.checked = false;
        }
        atualizarSubtotal();
    });

});

// Checkbox todos
checkboxTodos.addEventListener('change', function () {
    checkboxesProdutos.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
    atualizarSubtotal();
});

// Toast
function mostrarToast() {
    const toast = document.getElementById('toastAtencao');

    toast.classList.add('ativo');

    setTimeout(() => {
        toast.classList.remove('ativo');
    }, 6000);
}

// Finalizar botão
const formFinalizarCompra = document.getElementById('formFinalizarCompra');
formFinalizarCompra.addEventListener('submit', function (event) {

    const produtosSelecionados = document.querySelectorAll(
        '.checkbox-produto:checked'
    );

    if (produtosSelecionados.length === 0) {
        event.preventDefault();
        mostrarToast();
        return;
    }

    const itensSelecionados = document.getElementById('itensSelecionados');

    itensSelecionados.innerHTML = '';

    produtosSelecionados.forEach(checkbox => {
        const produto = checkbox.closest('.produto');
        const itemId = produto.dataset.itemId;
        const input = document.createElement('input');

        input.type = 'hidden';
        input.name = 'itensSelecionados';
        input.value = itemId;

        itensSelecionados.appendChild(input);
    });

});


atualizarSubtotal();

document.querySelectorAll('.produto').forEach(produto => {
    verificarEstoque(produto);
});