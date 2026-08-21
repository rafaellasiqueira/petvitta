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

if (checkboxTodos) {
    checkboxTodos.onclick = function() {
        checkboxesProdutos.forEach(checkbox => {
            checkbox.checked = checkboxTodos.checked;
        });
        atualizarSubtotal();
    };
}

// Limpar carrinho
const btnLimpar = document.querySelector(".btn-limpar");

if (btnLimpar) {
    btnLimpar.onclick = function() {
        const produtos = document.querySelectorAll(".produto");
        produtos.forEach(produto => produto.remove());
        atualizarSubtotal();
    };
}

// Excluir produto
const botoesExcluir = document.querySelectorAll(".btn-excluir");

botoesExcluir.forEach(btn => {
    btn.onclick = function() {
        const produto = btn.closest(".produto");
        if (produto) {
            produto.remove();
            atualizarSubtotal();
        }
    };
});

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

        if (!checkbox || !checkbox.checked) {
            return;
        }

        const quantidade = parseInt(
            produto.querySelector('input[type="number"]').value
        ) || 1;

        const tamanho = produto.querySelector('.tamanho-opcao.active');
        if (tamanho) {
            const preco = parseFloat(tamanho.dataset.preco);
            total += preco * quantidade;
        }
    });

    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.innerText = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Toast
function mostrarToast() {
    const toast = document.getElementById("toast");

    if (toast) {
        toast.classList.add("ativo");

        setTimeout(function() {
            toast.classList.remove("ativo");
        }, 3000);
    }
}

// Finalizar a compra (Apenas uma declaração do botão)
const btnFinalizarCompra = document.querySelector('.btn-finalizar-a-compra');

if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', function(event) {
        const produtosSelecionados = document.querySelectorAll('.checkbox-produto:checked');

        // Se nenhum produto estiver selecionado, impede o redirecionamento e exibe o toast
        if (produtosSelecionados.length === 0) {
            event.preventDefault();
            mostrarToast();
        }
    });
}