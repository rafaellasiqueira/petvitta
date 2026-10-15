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

dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener("change", function() {
        dropdownSelecionado = this;
        statusNovo = this.value;
        statusOriginal = this.dataset.statusOriginal;

        modalStatusTroca.classList.add("active");
    });
});

// Fechar modal e cancelar mudança
function cancelarMudancaStatus() {
    dropdownSelecionado.value = statusOriginal;

    modalStatusTroca.classList.remove("active");
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
        document.getElementById("secaoTroca").style.display = "none";
        document.getElementById("secaoStatus").style.display = "none";

        if (this.dataset.autorizacao) {
            document.getElementById("modalAutorizacao").textContent = this.dataset.autorizacao;
            document.getElementById("secaoAutorizacao").style.display = "block";
        }

        if (this.dataset.reprovacao) {
            document.getElementById("modalReprovacao").textContent = this.dataset.reprovacao;
            document.getElementById("secaoReprovacao").style.display = "block";
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
