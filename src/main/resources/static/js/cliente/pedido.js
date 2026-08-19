document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // VARIÁVEIS DOS MODAIS
    // =========================================

    const modalTroca =
        document.getElementById('modalSolicitarTroca');

    const modalCancelarPedido =
        document.getElementById('modalCancelarPedido');

    const modalItensRecebidos =
        document.getElementById('modalItensRecebidos');


    // Guarda o card que está sendo manipulado
    let cardPedidoTrocaAtual = null;
    let cardPedidoCancelarAtual = null;
    let cardPedidoRecebimentoAtual = null;


    // =========================================
    // MODAL SOLICITAR TROCA
    // =========================================

    const btnFecharTroca =
        document.getElementById('btnFecharModalTroca');

    const btnCancelarTroca =
        document.getElementById('btnCancelarTroca');

    const formSolicitarTroca =
        document.getElementById('formSolicitarTroca');


    // =========================================
    // ABRIR MODAL DE TROCA
    // =========================================

    document.addEventListener('click', (event) => {

        const botao =
            event.target.closest('.btn-solicitar-troca');

        if (!botao) {
            return;
        }

        const card =
            botao.closest('.card-pedido');

        if (!card) {
            return;
        }

        cardPedidoTrocaAtual = card;

        modalTroca?.classList.add('active');

    });


    // =========================================
    // FECHAR MODAL DE TROCA
    // =========================================

    btnFecharTroca?.addEventListener('click', () => {

        modalTroca?.classList.remove('active');

    });


    btnCancelarTroca?.addEventListener('click', () => {

        modalTroca?.classList.remove('active');

    });


    // Fechar clicando fora
    modalTroca?.addEventListener('click', (event) => {

        if (event.target === modalTroca) {

            modalTroca.classList.remove('active');

        }

    });


    // =========================================
    // CONFIRMAR SOLICITAÇÃO DE TROCA
    // =========================================

    formSolicitarTroca?.addEventListener('submit', (event) => {

        event.preventDefault();

        if (!cardPedidoTrocaAtual) {
            return;
        }

        const card =
            cardPedidoTrocaAtual;


        // -----------------------------------------
        // ALTERAR STATUS
        // -----------------------------------------

        const status =
            card.querySelector('.status-pedido');

        if (status) {

            status.textContent = 'Troca autorizada';

            status.className =
                'status-pedido troca-autorizada';

        }


        // -----------------------------------------
        // REMOVER BOTÃO SOLICITAR TROCA
        // -----------------------------------------

        const btnSolicitar =
            card.querySelector('.btn-solicitar-troca');

        btnSolicitar?.remove();


        // -----------------------------------------
        // CRIAR BOTÃO ITENS DESPACHADOS
        // -----------------------------------------

        let container =
            card.querySelector('.container-status-troca');

        if (!container) {

            container =
                card.querySelector('.cabecalho-pedido');

        }


        if (container) {

            const btnDespachados =
                document.createElement('button');

            btnDespachados.type = 'button';

            btnDespachados.className =
                'btn-branco btn-itens-despachados';

            btnDespachados.textContent =
                'Itens despachados';

            container.appendChild(btnDespachados);

        }


        // Fecha modal
        modalTroca?.classList.remove('active');

    });


    // =========================================
    // MODAL CANCELAR PEDIDO
    // =========================================

    const botoesCancelarPedido =
        document.querySelectorAll('.btn-cancelar-pedido');

    const btnFecharModalCancelarPedido =
        document.getElementById('btnFecharModalCancelarPedido');

    const btnNaoCancelarPedido =
        document.getElementById('btnNaoCancelarPedido');

    const btnConfirmarCancelamento =
        document.getElementById('btnConfirmarCancelamento');


    // =========================================
    // ABRIR MODAL CANCELAR
    // =========================================

    botoesCancelarPedido.forEach((botao) => {

        botao.addEventListener('click', () => {

            // Guarda exatamente o card clicado
            cardPedidoCancelarAtual =
                botao.closest('.card-pedido');

            modalCancelarPedido?.classList.add('active');

        });

    });


    // =========================================
    // FECHAR MODAL CANCELAR
    // =========================================

    btnFecharModalCancelarPedido?.addEventListener(
        'click',
        () => {

            modalCancelarPedido?.classList.remove('active');

        }
    );


    btnNaoCancelarPedido?.addEventListener(
        'click',
        () => {

            modalCancelarPedido?.classList.remove('active');

        }
    );


    // =========================================
    // CONFIRMAR CANCELAMENTO
    // =========================================

    btnConfirmarCancelamento?.addEventListener(
        'click',
        () => {

            if (!cardPedidoCancelarAtual) {
                return;
            }


            const card =
                cardPedidoCancelarAtual;


            // -----------------------------------------
            // STATUS
            // -----------------------------------------

            const status =
                card.querySelector('.status-pedido');

            if (status) {

                status.textContent =
                    'Cancelado';

                status.className =
                    'status-pedido pedido-cancelado';

            }


            // -----------------------------------------
            // DATA
            // -----------------------------------------

            const informacoes =
                card.querySelector('.informacoes-pedido');

            if (informacoes) {

                const spans =
                    informacoes.querySelectorAll('span');

                const hoje =
                    new Date();

                const dataFormatada =
                    hoje.toLocaleDateString('pt-BR');


                if (spans.length > 1) {

                    spans[1].textContent =
                        `Cancelado em ${dataFormatada}`;

                } else {

                    const novaData =
                        document.createElement('span');

                    novaData.textContent =
                        `Cancelado em ${dataFormatada}`;

                    informacoes.appendChild(
                        novaData
                    );

                }

            }


            // -----------------------------------------
            // REMOVER BOTÃO CANCELAR
            // -----------------------------------------

            const botaoCancelar =
                card.querySelector('.btn-cancelar-pedido');

            botaoCancelar?.remove();


            // Fecha modal
            modalCancelarPedido?.classList.remove(
                'active'
            );


            // Limpa referência
            cardPedidoCancelarAtual = null;

        }
    );


    // =========================================
    // FECHAR MODAL CANCELAR CLICANDO FORA
    // =========================================

    modalCancelarPedido?.addEventListener(
        'click',
        (event) => {

            if (event.target === modalCancelarPedido) {

                modalCancelarPedido.classList.remove(
                    'active'
                );

            }

        }
    );


    // =========================================
    // MODAL ITENS RECEBIDOS
    // =========================================

    const btnAbrirModalItensRecebidos =
        document.getElementById(
            'btnAbrirModalItensRecebidos'
        );

    const btnFecharModalItensRecebidos =
        document.getElementById(
            'btnFecharModalItensRecebidos'
        );

    const btnCancelarItensRecebidos =
        document.getElementById(
            'btnCancelarItensRecebidos'
        );

    const formItensRecebidos =
        document.getElementById(
            'formItensRecebidos'
        );


    // =========================================
    // ABRIR MODAL ITENS RECEBIDOS
    // =========================================

    btnAbrirModalItensRecebidos?.addEventListener(
        'click',
        () => {

            cardPedidoRecebimentoAtual =
                btnAbrirModalItensRecebidos
                    .closest('.card-pedido');

            modalItensRecebidos?.classList.add(
                'active'
            );

        }
    );


    // =========================================
    // FECHAR MODAL ITENS RECEBIDOS
    // =========================================

    btnFecharModalItensRecebidos?.addEventListener(
        'click',
        () => {

            modalItensRecebidos?.classList.remove(
                'active'
            );

        }
    );


    btnCancelarItensRecebidos?.addEventListener(
        'click',
        () => {

            modalItensRecebidos?.classList.remove(
                'active'
            );

        }
    );


    // Fechar clicando fora
    modalItensRecebidos?.addEventListener(
        'click',
        (event) => {

            if (event.target === modalItensRecebidos) {

                modalItensRecebidos.classList.remove(
                    'active'
                );

            }

        }
    );


    // =========================================
    // CONFIRMAR ITENS RECEBIDOS
    // =========================================

    formItensRecebidos?.addEventListener(
        'submit',
        (event) => {

            event.preventDefault();


            if (!cardPedidoRecebimentoAtual) {
                return;
            }


            // -----------------------------------------
            // QUANTIDADES RECEBIDAS
            // -----------------------------------------

            const quantidadeChoice =
                Number(
                    document.getElementById(
                        'quantidadeRecebidaChoice'
                    ).value
                );

            const quantidadeGolden =
                Number(
                    document.getElementById(
                        'quantidadeRecebidaGolden'
                    ).value
                );


            // -----------------------------------------
            // QUANTIDADES ESPERADAS
            // -----------------------------------------

            const quantidadeEsperadaChoice = 1;

            const quantidadeEsperadaGolden = 2;


            // -----------------------------------------
            // VERIFICAR QUANTIDADES
            // -----------------------------------------

            const recebeuTudo =
                quantidadeChoice ===
                    quantidadeEsperadaChoice &&

                quantidadeGolden ===
                    quantidadeEsperadaGolden;


            // -----------------------------------------
            // VERIFICAR CHECKBOX
            // -----------------------------------------

            const confirmou =
                document.getElementById(
                    'confirmarRecebimento'
                ).checked;


            if (!confirmou) {

                alert(
                    'Confirme que recebeu todos os itens.'
                );

                return;

            }


            // -----------------------------------------
            // QUANTIDADE INCORRETA
            // -----------------------------------------

            if (!recebeuTudo) {

                alert(
                    'As quantidades recebidas não correspondem às quantidades do pedido.'
                );

                return;

            }


            // -----------------------------------------
            // CARD
            // -----------------------------------------

            const card =
                cardPedidoRecebimentoAtual;


            // -----------------------------------------
            // STATUS ENTREGUE
            // -----------------------------------------

            let status =
                card.querySelector('.status-pedido');

            if (status) {

                // Se já existir o status, apenas altera
                status.textContent = 'Entregue';
                status.className = 'status-pedido entregue';

            } else {

                // Se não existir, cria o status
                status = document.createElement('span');

                status.className = 'status-pedido entregue';

                status.textContent = 'Entregue';

                // Coloca o status dentro do container
                const containerStatus =
                    card.querySelector('.container-status-troca');

                if (containerStatus) {
                    containerStatus.prepend(status);
                }
            }


            // -----------------------------------------
            // ALTERAR DATA
            // -----------------------------------------

            const informacoes =
                card.querySelector(
                    '.informacoes-pedido'
                );


            if (informacoes) {

                const spans =
                    informacoes.querySelectorAll(
                        'span'
                    );

                const hoje =
                    new Date();

                const dataFormatada =
                    hoje.toLocaleDateString(
                        'pt-BR'
                    );


                if (spans.length > 1) {

                    spans[1].textContent =
                        `Entregue em ${dataFormatada}`;

                } else {

                    const novaData =
                        document.createElement(
                            'span'
                        );

                    novaData.textContent =
                        `Entregue em ${dataFormatada}`;

                    informacoes.appendChild(
                        novaData
                    );

                }

            }


            // -----------------------------------------
            // REMOVER BOTÃO ITENS RECEBIDOS
            // -----------------------------------------

            const botaoRecebidos =
                card.querySelector(
                    '.btn-itens-recebidos'
                );

            botaoRecebidos?.remove();


            // -----------------------------------------
            // CRIAR CONTAINER DE STATUS
            // -----------------------------------------

            let containerStatus =
                card.querySelector(
                    '.container-status-troca'
                );


            if (!containerStatus) {

                containerStatus =
                    card.querySelector(
                        '.cabecalho-pedido'
                    );

            }


            // -----------------------------------------
            // CRIAR BOTÃO SOLICITAR TROCA
            // -----------------------------------------

            if (containerStatus) {

                const btnSolicitarTroca =
                    document.createElement(
                        'button'
                    );


                btnSolicitarTroca.type =
                    'button';

                btnSolicitarTroca.className =
                    'btn-branco btn-solicitar-troca';

                btnSolicitarTroca.textContent =
                    'Solicitar troca';


                containerStatus.appendChild(
                    btnSolicitarTroca
                );

            }


            // -----------------------------------------
            // FECHAR MODAL
            // -----------------------------------------

            modalItensRecebidos?.classList.remove(
                'active'
            );


            // Limpa referência
            cardPedidoRecebimentoAtual = null;

        }
    );


    // =========================================
    // ITENS DESPACHADOS
    // =========================================

    document.addEventListener(
        'click',
        (event) => {

            const botao =
                event.target.closest(
                    '.btn-itens-despachados'
                );


            if (!botao) {
                return;
            }


            const card =
                botao.closest('.card-pedido');


            if (!card) {
                return;
            }


            const status =
                card.querySelector(
                    '.status-pedido'
                );


            // -----------------------------------------
            // ALTERAR PARA TROCADO
            // -----------------------------------------

            if (status) {

                status.textContent =
                    'Trocado';

                status.className =
                    'status-pedido troca-finalizada';

            }


            // Remove botão
            botao.remove();

        }
    );

});