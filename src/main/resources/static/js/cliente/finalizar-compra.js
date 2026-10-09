// Funções de cálculo
function pegarValor(texto) {
    return parseFloat(texto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function calcularFrete(quantidadeItens, siglaEstado) {

    let frete = 0;

    if (quantidadeItens >= 3 && quantidadeItens < 6) {
        frete += 4;
    }

    if (quantidadeItens >= 6) {
        frete += 8;
    }

    // Valor conforme o estado de destino
    if (siglaEstado === 'SP') {
        frete += 7;
    }
    else if (siglaEstado === 'RJ') {
        frete += 8;
    }
    else if (siglaEstado === 'MG') {
        frete += 8;
    }
    else if (siglaEstado === 'ES') {
        frete += 10;
    }
    else if (siglaEstado === 'PR') {
        frete += 10;
    }
    else if (siglaEstado === 'SC') {
        frete += 12;
    }
    else if (siglaEstado === 'MS') {
        frete += 12;
    }
    else if (siglaEstado === 'GO') {
        frete += 13;
    }
    else if (siglaEstado === 'RS') {
        frete += 15;
    }
    else if (siglaEstado === 'DF') {
        frete += 15;
    }
    else if (siglaEstado === 'MT') {
        frete += 16;
    }
    else if (siglaEstado === 'BA') {
        frete += 18;
    }
    else if (siglaEstado === 'SE') {
        frete += 19;
    }
    else if (siglaEstado === 'AL') {
        frete += 20;
    }
    else if (siglaEstado === 'PE') {
        frete += 21;
    }
    else if (siglaEstado === 'PB') {
        frete += 22;
    }
    else if (siglaEstado === 'RN') {
        frete += 23;
    }
    else if (siglaEstado === 'CE') {
        frete += 24;
    }
    else if (siglaEstado === 'PI') {
        frete += 24;
    }
    else if (siglaEstado === 'MA') {
        frete += 25;
    }
    else if (siglaEstado === 'TO') {
        frete += 25;
    }
    else if (siglaEstado === 'PA') {
        frete += 28;
    }
    else if (siglaEstado === 'RO') {
        frete += 30;
    }
    else if (siglaEstado === 'AC') {
        frete += 32;
    }
    else if (siglaEstado === 'AM') {
        frete += 35;
    }
    else if (siglaEstado === 'AP') {
        frete += 35;
    }
    else if (siglaEstado === 'RR') {
        frete += 38;
    }

    return frete;
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

    let quantidadeItens = 0;

    document.querySelectorAll('.quantidade-produto').forEach(function (elemento) {
        quantidadeItens += parseInt(elemento.textContent.replace('Quantidade: ', ''));
    });

    const endereco = document.querySelector('.endereco');
    const siglaEstado = endereco.dataset.estado;

    const frete = calcularFrete(
        quantidadeItens,
        siglaEstado
    );

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
    // Abrir modal de alterar endereço
    const btnAlterarEndereco = document.querySelector('.btnAlterarEndereco')
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

    // Abrir modal
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

    // Quando licar em outros cartões
    const checkbox = document.getElementById('mostrarOutrosCartoes');
    const outrosCartoes = document.getElementById('outrosCartoes');

    if (checkbox && outrosCartoes) {
        checkbox.addEventListener('change', function () {
            outrosCartoes.hidden = !this.checked;
        });
    }

    atualizarTotal();

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
                mostrarToast('O valor mínimo por cartão é de R$ ' + minimo.toFixed(2).replace('.', ',') + '.');
            }
        });
    });

    // Cartões temporários
    document.querySelectorAll('.cartao-temporario').forEach(function (cartaoTemporario) {

        const checkboxTemporario = cartaoTemporario.querySelector('.checkbox-cartao-temporario');
        const campoTemporario = cartaoTemporario.querySelector('.input-valor input');

        checkboxTemporario.addEventListener('change', function () {
            const total = pegarValor(document.getElementById('total').textContent);
            const desconto = pegarValor(document.getElementById('desconto').textContent.replace('-', ''));

            if (total === 0 && desconto > 0) {
                this.checked = false;
                campoTemporario.disabled = true;
                campoTemporario.value = '0';

                mostrarToast('A compra já foi paga com o(s) cupom(ns) selecionado(s).');
                return;
            }

            if (this.checked) {
                campoTemporario.disabled = false;

                if (total < 10 && desconto > 0) {
                    campoTemporario.value = '0.01';
                } else {
                    campoTemporario.value = '10.00';
                }

            } else {
                campoTemporario.disabled = true;
                campoTemporario.value = '0';
            }
        });

        campoTemporario.disabled = true;
        campoTemporario.value = '0';

        campoTemporario.addEventListener('blur', function () {

            const valor = parseFloat(this.value) || 0;

            const total = pegarValor(document.getElementById('total').textContent);

            const desconto = pegarValor(document.getElementById('desconto').textContent.replace('-', ''));

            let minimo = 10;

            if (total < 10 && desconto > 0) {
                minimo = 0.01;
            }

            if (valor > 0 && valor < minimo) {
                mostrarToast('O valor mínimo por cartão é de R$ ' + minimo.toFixed(2).replace('.', ',') + '.');
            }
        });
    });

    const formFinalizarCompra = document.getElementById('formFinalizarCompra');

    formFinalizarCompra.addEventListener('submit', function (event) {
        const total = pegarValor(document.getElementById('total').textContent);

        let valorCartoes = 0;
        let cartoesSelecionados = 0;

        // Remove inputs criados anteriormente
        formFinalizarCompra.querySelectorAll('.input-cartao-dinamico').forEach(function (input) {
            input.remove();
        });

        // Cartões salvos
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
                inputId.classList.add('input-cartao-dinamico');

                const inputValor = document.createElement('input');
                inputValor.type = 'hidden';
                inputValor.name = 'cartoes[' + indice + '].valor';
                inputValor.value = campo.value;
                inputValor.classList.add('input-cartao-dinamico');

                formFinalizarCompra.appendChild(inputId);
                formFinalizarCompra.appendChild(inputValor);
            }
        });

        // Cartão temporário
        document.querySelectorAll('.cartao-temporario').forEach(function (item) {

            const checkbox = item.querySelector('.checkbox-cartao-temporario');
            const campo = item.querySelector('.input-valor input');
            const idTemporario = item.querySelector('[name="cartaoTemporarioId"]');

            if (checkbox && checkbox.checked && campo) {
                valorCartoes += parseFloat(campo.value) || 0;
                cartoesSelecionados++;

                if (idTemporario) {
                    idTemporario.disabled = false;
                }

            } else {
                if (campo) {
                    campo.disabled = true;
                    campo.value = '0';
                }

                if (idTemporario) {
                    idTemporario.disabled = true;
                }
            }
        });
    });
});

