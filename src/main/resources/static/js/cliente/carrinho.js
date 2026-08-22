// Atualizar subtotal
function atualizarSubtotal() {
    let total = 0;
    let produtos = document.querySelectorAll('.produto');

    produtos.forEach(produto => {
        let checkbox = produto.querySelector('.checkbox-produto');

        if (checkbox.checked) {
            let input = produto.querySelector('input[type="number"]');
            let quantidade = parseInt(input.value);
            let tamanho = produto.querySelector('.tamanho-opcao.active');

            if (tamanho) {
                let preco = parseFloat(tamanho.dataset.preco);
                total = total + (preco * quantidade);
            }
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

// Limpar carrinho
const btnLimpar = document.getElementById("btn-limpar");

if (btnLimpar) {
    btnLimpar.onclick = function() {
        const produtos = document.querySelectorAll(".produto");
        produtos.forEach(produto => produto.remove());
        atualizarSubtotal();
    };
}

// Toast
function mostrarToast() {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.classList.add("ativo");

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 3000);
}

// Finalizar a compra
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



