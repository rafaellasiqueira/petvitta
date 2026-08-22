document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MODAL CANCELAR PEDIDO
    // =====================================================

    const modalCancelar = document.getElementById("modalCancelarPedido");
    const botoesCancelar = document.querySelectorAll(".btn-cancelar-pedido");
    const btnFecharCancelar = document.getElementById("btnFecharModalCancelarPedido");
    const btnNaoCancelar = document.getElementById("btnNaoCancelarPedido");
    const btnConfirmarCancelamento = document.getElementById("btnConfirmarCancelamento");

    let pedidoSelecionadoCancelar = null;


    // =====================================================
    // ABRIR MODAL CANCELAR
    // =====================================================

    botoesCancelar.forEach(function (botao) {

        botao.addEventListener("click", function () {

            pedidoSelecionadoCancelar = botao.closest(".card-pedido");

            if (!pedidoSelecionadoCancelar) return;

            modalCancelar.classList.add("active");
        });

    });


    // =====================================================
    // FECHAR MODAL CANCELAR
    // =====================================================

    if (btnFecharCancelar) {

        btnFecharCancelar.addEventListener("click", function () {

            modalCancelar.classList.remove("active");

            pedidoSelecionadoCancelar = null;
        });

    }


    // =====================================================
    // NÃO CANCELAR
    // =====================================================

    if (btnNaoCancelar) {

        btnNaoCancelar.addEventListener("click", function () {

            modalCancelar.classList.remove("active");

            pedidoSelecionadoCancelar = null;
        });

    }


    // =====================================================
    // CONFIRMAR CANCELAMENTO
    // =====================================================

    if (btnConfirmarCancelamento) {

        btnConfirmarCancelamento.addEventListener("click", function () {

            if (!pedidoSelecionadoCancelar) return;

            const status =
                pedidoSelecionadoCancelar.querySelector(".status-pedido");

            const botaoCancelar =
                pedidoSelecionadoCancelar.querySelector(".btn-cancelar-pedido");

            const informacoesPedido =
                pedidoSelecionadoCancelar.querySelector(".informacoes-pedido");


            // Altera status
            if (status) {

                status.textContent = "Cancelado";

                status.classList.remove(
                    "aprovado",
                    "em-processamento"
                );

                status.classList.add("pedido-cancelado");
            }


            // Remove botão cancelar
            if (botaoCancelar) {
                botaoCancelar.remove();
            }


            // Adiciona mensagem
            if (informacoesPedido) {

                const mensagem = document.createElement("p");

                mensagem.textContent = "Pedido cancelado";

                informacoesPedido.appendChild(mensagem);
            }


            // Fecha modal
            modalCancelar.classList.remove("active");

            pedidoSelecionadoCancelar = null;
        });

    }



    // =====================================================
    // MODAL ITENS RECEBIDOS
    // =====================================================

    const modalItensRecebidos =
        document.getElementById("modalItensRecebidos");

    const botoesItensRecebidos =
        document.querySelectorAll(".btn-itens-recebidos");

    const btnFecharItensRecebidos =
        document.getElementById("btnFecharModalItensRecebidos");

    const btnCancelarItensRecebidos =
        document.getElementById("btnCancelarItensRecebidos");

    const btnConfirmarItensRecebidos =
        document.getElementById("btnConfirmarItensRecebidos");

    let pedidoSelecionadoItensRecebidos = null;


    // =====================================================
    // ABRIR MODAL ITENS RECEBIDOS
    // =====================================================

    botoesItensRecebidos.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const card = botao.closest(".card-pedido");

            if (!card) return;

            const status =
                card.querySelector(".status-pedido");

            if (!status) return;


            // Só permite abrir para pedido em trânsito
            if (status.textContent.trim() !== "Em trânsito") {
                return;
            }


            pedidoSelecionadoItensRecebidos = card;

            modalItensRecebidos.classList.add("active");
        });

    });


    // =====================================================
    // FECHAR MODAL ITENS RECEBIDOS
    // =====================================================

    if (btnFecharItensRecebidos) {

        btnFecharItensRecebidos.addEventListener("click", function () {

            modalItensRecebidos.classList.remove("active");

            pedidoSelecionadoItensRecebidos = null;
        });

    }


    // =====================================================
    // CANCELAR ITENS RECEBIDOS
    // =====================================================

    if (btnCancelarItensRecebidos) {

        btnCancelarItensRecebidos.addEventListener("click", function () {

            modalItensRecebidos.classList.remove("active");

            pedidoSelecionadoItensRecebidos = null;
        });

    }


    // =====================================================
    // CONFIRMAR ITENS RECEBIDOS
    // =====================================================

    if (btnConfirmarItensRecebidos) {

        btnConfirmarItensRecebidos.addEventListener("click", function () {

            if (!pedidoSelecionadoItensRecebidos) return;

            const card = pedidoSelecionadoItensRecebidos;

            const status =
                card.querySelector(".status-pedido");

            const informacoesPedido =
                card.querySelector(".informacoes-pedido");

            const containerStatus =
                card.querySelector(".container-status-troca");

            if (!status) return;


            // Segurança: só permite confirmar pedido em trânsito
            if (status.textContent.trim() !== "Em trânsito") {

                modalItensRecebidos.classList.remove("active");

                pedidoSelecionadoItensRecebidos = null;

                return;
            }


            // Altera status para entregue
            status.textContent = "Entregue";

            status.classList.remove("em-transito");

            status.classList.add("entregue");


            // Remove mensagem de entrega prevista
            if (informacoesPedido) {

                const mensagens =
                    informacoesPedido.querySelectorAll("p");

                mensagens.forEach(function (mensagem) {

                    if (mensagem.textContent.includes("Entrega prevista")) {
                        mensagem.remove();
                    }

                });
            }


            // Remove botão itens recebidos
            const botaoItensRecebidos =
                card.querySelector(".btn-itens-recebidos");

            if (botaoItensRecebidos) {
                botaoItensRecebidos.remove();
            }


            // Adiciona botão solicitar troca
            if (containerStatus) {

                const trocaExistente =
                    containerStatus.querySelector(".btn-solicitar-troca");

                if (!trocaExistente) {

                    const botaoTroca =
                        document.createElement("button");

                    botaoTroca.type = "button";

                    botaoTroca.classList.add(
                        "btn-branco",
                        "btn-solicitar-troca"
                    );

                    botaoTroca.textContent = "Solicitar troca";

                    containerStatus.appendChild(botaoTroca);
                }
            }


            // Adiciona data de entrega
            if (informacoesPedido) {

                const mensagemEntrega =
                    document.createElement("p");

                mensagemEntrega.textContent =
                    "Entregue em " +
                    new Date().toLocaleDateString("pt-BR");

                informacoesPedido.appendChild(mensagemEntrega);
            }


            // Fecha modal
            modalItensRecebidos.classList.remove("active");

            pedidoSelecionadoItensRecebidos = null;
        });

    }



    // =====================================================
    // MODAL SOLICITAR TROCA
    // =====================================================

    const modalSolicitarTroca =
        document.getElementById("modalSolicitarTroca");

    const btnFecharTroca =
        document.getElementById("btnFecharModalTroca");

    const btnCancelarTroca =
        document.getElementById("btnCancelarTroca");

    const formSolicitarTroca =
        document.getElementById("formSolicitarTroca");

    const mensagemErroTroca =
        document.getElementById("mensagemErroTroca");

    let pedidoSelecionadoTroca = null;


    // =====================================================
    // LIMPAR MODAL DE TROCA
    // =====================================================

    function limparModalTroca() {

        // Limpa os campos do formulário
        if (formSolicitarTroca) {
            formSolicitarTroca.reset();
        }


        // Desmarca todos os checkboxes
        const checkboxes =
            modalSolicitarTroca.querySelectorAll(
                ".checkbox-troca"
            );

        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });


        // Limpa campos de quantidade
        const camposQuantidade =
            modalSolicitarTroca.querySelectorAll(
                "input[type='number']"
            );

        camposQuantidade.forEach(function (campo) {

            if (campo.defaultValue !== "") {
                campo.value = campo.defaultValue;
            } else {
                campo.value = "";
            }

        });


        // Limpa justificativa
        const justificativa =
            modalSolicitarTroca.querySelector(
                "#justificativaTroca"
            );

        if (justificativa) {
            justificativa.value = "";
        }


        // Limpa mensagem de erro
        if (mensagemErroTroca) {
            mensagemErroTroca.textContent = "";
        }


        // Limpa qualquer mensagem de validação
        const mensagensErro =
            modalSolicitarTroca.querySelectorAll(
                ".mensagem-erro"
            );

        mensagensErro.forEach(function (mensagem) {
            mensagem.textContent = "";
        });

    }


    // =====================================================
    // ABRIR MODAL SOLICITAR TROCA
    // =====================================================

    document.addEventListener("click", function (event) {

        const botao =
            event.target.closest(".btn-solicitar-troca");

        if (!botao) return;

        const card =
            botao.closest(".card-pedido");

        if (!card) return;

        const status =
            card.querySelector(".status-pedido");

        if (!status) return;


        // Só permite solicitar troca para pedido entregue
        if (status.textContent.trim() !== "Entregue") {
            return;
        }


        // Limpa o formulário antes de abrir
        limparModalTroca();


        // Seleciona o pedido atual
        pedidoSelecionadoTroca = card;


        // Abre modal
        modalSolicitarTroca.classList.add("active");
    });


    // =====================================================
    // FECHAR MODAL TROCA
    // =====================================================

    if (btnFecharTroca) {

        btnFecharTroca.addEventListener("click", function () {

            limparModalTroca();

            modalSolicitarTroca.classList.remove("active");

            pedidoSelecionadoTroca = null;
        });

    }


    // =====================================================
    // CANCELAR SOLICITAÇÃO DE TROCA
    // =====================================================

    if (btnCancelarTroca) {

        btnCancelarTroca.addEventListener("click", function () {

            limparModalTroca();

            modalSolicitarTroca.classList.remove("active");

            pedidoSelecionadoTroca = null;
        });

    }


    // =====================================================
    // FORMULÁRIO DE TROCA
    // =====================================================

    if (formSolicitarTroca) {

        formSolicitarTroca.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (!pedidoSelecionadoTroca) return;


                // =================================================
                // PRODUTOS SELECIONADOS
                // =================================================

                const produtosSelecionados =
                    modalSolicitarTroca.querySelectorAll(
                        ".checkbox-troca:checked"
                    );


                // Limpa mensagem anterior
                if (mensagemErroTroca) {
                    mensagemErroTroca.textContent = "";
                }


                // Verifica se selecionou algum produto
                if (produtosSelecionados.length === 0) {

                    if (mensagemErroTroca) {

                        mensagemErroTroca.textContent =
                            "Selecione pelo menos um item para realizar a troca.";
                    }

                    return;
                }


                // =================================================
                // ELEMENTOS DO PEDIDO
                // =================================================

                const status =
                    pedidoSelecionadoTroca.querySelector(
                        ".status-pedido"
                    );

                const containerStatus =
                    pedidoSelecionadoTroca.querySelector(
                        ".container-status-troca"
                    );


                if (!status || !containerStatus) return;


                // =================================================
                // ENTREGUE → TROCA ACEITA
                // =================================================

                status.textContent = "Troca aceita";

                status.classList.remove(
                    "entregue",
                    "troca-finalizada"
                );

                status.classList.add(
                    "troca-autorizada"
                );


                // =================================================
                // REMOVE BOTÃO SOLICITAR TROCA
                // =================================================

                const botaoSolicitarTroca =
                    pedidoSelecionadoTroca.querySelector(
                        ".btn-solicitar-troca"
                    );

                if (botaoSolicitarTroca) {
                    botaoSolicitarTroca.remove();
                }


                // =================================================
                // CRIA BOTÃO ITENS DESPACHADOS
                // =================================================

                const botaoItensDespachados =
                    document.createElement("button");

                botaoItensDespachados.type = "button";

                botaoItensDespachados.classList.add(
                    "btn-branco",
                    "btn-itens-despachados"
                );

                botaoItensDespachados.textContent =
                    "Itens despachados";

                containerStatus.appendChild(
                    botaoItensDespachados
                );


                // =================================================
                // LIMPA MODAL
                // =================================================

                limparModalTroca();

                modalSolicitarTroca.classList.remove("active");


                // =================================================
                // ITENS DESPACHADOS
                // =================================================

                botaoItensDespachados.addEventListener(
                    "click",
                    function () {

                        // Troca aceita para troca processada
                        status.textContent =
                            "Troca processada";

                        status.classList.remove(
                            "troca-autorizada"
                        );

                        status.classList.add(
                            "troca-finalizada"
                        );


                        // Remove botão
                        botaoItensDespachados.remove();


                        // Adiciona data
                        const informacoesPedido =
                            pedidoSelecionadoTroca.querySelector(
                                ".informacoes-pedido"
                            );


                        if (informacoesPedido) {

                            const mensagem =
                                document.createElement("p");

                            mensagem.textContent =
                                "Troca processada em " +
                                new Date().toLocaleDateString(
                                    "pt-BR"
                                );

                            informacoesPedido.appendChild(
                                mensagem
                            );
                        }


                        // Limpa referência do pedido
                        pedidoSelecionadoTroca = null;
                    }
                );

            }
        );

    }

});