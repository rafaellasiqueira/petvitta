document.addEventListener("DOMContentLoaded", function () {

    // Modal cancelar pedido
    const modalCancelar = document.getElementById("modalCancelarPedido");
    const botoesCancelar = document.querySelectorAll(".btn-cancelar-pedido");
    const btnFecharCancelar = document.getElementById("btnFecharModalCancelarPedido");
    const btnNaoCancelar = document.getElementById("btnNaoCancelarPedido");
    const btnConfirmarCancelamento = document.getElementById("btnConfirmarCancelamento");
    let pedidoSelecionadoCancelar = null;

    // Abrir modal de cancelar
    botoesCancelar.forEach(function (botao) {
        botao.addEventListener("click", function () {
            pedidoSelecionadoCancelar = botao.closest(".card-pedido");
            modalCancelar.classList.add("active");
        });
    });

    // Fechar modal
    btnFecharCancelar.addEventListener("click", function () {
        modalCancelar.classList.remove("active");
        pedidoSelecionadoCancelar = null;
    });

    // Não cancelar
    btnNaoCancelar.addEventListener("click", function () {
        modalCancelar.classList.remove("active");
        pedidoSelecionadoCancelar = null;
    });

    // Confirmar cancelamento
    btnConfirmarCancelamento.addEventListener("click", function () {
        const status = pedidoSelecionadoCancelar.querySelector(".status-pedido");
        const botaoCancelar = pedidoSelecionadoCancelar.querySelector(".btn-cancelar-pedido");
        const informacoesPedido = pedidoSelecionadoCancelar.querySelector(".informacoes-pedido");

        // Altera status
        status.textContent = "Cancelado";
        status.classList.remove("aprovado", "em-processamento");
        status.classList.add("pedido-cancelado");

        // Remove botão cancelar
        botaoCancelar.remove();

        // Remove mensagem de aprovação
        informacoesPedido.querySelectorAll("p").forEach(function (mensagem) {
            if (mensagem.textContent.includes("Aprovado em")) {
                mensagem.remove();
            }
        });

        // Adiciona mensagem
        const mensagem = document.createElement("p");
        mensagem.textContent = "Pedido cancelado";
        informacoesPedido.appendChild(mensagem);

        // Fecha modal
        modalCancelar.classList.remove("active");
        pedidoSelecionadoCancelar = null;
    });

    // Modal itens recebidos
    const modalItensRecebidos = document.getElementById("modalItensRecebidos");
    const botoesItensRecebidos = document.querySelectorAll(".btn-itens-recebidos");
    const btnFecharItensRecebidos = document.getElementById("btnFecharModalItensRecebidos");
    const btnCancelarItensRecebidos = document.getElementById("btnCancelarItensRecebidos");
    const btnConfirmarItensRecebidos = document.getElementById("btnConfirmarItensRecebidos");
    let pedidoSelecionadoItensRecebidos = null;

    // Abrir modal itens recebidos
    botoesItensRecebidos.forEach(function (botao) {
        botao.addEventListener("click", function () {
            const card = botao.closest(".card-pedido");
            const status = card.querySelector(".status-pedido");

            if (status.textContent.trim() !== "Em trânsito") return;

            pedidoSelecionadoItensRecebidos = card;
            modalItensRecebidos.classList.add("active");
        });
    });

    // Fechar modal itens recebidos
    btnFecharItensRecebidos.addEventListener("click", function () {
        modalItensRecebidos.classList.remove("active");
        pedidoSelecionadoItensRecebidos = null;
    });

    // Cancelar itens recebidos
    btnCancelarItensRecebidos.addEventListener("click", function () {
        modalItensRecebidos.classList.remove("active");
        pedidoSelecionadoItensRecebidos = null;
    });

    // Confirmar itens recebidos
    btnConfirmarItensRecebidos.addEventListener("click", function () {
        const card = pedidoSelecionadoItensRecebidos;
        const status = card.querySelector(".status-pedido");
        const informacoesPedido = card.querySelector(".informacoes-pedido");
        const containerStatus = card.querySelector(".container-status-troca");

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
        const mensagens = informacoesPedido.querySelectorAll("p");

        mensagens.forEach(function (mensagem) {
            if (mensagem.textContent.includes("Entrega prevista")) {
                mensagem.remove();
            }
        });

        // Remove botão itens recebidos
        const botaoItensRecebidos = card.querySelector(".btn-itens-recebidos");
        botaoItensRecebidos.remove();

        // Adiciona botão solicitar troca
        const trocaExistente = containerStatus.querySelector(".btn-solicitar-troca");

        if (!trocaExistente) {
            const botaoTroca = document.createElement("button");
            botaoTroca.type = "button";
            botaoTroca.classList.add("btn-branco", "btn-solicitar-troca");
            botaoTroca.textContent = "Solicitar troca";
            containerStatus.appendChild(botaoTroca);
        }

        // Adiciona data de entrega
        const mensagemEntrega = document.createElement("p");
        mensagemEntrega.textContent = "Entregue em " + new Date().toLocaleDateString("pt-BR");
        informacoesPedido.appendChild(mensagemEntrega);

        // Fecha modal
        modalItensRecebidos.classList.remove("active");
        pedidoSelecionadoItensRecebidos = null;
    });

    // Modal solicitar troca
    const modalSolicitarTroca = document.getElementById("modalSolicitarTroca");
    const btnFecharTroca = document.getElementById("btnFecharModalTroca");
    const btnCancelarTroca = document.getElementById("btnCancelarTroca");
    const formSolicitarTroca = document.getElementById("formSolicitarTroca");
    const mensagemErroTroca = document.getElementById("mensagemErroTroca");
    let pedidoSelecionadoTroca = null;

    // Limpar modal de troca
    function limparModalTroca() {
        formSolicitarTroca.reset();

        const checkboxes = modalSolicitarTroca.querySelectorAll(".checkbox-troca");

        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        const camposQuantidade = modalSolicitarTroca.querySelectorAll("input[type='number']");

        camposQuantidade.forEach(function (campo) {
            campo.value = campo.defaultValue !== "" ? campo.defaultValue : "";
        });

        const justificativa = modalSolicitarTroca.querySelector("#justificativaTroca");
        justificativa.value = "";

        mensagemErroTroca.textContent = "";

        const mensagensErro = modalSolicitarTroca.querySelectorAll(".mensagem-erro");

        mensagensErro.forEach(function (mensagem) {
            mensagem.textContent = "";
        });
    }

    // Abrir modal solicitar troca
    document.addEventListener("click", function (event) {
        const botao = event.target.closest(".btn-solicitar-troca");
        if (!botao) return;

        const card = botao.closest(".card-pedido");
        const status = card.querySelector(".status-pedido");

        if (status.textContent.trim() !== "Entregue") return;

        limparModalTroca();
        pedidoSelecionadoTroca = card;
        modalSolicitarTroca.classList.add("active");
    });

    // Fechar modal troca
    btnFecharTroca.addEventListener("click", function () {
        limparModalTroca();
        modalSolicitarTroca.classList.remove("active");
        pedidoSelecionadoTroca = null;
    });

    // Cancelar solicitação de troca
    btnCancelarTroca.addEventListener("click", function () {
        limparModalTroca();
        modalSolicitarTroca.classList.remove("active");
        pedidoSelecionadoTroca = null;
    });

    // Formulário de troca
    formSolicitarTroca.addEventListener("submit", function (event) {
        event.preventDefault();

        const produtosSelecionados = modalSolicitarTroca.querySelectorAll(".checkbox-troca:checked");
        mensagemErroTroca.textContent = "";

        // Verifica se selecionou algum produto
        if (produtosSelecionados.length === 0) {
            mensagemErroTroca.textContent = "Selecione pelo menos um item para realizar a troca.";
            return;
        }

        const status = pedidoSelecionadoTroca.querySelector(".status-pedido");
        const containerStatus = pedidoSelecionadoTroca.querySelector(".container-status-troca");

        // Entregue → troca aceita
        status.textContent = "Troca aceita";
        status.classList.remove("entregue", "troca-finalizada");
        status.classList.add("troca-autorizada");

        // Remove botão solicitar troca
        const botaoSolicitarTroca = pedidoSelecionadoTroca.querySelector(".btn-solicitar-troca");
        botaoSolicitarTroca.remove();

        // Cria botão itens despachados
        const botaoItensDespachados = document.createElement("button");
        botaoItensDespachados.type = "button";
        botaoItensDespachados.classList.add("btn-branco", "btn-itens-despachados");
        botaoItensDespachados.textContent = "Itens despachados";
        containerStatus.appendChild(botaoItensDespachados);

        // Limpa modal
        limparModalTroca();
        modalSolicitarTroca.classList.remove("active");

        // Itens despachados
        botaoItensDespachados.addEventListener("click", function () {
            status.textContent = "Troca processada";
            status.classList.remove("troca-autorizada");
            status.classList.add("troca-finalizada");
            botaoItensDespachados.remove();

            // Adiciona data
            const informacoesPedido = pedidoSelecionadoTroca.querySelector(".informacoes-pedido");
            const mensagem = document.createElement("p");

            mensagem.textContent = "Troca processada em " + new Date().toLocaleDateString("pt-BR");
            informacoesPedido.appendChild(mensagem);

            // Limpa referência do pedido
            pedidoSelecionadoTroca = null;
        });
    });
});