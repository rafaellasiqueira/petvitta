const formFiltro = document.getElementById("formFiltro");
const statusSelecionado = document.getElementById("statusSelecionado");
const inputPesquisa = document.getElementById("inputPesquisa");
const botoesFiltro = document.querySelectorAll(".btn-filtro");

botoesFiltro.forEach(function(botao) {

    if (botao.dataset.status === statusSelecionado.value) {
        botao.classList.add("active");
    }

    botao.addEventListener("click", function() {
        statusSelecionado.value = this.dataset.status;
        formFiltro.submit();
    });
});

if (!statusSelecionado.value) {
    document.querySelector('[data-status="Todos"]').classList.add("active");
}

inputPesquisa.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        formFiltro.submit();
    }
});

// Mudar status
const modalStatusTroca = document.getElementById("modalStatusTroca");
const btnFecharModalStatus = document.getElementById("btnFecharModalStatus");
const btnNaoStatus = document.getElementById("btnNaoStatus");
const btnConfirmarStatus = document.getElementById("btnConfirmarStatus");

const dropdowns = document.querySelectorAll(".dropdown");

let dropdownSelecionado = null;
let statusNovo = null;
let statusOriginal = null;
let modalEstoqueSelecionado = null;

dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener("change", function() {
        dropdownSelecionado = this;
        statusNovo = this.value;
        statusOriginal = this.dataset.statusOriginal;

        if (statusNovo === "Item Recebido") {
            const form = this.closest("form");
            const trocaId = form.querySelector(
                'input[name="trocaId"]'
            ).value;

            modalEstoqueSelecionado = document.getElementById(
                "modalEstoque_" + trocaId
            );

            modalEstoqueSelecionado.classList.add("active");
        } else {
            modalStatusTroca.classList.add("active");
        }
    });
});

// Fechar modal e cancelar mudança
function cancelarMudancaStatus() {
    dropdownSelecionado.value = statusOriginal;

    if (statusNovo === "Item Recebido") {
        modalEstoqueSelecionado.classList.remove("active");
    } else {
        modalStatusTroca.classList.remove("active");
    }
}

btnFecharModalStatus.addEventListener("click", cancelarMudancaStatus);

btnNaoStatus.addEventListener("click", cancelarMudancaStatus);

// Confirmar mudança
btnConfirmarStatus.addEventListener("click", function() {
    const form = dropdownSelecionado.closest("form");

    form.querySelector(".descricao-status").value = statusNovo;
    form.submit();
});


// Modal troca
const modalTrocas = document.getElementById("modalTrocas");
const btnFecharModal = document.getElementById("btnFecharModal");

document.querySelectorAll(".btn-detalhes").forEach(function(botao) {
    botao.addEventListener("click", function() {
        document.getElementById("modalCodigo").textContent = this.dataset.codigo;
        document.getElementById("modalCliente").textContent = this.dataset.cliente;
        document.getElementById("modalStatus").textContent = this.dataset.status;
        document.getElementById("modalMotivo").textContent = this.dataset.motivo;
        document.getElementById("modalJustificativa").textContent = this.dataset.justificativa;
        document.getElementById("modalSolicitado").textContent = this.dataset.solicitado;

        const produtos = this.parentElement.querySelectorAll(".produto");
        const modalProdutos = document.getElementById("modalProdutos");

        modalProdutos.innerHTML = "";

        produtos.forEach(function(produto) {
            const nome = produto.dataset.nome;
            const quantidade = produto.dataset.quantidade;
            const linha = document.createElement("p");

            linha.textContent = nome + " - " + quantidade + " unidade(s)";
            modalProdutos.appendChild(linha);
        });

        document.getElementById("secaoAutorizacao").style.display = "none";
        document.getElementById("secaoReprovacao").style.display = "none";
        document.getElementById("secaoEnvio").style.display = "none";
        document.getElementById("secaoRecebimento").style.display = "none";
        document.getElementById("secaoTroca").style.display = "none";
        document.getElementById("secaoStatus").style.display = "none";

        if (this.dataset.aprovado) {
            document.getElementById("modalAutorizacao").textContent = this.dataset.aprovado;
            document.getElementById("secaoAutorizacao").style.display = "block";
        }

        if (this.dataset.reprovado) {
            document.getElementById("modalReprovacao").textContent = this.dataset.reprovado;
            document.getElementById("secaoReprovacao").style.display = "block";
        }

        if (this.dataset.enviado) {
            document.getElementById("modalEnviado").textContent = this.dataset.enviado;
            document.getElementById("secaoEnvio").style.display = "block";
        }

        if (this.dataset.recebido) {
            document.getElementById("modalRecebido").textContent = this.dataset.recebido;
            document.getElementById("secaoRecebimento").style.display = "block";
        }

        if (this.dataset.trocado) {
            document.getElementById("modalDataTroca").textContent = this.dataset.trocado;
            document.getElementById("secaoTroca").style.display = "block";
        }

        modalTrocas.classList.add("active");
    });
});

btnFecharModal.addEventListener("click", function() {
    modalTrocas.classList.remove("active");
});

// Formulario do estoque antes de enviar
document.querySelectorAll(".form-retorno-estoque").forEach(function(form) {

    form.addEventListener("submit", function(event) {

        this.querySelectorAll(".dados-estoque").forEach(function(campo) {
            campo.remove();
        });

        const mensagemErro = this.querySelector(".mensagem-erro");

        mensagemErro.textContent = "";

        // Verifica qual botão foi clicado
        if (event.submitter.value === "false") {
            return;
        }

        const selecionados = this.querySelectorAll(".checkbox-troca:checked");

        if (selecionados.length === 0) {
            event.preventDefault();
            mensagemErro.textContent = "Selecione pelo menos um produto.";
            return;
        }

        for (let i = 0; i < selecionados.length; i++) {

            const itemId = selecionados[i].value;

            const campoQuantidade = this.querySelector(
                "#quantidade_" + itemId
            );

            const quantidade = Number(campoQuantidade.value);
            const maximo = Number(campoQuantidade.max);

            if (quantidade < 1 || quantidade > maximo) {
                event.preventDefault();

                mensagemErro.textContent =
                    "Informe uma quantidade válida para cada produto.";

                campoQuantidade.focus();
                return;
            }

            const campoId = document.createElement("input");
            campoId.type = "hidden";
            campoId.name = "itens[" + i + "].itemTrocaId";
            campoId.value = itemId;
            campoId.className = "dados-estoque";
            this.appendChild(campoId);

            const campoQtd = document.createElement("input");
            campoQtd.type = "hidden";
            campoQtd.name = "itens[" + i + "].quantidade";
            campoQtd.value = quantidade;
            campoQtd.className = "dados-estoque";
            this.appendChild(campoQtd);
        }
    });
});

// Fechar ou cancelar o modal de estoque
document.querySelectorAll(".btnFecharModalEstoque").forEach(function(botao) {
    botao.addEventListener("click", cancelarMudancaStatus);
});

