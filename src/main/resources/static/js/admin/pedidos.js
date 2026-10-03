const modalStatusPedido = document.getElementById("modalStatusPedido");
const btnFecharModalStatus = document.getElementById("btnFecharModalStatus");
const btnNaoStatus = document.getElementById("btnNaoStatus");
const btnConfirmarStatus = document.getElementById("btnConfirmarStatus");

const dropdowns = document.querySelectorAll(".dropdown");

let dropdownSelecionado = null;
let statusNovo = null;

dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener("change", function() {
        dropdownSelecionado = this;
        statusNovo = this.value;

        modalStatusPedido.classList.add("active");
    });
});

// Fechar modal
btnFecharModalStatus.addEventListener("click", function() {
    modalStatusPedido.classList.remove("active");
});

// Cancelar mudança
btnNaoStatus.addEventListener("click", function() {
    modalStatusPedido.classList.remove("active");
});

// Confirmar mudança
btnConfirmarStatus.addEventListener("click", function() {
    const form = dropdownSelecionado.closest("form");

    form.querySelector(".descricao-status").value = statusNovo;
    form.submit();
});


// Modal de detalhes
const modalPedidos = document.getElementById("modalPedidos");
const btnFecharModal = document.getElementById("btnFecharModal");

document.querySelectorAll(".btn-detalhes").forEach(function(botao) {
    botao.addEventListener("click", function() {
        document.getElementById("modalCodigo").textContent = this.dataset.codigo;
        document.getElementById("modalCliente").textContent = this.dataset.cliente;
        document.getElementById("modalStatus").textContent = this.dataset.status;
        document.getElementById("modalData").textContent = this.dataset.data;
        document.getElementById("modalSubtotal").textContent = this.dataset.subtotal;
        document.getElementById("modalDescontos").textContent = this.dataset.descontos;
        document.getElementById("modalTotal").textContent = this.dataset.total;
        document.getElementById("modalEndereco").textContent = this.dataset.endereco;

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

        document.getElementById("secaoAprovacao").style.display = "none";
        document.getElementById("secaoPrevisao").style.display = "none";
        document.getElementById("secaoEntrega").style.display = "none";
        document.getElementById("secaoCancelamento").style.display = "none";
        document.getElementById("secaoReprovacao").style.display = "none";

        if (this.dataset.status === "Aprovada") {
            document.getElementById("modalAprovacao").textContent = this.dataset.aprovacao;
            document.getElementById("secaoAprovacao").style.display = "block";
        }

        if (this.dataset.status === "Reprovada") {
            document.getElementById("modalReprovacao").textContent = this.dataset.reprovacao;
            document.getElementById("secaoReprovacao").style.display = "block";
        }

        if (this.dataset.status === "Em transporte") {
            document.getElementById("modalPrevisao").textContent = this.dataset.previsao;
            document.getElementById("secaoPrevisao").style.display = "block";
        }

        if (this.dataset.status === "Entregue") {
            document.getElementById("modalEntrega").textContent = this.dataset.entrega;
            document.getElementById("secaoEntrega").style.display = "block";
        }

        modalPedidos.classList.add("active");
    });
});

btnFecharModal.addEventListener("click", function() {
    modalPedidos.classList.remove("active");
});

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