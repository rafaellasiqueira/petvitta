document.addEventListener('DOMContentLoaded', function () {
    // Ver mais
    document.querySelectorAll('.btn-ver-mais-produtos').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const produtos = this.parentElement.querySelectorAll('.produto-escondido');
            const aberto = this.classList.toggle('aberto');

            produtos.forEach(function (produto) {
                if (aberto) {
                    produto.style.display = 'flex';
                } else {
                    produto.style.display = 'none';
                }
            });

            if (aberto) {
                this.innerHTML = 'Ver menos';
            } else {
                this.innerHTML = 'Ver mais';
            }
        });
    });

    const modalSolicitarTroca = document.getElementById('modalSolicitarTroca');
    const btnFechar = document.getElementById('btnFecharModalTroca');
    const botoesSolicitarTroca = document.querySelectorAll('.btn-solicitar-troca');
    const btnCancelar = document.getElementById('btnCancelarTroca');

    // Abrir o modal correspondente ao pedido
    botoesSolicitarTroca.forEach(function (botao) {
        botao.addEventListener('click', function () {
            const modalId = this.dataset.modalId;
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.add('active');
            } else {
                console.error('Modal não encontrado:', modalId);
            }
        });
    });

    // Fechar modal pelo X ou pelo botão Cancelar
    document.querySelectorAll('.btn-fechar, .btn-cancelar').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const modal = this.closest('.modal');

            if (modal) {
                modal.classList.remove('active');
            }
        });
    });


    // Formulario
    document.getElementById('formSolicitarTroca').addEventListener('submit', function (event) {
        event.preventDefault();

        document.querySelectorAll('.dados-troca').forEach(function (campo) {
            campo.remove();
        });

        const selecionados = document.querySelectorAll('.checkbox-troca:checked');
        const mensagemErroTroca = document.getElementById('mensagemErroTroca');

        if (selecionados.length === 0) {
            mensagemErroTroca.textContent = 'Selecione pelo menos um produto para trocar.';
            return;
        }

        const justificativaTroca = document.getElementById('justificativaTroca');

        if (justificativaTroca.value.trim().length > 500) {
            mensagemErroTroca.textContent = 'Digite até 500 caracteres.';
            justificativaTroca.focus();
            return;
        }

        for (let i = 0; i < selecionados.length; i++) {
            const itemId = selecionados[i].value;
            const campoQuantidade = document.getElementById('quantidade_' + itemId);
            const quantidade = Number(campoQuantidade.value);
            const maximo = Number(campoQuantidade.max);

            if (quantidade < 1 || quantidade > maximo) {
                mensagemErroTroca.textContent = 'Informe uma quantidade válida para cada produto.';
                campoQuantidade.focus();
                return;
            }

            const campoId = document.createElement('input');
            campoId.type = 'hidden';
            campoId.name = 'itens[' + i + '].itemPedidoId';
            campoId.value = itemId;
            campoId.className = 'dados-troca';
            this.appendChild(campoId);

            const campoQtd = document.createElement('input');
            campoQtd.type = 'hidden';
            campoQtd.name = 'itens[' + i + '].quantidade';
            campoQtd.value = quantidade;
            campoQtd.className = 'dados-troca';
            this.appendChild(campoQtd);
        }

        this.submit();
    });
});

