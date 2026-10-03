// Funções de cálculo
function pegarValor(texto) {
    return parseFloat(texto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function calcularFrete(subtotal) {
    if (subtotal < 100) {
        return 20;
    }

    if (subtotal < 200) {
        return 15;
    }

    return 10;
}

function mostrarToast(mensagem) {
    const toast = document.getElementById('toastAtencao');

    toast.querySelector('p').textContent = mensagem;
    toast.classList.add('ativo');

    setTimeout(function () {
        toast.classList.remove('ativo');
    }, 5000);
}

function atualizarTotal() {
    const subtotalElemento = document.getElementById('subtotal');
    const freteElemento = document.getElementById('frete');
    const descontoElemento = document.getElementById('desconto');
    const totalElemento = document.getElementById('total');
    const produtosPrecos = document.querySelectorAll('.preco');
    const aviso = document.getElementById('avisoMinimoCartao');

    let subtotal = 0;

    produtosPrecos.forEach(function (produto) {
        subtotal += pegarValor(produto.textContent);
    });

    const frete = calcularFrete(subtotal);
    let desconto = 0;

    document.querySelectorAll('.checkbox-cupom:checked').forEach(function (checkbox) {
        const cupom = checkbox.closest('.modalCupom');
        desconto += parseFloat(cupom.dataset.valor) || 0;
    });

    const valorCompra = subtotal + frete;

    if (desconto > valorCompra) {
        desconto = valorCompra;
    }

    const total = valorCompra - desconto;

    if (total < 10 && desconto > 0) {
        aviso.textContent = 'O valor mínimo por cartão é de R$ 01,00.';
    }

    subtotalElemento.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    freteElemento.textContent = 'R$ ' + frete.toFixed(2).replace('.', ',');
    descontoElemento.textContent = '-R$ ' + desconto.toFixed(2).replace('.', ',');
    totalElemento.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('mostrarOutrosCartoes');
    const outrosCartoes = document.getElementById('outrosCartoes');

    if (checkbox && outrosCartoes) {
        checkbox.addEventListener('change', function () {
            outrosCartoes.hidden = !this.checked;
        });
    }

    const btnAlterarEndereco = document.getElementById('btnAlterarEndereco');
    const modalAlterarEndereco = document.getElementById('modalAlterarEndereco');
    const btnFecharModalAlterarEndereco = document.getElementById('btnFecharModalAlterarEndereco');

    if (btnAlterarEndereco && modalAlterarEndereco) {
        btnAlterarEndereco.addEventListener('click', function () {
            modalAlterarEndereco.classList.add('active');
        });
    }

    if (btnFecharModalAlterarEndereco && modalAlterarEndereco) {
        btnFecharModalAlterarEndereco.addEventListener('click', function () {
            modalAlterarEndereco.classList.remove('active');
        });
    }

    const modalCupom = document.getElementById('modalCupons');
    const btnAbrirModalCupom = document.getElementById('btnVerCupons');
    const btnFecharModalCupom = document.getElementById('btnFecharModalCupom');

    if (btnAbrirModalCupom && modalCupom) {
        btnAbrirModalCupom.addEventListener('click', function () {
            modalCupom.classList.add('active');
        });
    }

    if (btnFecharModalCupom && modalCupom) {
        btnFecharModalCupom.addEventListener('click', function () {
            modalCupom.classList.remove('active');
        });
    }

    atualizarTotal();

    const toastAtencao = document.getElementById('toastAtencao');

    document.querySelectorAll('.cartao-item').forEach(function (item) {
        const checkbox = item.querySelector('.checkbox-cartao');
        const campo = item.querySelector('.input-valor input');


        checkbox.addEventListener('change', function () {
            const total = pegarValor(document.getElementById('total').textContent);
            const desconto = pegarValor(document.getElementById('desconto').textContent.replace('-', ''));

            if (total === 0 && desconto > 0) {
                this.checked = false;
                campo.disabled = true;
                campo.value = '0';

                mostrarToast('A compra já foi paga com o(s) cupom(ns) selecionado(s).');
                return;
            }

            if (this.checked) {
                campo.disabled = false;

                if (total < 10 && desconto > 0) {
                    campo.value = '0.01';
                } else {
                    campo.value = '10.00';
                }
            } else {
                campo.disabled = true;
                campo.value = '0';
            }
        });

        campo.disabled = true;
        campo.value = '0';

        campo.addEventListener('blur', function () {
            const valor = parseFloat(this.value) || 0;
            const total = pegarValor(document.getElementById('total').textContent);
            const desconto = pegarValor(document.getElementById('desconto').textContent.replace('-', ''));
            let minimo = 10;

            if (total < 10 && desconto > 0) {
                minimo = 0.01;
            }

            if (valor > 0 && valor < minimo) {
                mostrarToast(
                    'O valor mínimo por cartão é de R$ ' +
                    minimo.toFixed(2).replace('.', ',') +
                    '.'
                );
            }
        });
    });

    const formFinalizarCompra = document.getElementById('formFinalizarCompra');

    formFinalizarCompra.addEventListener('submit', function (event) {
        const total = pegarValor(document.getElementById('total').textContent);
        let valorCartoes = 0;
        let cartoesSelecionados = 0;

        document.querySelectorAll('.cartao-item').forEach(function (item) {
            const checkbox = item.querySelector('.checkbox-cartao');
            const campo = item.querySelector('.input-valor input');

            if (checkbox && checkbox.checked && campo) {
                valorCartoes += parseFloat(campo.value) || 0;
                cartoesSelecionados++;

                const indice = cartoesSelecionados - 1;

                const inputId = document.createElement('input');
                inputId.type = 'hidden';
                inputId.name = 'cartoes[' + indice + '].cartaoId';
                inputId.value = checkbox.value;

                const inputValor = document.createElement('input');
                inputValor.type = 'hidden';
                inputValor.name = 'cartoes[' + indice + '].valor';
                inputValor.value = campo.value;

                formFinalizarCompra.appendChild(inputId);
                formFinalizarCompra.appendChild(inputValor);
            }
        });

        if (total > 0 && cartoesSelecionados === 0) {
            event.preventDefault();
            mostrarToast('Selecione pelo menos um cartão para finalizar a compra.');
            return;
        }

        if (valorCartoes < total) {
            event.preventDefault();
            mostrarToast(
                'Ainda falta informar R$ ' +
                (total - valorCartoes).toFixed(2).replace('.', ',') +
                ' para finalizar a compra.'
            );
            return;
        }

        if (valorCartoes > total) {
            event.preventDefault();
            mostrarToast('O valor informado nos cartões é maior que o total da compra.');
        }
    });
});

