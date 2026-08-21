document.addEventListener("DOMContentLoaded", function () {


    const modalCancelar = document.getElementById("modalCancelarPedido");
    const botoesCancelar = document.querySelectorAll(".btn-cancelar-pedido");
    const btnFecharCancelar =
        document.getElementById("btnFecharModalCancelarPedido");
    const btnNaoCancelar =
        document.getElementById("btnNaoCancelarPedido");
    const btnConfirmarCancelamento =
        document.getElementById("btnConfirmarCancelamento");

    let pedidoSelecionadoCancelar = null;

    // Abrir modal
    botoesCancelar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            pedidoSelecionadoCancelar =
                botao.closest(".card-pedido");

            modalCancelar.classList.add("active");
        });

    });


    // Fechar modal
    btnFecharCancelar.addEventListener("click", function () {

        modalCancelar.classList.remove("active");

    });


    btnNaoCancelar.addEventListener("click", function () {

        modalCancelar.classList.remove("active");

    });


    // Confirmar cancelamento
    btnConfirmarCancelamento.addEventListener("click", function () {

        if (!pedidoSelecionadoCancelar) {
            return;
        }

        const status =
            pedidoSelecionadoCancelar.querySelector(".status-pedido");

        const botaoCancelar =
            pedidoSelecionadoCancelar.querySelector(".btn-cancelar-pedido");


        status.textContent = "Cancelado";

        status.classList.remove(
            "aprovado",
            "em-processamento"
        );

        status.classList.add("pedido-cancelado");


        if (botaoCancelar) {
            botaoCancelar.remove();
        }


        const mensagem = document.createElement("p");

        mensagem.textContent = "Pedido cancelado";


        pedidoSelecionadoCancelar
            .querySelector(".informacoes-pedido")
            .appendChild(mensagem);


        modalCancelar.classList.remove("active");

    });



    // =========================================================
    // ITENS RECEBIDOS
    // =========================================================

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


    // Abrir modal
    botoesItensRecebidos.forEach(function (botao) {

        botao.addEventListener("click", function () {

            pedidoSelecionadoItensRecebidos =
                botao.closest(".card-pedido");

            modalItensRecebidos.classList.add("active");

        });

    });


    // Fechar
    btnFecharItensRecebidos.addEventListener("click", function () {

        modalItensRecebidos.classList.remove("active");

    });


    btnCancelarItensRecebidos.addEventListener("click", function () {

        modalItensRecebidos.classList.remove("active");

    });


    // Confirmar recebimento
    btnConfirmarItensRecebidos.addEventListener("click", function () {

        if (!pedidoSelecionadoItensRecebidos) {
            return;
        }


        const quantidadeChoice =
            document.getElementById("quantidadeRecebidaChoice");

        const quantidadeGolden =
            document.getElementById("quantidadeRecebidaGolden");


        // Quantidades esperadas
        const quantidadeEsperadaChoice = 1;
        const quantidadeEsperadaGolden = 2;


        // Verificar Choice
        if (
            Number(quantidadeChoice.value) <
            quantidadeEsperadaChoice
        ) {

            alert(
                "A quantidade recebida da Ração Choice não pode ser menor que a quantidade enviada."
            );

            quantidadeChoice.focus();

            return;
        }


        // Verificar Golden
        if (
            Number(quantidadeGolden.value) <
            quantidadeEsperadaGolden
        ) {

            alert(
                "A quantidade recebida da Ração GoldeN não pode ser menor que a quantidade enviada."
            );

            quantidadeGolden.focus();

            return;
        }


        // Status
        const status =
            pedidoSelecionadoItensRecebidos
                .querySelector(".status-pedido");


        status.textContent = "Entregue";

        status.classList.remove("em-transito");

        status.classList.add("entregue");


        // Informações
        const informacoesPedido =
            pedidoSelecionadoItensRecebidos
                .querySelector(".informacoes-pedido");


        // Remover "Entrega prevista"
        const mensagens =
            informacoesPedido.querySelectorAll("p");


        mensagens.forEach(function (mensagem) {

            if (
                mensagem.textContent.includes(
                    "Entrega prevista"
                )
            ) {

                mensagem.remove();

            }

        });


        // Remover botão "Itens recebidos"
        const botaoItensRecebidos =
            pedidoSelecionadoItensRecebidos
                .querySelector(".btn-itens-recebidos");


        if (botaoItensRecebidos) {
            botaoItensRecebidos.remove();
        }


        // Container dos botões
        const containerStatus =
            pedidoSelecionadoItensRecebidos
                .querySelector(".container-status-troca");


        // Criar botão Solicitar troca
        const botaoTroca =
            document.createElement("button");


        botaoTroca.type = "button";

        botaoTroca.classList.add(
            "btn-branco",
            "btn-solicitar-troca"
        );

        botaoTroca.textContent =
            "Solicitar troca";


        containerStatus.appendChild(botaoTroca);


        // Adicionar data de entrega
        const mensagem =
            document.createElement("p");


        mensagem.textContent =
            "Entregue em " +
            new Date().toLocaleDateString("pt-BR");


        informacoesPedido.appendChild(mensagem);


        // Fechar modal
        modalItensRecebidos.classList.remove("active");

    });



    // =========================================================
    // SOLICITAR TROCA
    // =========================================================

    const modalSolicitarTroca =
        document.getElementById("modalSolicitarTroca");

    const btnFecharTroca =
        document.getElementById("btnFecharModalTroca");

    const btnCancelarTroca =
        document.getElementById("btnCancelarTroca");

    const formSolicitarTroca =
        document.getElementById("formSolicitarTroca");


    let pedidoSelecionadoTroca = null;


    // =========================================================
    // ABRIR MODAL
    // =========================================================
    // Delegação de evento porque o botão pode ser criado
    // depois do carregamento da página.

    document.addEventListener("click", function (event) {

        const botao =
            event.target.closest(".btn-solicitar-troca");


        if (!botao) {
            return;
        }


        pedidoSelecionadoTroca =
            botao.closest(".card-pedido");


        modalSolicitarTroca.classList.add("active");

    });



    // =========================================================
    // FECHAR MODAL
    // =========================================================

    btnFecharTroca.addEventListener("click", function () {

        modalSolicitarTroca.classList.remove("active");

    });


    btnCancelarTroca.addEventListener("click", function () {

        modalSolicitarTroca.classList.remove("active");

    });



    // =========================================================
    // CONFIRMAR SOLICITAÇÃO DE TROCA
    // =========================================================

    formSolicitarTroca.addEventListener("submit", function (event) {

        event.preventDefault();


        if (!pedidoSelecionadoTroca) {
            return;
        }


        // -----------------------------------------------------
        // Verificar produtos selecionados
        // -----------------------------------------------------

        const produtosSelecionados =
            document.querySelectorAll(
                ".checkbox-troca:checked"
            );


        if (produtosSelecionados.length === 0) {

            alert(
                "Selecione pelo menos um item para realizar a troca."
            );

            return;
        }



        // -----------------------------------------------------
        // Verificar Choice
        // -----------------------------------------------------

        const checkboxChoice =
            document.querySelector(
                ".checkbox-troca[value='racao-choice']"
            );


        if (
            checkboxChoice &&
            checkboxChoice.checked
        ) {

            const quantidadeChoice =
                document.getElementById("quantidadeChoice");


            if (
                Number(quantidadeChoice.value) <
                Number(quantidadeChoice.min)
            ) {

                alert(
                    "A quantidade da Ração Choice não pode ser menor que a quantidade enviada."
                );

                quantidadeChoice.focus();

                return;
            }

        }



        // -----------------------------------------------------
        // Verificar Golden
        // -----------------------------------------------------

        const checkboxGolden =
            document.querySelector(
                ".checkbox-troca[value='racao-golden']"
            );


        if (
            checkboxGolden &&
            checkboxGolden.checked
        ) {

            const quantidadeGolden =
                document.getElementById("quantidadeGolden");


            if (
                Number(quantidadeGolden.value) <
                Number(quantidadeGolden.min)
            ) {

                alert(
                    "A quantidade da Ração GoldeN não pode ser menor que a quantidade enviada."
                );

                quantidadeGolden.focus();

                return;
            }

        }



        // =====================================================
        // ALTERAR STATUS
        // =====================================================

        const status =
            pedidoSelecionadoTroca
                .querySelector(".status-pedido");


        const containerStatus =
            pedidoSelecionadoTroca
                .querySelector(".container-status-troca");


        status.textContent = "Troca aceita";


        status.classList.remove(
            "entregue",
            "troca-finalizada"
        );


        status.classList.add(
            "troca-autorizada"
        );



        // =====================================================
        // REMOVER BOTÃO SOLICITAR TROCA
        // =====================================================

        const botaoSolicitarTroca =
            pedidoSelecionadoTroca
                .querySelector(".btn-solicitar-troca");


        if (botaoSolicitarTroca) {
            botaoSolicitarTroca.remove();
        }



        // =====================================================
        // CRIAR BOTÃO ITENS DESPACHADOS
        // =====================================================

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



        // Fechar modal
        modalSolicitarTroca.classList.remove("active");



        // =====================================================
        // ITENS DESPACHADOS
        // =====================================================

        botaoItensDespachados.addEventListener(
            "click",
            function () {

                status.textContent =
                    "Troca processada";


                status.classList.remove(
                    "troca-autorizada"
                );


                status.classList.add(
                    "troca-finalizada"
                );


                // Remover botão
                botaoItensDespachados.remove();


                // Adicionar data
                const informacoesPedido =
                    pedidoSelecionadoTroca
                        .querySelector(
                            ".informacoes-pedido"
                        );


                const mensagem =
                    document.createElement("p");


                mensagem.textContent =
                    "Troca processada em " +
                    new Date().toLocaleDateString("pt-BR");


                informacoesPedido.appendChild(
                    mensagem
                );

            }
        );

    });

});