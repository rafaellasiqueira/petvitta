// Modal detalhes do pedido
const modal = document.getElementById("modalPedidos");
const btnFechar = document.getElementById("btnFecharModal");
const botoesOlho = document.querySelectorAll(".btn-detalhes");

botoesOlho.forEach(function(botao) {

    botao.addEventListener("click", function() {

        const linha = botao.closest("tr");
        const statusAtual = linha.querySelector(".dropdown").value;

        document.getElementById("modalCodigo").textContent = botao.dataset.codigo;
        document.getElementById("modalCliente").textContent = botao.dataset.cliente;
        document.getElementById("modalData").textContent = botao.dataset.data;
        document.getElementById("modalStatus").textContent = statusAtual;
        document.getElementById("modalProdutos").textContent =botao.dataset.produtos.replaceAll("|", "\n");
        document.getElementById("modalSubtotal").textContent =botao.dataset.subtotal;
        document.getElementById("modalDescontos").textContent = botao.dataset.descontos;
        document.getElementById("modalTotal").textContent =botao.dataset.total;
        document.getElementById("modalEndereco").textContent =botao.dataset.endereco;

        const labelStatus = document.getElementById("labelStatus");
        const dataStatus = document.getElementById("modalDataStatus");
        const secaoStatus = document.getElementById("secaoStatus");

        secaoStatus.style.display = "none"; /* Esconde */

        if (statusAtual === "Pagamento realizado") {
            labelStatus.textContent = "Data do pagamento: ";
            dataStatus.textContent = new Date().toLocaleDateString("pt-BR");
            secaoStatus.style.display = "block"; /* Fica visivel */
        }

        if (statusAtual === "Em trânsito") {
            labelStatus.textContent = "Data prevista de entrega: ";

            const dataEntrega = new Date();
            dataEntrega.setDate(dataEntrega.getDate() + 10);

            dataStatus.textContent = dataEntrega.toLocaleDateString("pt-BR");

            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Entregue") {
            labelStatus.textContent = "Data de entrega: ";
            dataStatus.textContent = new Date().toLocaleDateString("pt-BR");
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Cancelado") {
            labelStatus.textContent = "Data do cancelamento: ";
            dataStatus.textContent = new Date().toLocaleDateString("pt-BR");
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Pagamento recusado") {
            labelStatus.textContent = "Data da recusa: ";
            dataStatus.textContent = new Date().toLocaleDateString("pt-BR");
            secaoStatus.style.display = "block";
        }

        modal.classList.add("active");
    });
});

// Fechar modal
btnFechar.addEventListener("click", function() {
    modal.classList.remove("active");
});

// Status do pedido
const status = {
    "Em aberto": 1,
    "Em processamento": 2,
    "Pagamento realizado": 3,
    "Em trânsito": 4,
    "Entregue": 5
};

const dropdowns = document.querySelectorAll(".dropdown");
let pedidoCancelamento = null;

// Guarda o status anterior
dropdowns.forEach(function(dropdown) {
    dropdown.dataset.anterior = dropdown.value;
    dropdown.addEventListener("change", function() {
        let anterior = this.dataset.anterior;
        let novo = this.value;

        if (anterior === "Cancelado") {
            mostrarToast("O pedido cancelado não pode ser alterado.");
            this.value = anterior;
            return;
        }

        if (status[novo] < status[anterior]) {
            mostrarToast("Esse pedido não pode mais ser alterado.");
            this.value = anterior;
            return;
        }

        // Cancelar
        if (novo === "Cancelado") {
            if (anterior !== "Em aberto" && anterior !== "Em processamento") {
                mostrarToast("Esse pedido não pode mais ser cancelado.");
                this.value = anterior;
                return;
            }

            pedidoCancelamento = this;
            this.value = anterior;

            modalCancelarPedido.classList.add("active");
            return;
        }


        // Pagamento recusado
        if (novo === "Pagamento recusado") {
            if (anterior !== "Em aberto" && anterior !== "Em processamento") {
                mostrarToast("O pagamento não pode mais ser recusado.");
                this.value = anterior;
                return;
            }

            this.dataset.anterior = novo;
            return;
        }

        // Salva o novo status
        this.dataset.anterior = novo;
    });
});

// Toast
function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMensagem").innerText = mensagem;
    toast.classList.add("ativo");

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 3000);
}

// Modal de cancelar
const modalCancelarPedido = document.getElementById("modalCancelarPedido");

// Fechar pelo X
document.getElementById("btnFecharModalCancelarPedido")
    .addEventListener("click", cancelarCancelamento);

// Clicar em "Não"
document.getElementById("btnNaoCancelarPedido")
    .addEventListener("click", cancelarCancelamento);

// Confirmar cancelamento
document.getElementById("btnConfirmarCancelamento")
    .addEventListener("click", function() {
        pedidoCancelamento.value = "Cancelado";
        pedidoCancelamento.dataset.anterior = "Cancelado";

        modalCancelarPedido.classList.remove("active");
        pedidoCancelamento = null;

    });


// Cancelar a ação
function cancelarCancelamento() {
    modalCancelarPedido.classList.remove("active");

        pedidoCancelamento.value = pedidoCancelamento.dataset.anterior;
        pedidoCancelamento = null;
}