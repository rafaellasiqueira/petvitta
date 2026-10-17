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

    const btnFechar = document.querySelectorAll('.btn-fechar');
    const botoesSolicitarTroca = document.querySelectorAll('.btn-solicitar-troca');
    const btnCancelar = document.querySelectorAll('.btn-cancelar');

    // Abrir o modal correspondente ao pedido
    botoesSolicitarTroca.forEach(function (botao) {
        botao.addEventListener('click', function () {
            const modalId = this.dataset.modalId;
            const modal = document.getElementById(modalId);

            modal.classList.add('active');
        });
    });

    // Fechar pelo X
    btnFechar.forEach(function (botao) {
        botao.addEventListener('click', function () {
            const modal = this.closest('.modal');

            modal.querySelectorAll('.checkbox-troca').forEach(function (input) {
                input.checked = false;
            });

            modal.querySelectorAll('input[type="number"]').forEach(function (input) {
                input.value = 1;
            });

            modal.querySelector('.motivo-troca').selectedIndex = 0;
            modal.querySelector('.justificativa-troca').value = '';
            modal.querySelector('.mensagem-erro-troca').textContent = '';

            modal.classList.remove('active');
        });
    });

    // Fechar pelo botão Cancelar
    btnCancelar.forEach(function (botao) {
        botao.addEventListener('click', function () {
            const modal = this.closest('.modal');

            modal.querySelectorAll('.checkbox-troca').forEach(function (input) {
                input.checked = false;
            });

            modal.querySelectorAll('input[type="number"]').forEach(function (input) {
                input.value = 1;
            });

            modal.querySelector('.motivo-troca').selectedIndex = 0;
            modal.querySelector('.justificativa-troca').value = '';
            modal.querySelector('.mensagem-erro-troca').textContent = '';

            modal.classList.remove('active');
        });
    });

    // Formulario
    document.querySelectorAll('.form-solicitar-troca').forEach(function (form) {

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            this.querySelectorAll('.dados-troca').forEach(function (campo) {
                campo.remove();
            });

            const selecionados = this.querySelectorAll('.checkbox-troca:checked');
            const mensagemErro = this.querySelector('.mensagem-erro-troca');
            const justificativa = this.querySelector('.justificativa-troca');

            if (selecionados.length === 0) {
                mensagemErro.textContent = 'Selecione pelo menos um produto para trocar.';
                return;
            }

            for (let i = 0; i < selecionados.length; i++) {
                const itemId = selecionados[i].value;
                const campoQuantidade = this.querySelector('#quantidade_' + itemId);
                const quantidade = Number(campoQuantidade.value);
                const maximo = Number(campoQuantidade.max);

                if (quantidade < 1 || quantidade > maximo) {
                    mensagemErro.textContent = 'Informe uma quantidade válida para cada produto.';
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

            if (justificativa.value.trim().length > 500) {
                mensagemErro.textContent = 'Digite até 500 caracteres.';
                justificativa.focus();
                return;
            }

            this.submit();
        });
    });
});

