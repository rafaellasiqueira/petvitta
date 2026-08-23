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

        secaoStatus.style.display = "none";

        if (statusAtual === "Pagamento realizado") {
            labelStatus.textContent = "Data do pagamento: ";
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Em trânsito") {
            labelStatus.textContent = "Data prevista de entrega: ";
            dataStatus.textContent = dataHoje(10);
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Entregue") {
            labelStatus.textContent = "Data de entrega: ";
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Cancelado") {
            labelStatus.textContent = "Data do cancelamento: ";
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = "block";
        }

        if (statusAtual === "Pagamento recusado") {
            labelStatus.textContent = "Data da recusa: ";
            dataStatus.textContent = dataHoje();
            secaoStatus.style.display = "block";
        }
        modal.classList.add("active");
    });
});


// =====================================================
// DATA
// =====================================================

function dataHoje(dias = 0) {

    const data = new Date();

    data.setDate(data.getDate() + dias);

    return data.toLocaleDateString("pt-BR");
}


// =====================================================
// FECHAR MODAL DE DETALHES
// =====================================================

btnFechar.addEventListener("click", function() {

    modal.classList.remove("active");

});


// =====================================================
// STATUS DOS PEDIDOS
// =====================================================

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

        const anterior = this.dataset.anterior;
        const novo = this.value;


        // =================================================
        // STATUS FINAL
        // =================================================

        if (
            anterior === "Entregue" ||
            anterior === "Cancelado" ||
            anterior === "Pagamento recusado"
        ) {

            mostrarToast("Esse pedido não pode mais ser alterado.");

            this.value = anterior;

            return;
        }


        // =================================================
        // CANCELAR PEDIDO
        // =================================================

        if (novo === "Cancelado") {

            if (
                anterior !== "Em aberto" &&
                anterior !== "Em processamento"
            ) {

                mostrarToast("Esse pedido não pode mais ser cancelado.");

                this.value = anterior;

                return;
            }

            pedidoCancelamento = this;

            this.value = anterior;

            modalCancelarPedido.classList.add("active");

            return;
        }


        // =================================================
        // PAGAMENTO RECUSADO
        // =================================================

        if (novo === "Pagamento recusado") {

            if (
                anterior !== "Em aberto" &&
                anterior !== "Em processamento"
            ) {

                mostrarToast("O pagamento não pode mais ser recusado.");

                this.value = anterior;

                return;
            }

            this.dataset.anterior = novo;

            return;
        }


        // =================================================
        // NÃO PERMITE VOLTAR
        // =================================================

        if (status[novo] < status[anterior]) {

            mostrarToast("Não é permitido voltar o status do pedido.");

            this.value = anterior;

            return;
        }


        // Salva o novo status
        this.dataset.anterior = novo;

    });
});


// =====================================================
// TOAST
// =====================================================

function mostrarToast(mensagem) {

    const toast = document.getElementById("toast");
    const mensagemToast = document.getElementById("toastMensagem");

    mensagemToast.textContent = mensagem;

    toast.classList.add("ativo");

    setTimeout(function() {

        toast.classList.remove("ativo");

    }, 3000);
}


// =====================================================
// MODAL DE CANCELAR PEDIDO
// =====================================================

const modalCancelarPedido =
    document.getElementById("modalCancelarPedido");


// Fechar pelo X
document.getElementById("btnFecharModalCancelarPedido")
    .addEventListener("click", cancelarCancelamento);


// Clicar em "Não"
document.getElementById("btnNaoCancelarPedido")
    .addEventListener("click", cancelarCancelamento);


// Confirmar cancelamento
document.getElementById("btnConfirmarCancelamento")
    .addEventListener("click", function() {

        if (pedidoCancelamento) {

            pedidoCancelamento.value = "Cancelado";

            pedidoCancelamento.dataset.anterior =
                "Cancelado";

            pedidoCancelamento = null;
        }

        modalCancelarPedido.classList.remove("active");

    });


// Cancelar a ação
function cancelarCancelamento() {

    modalCancelarPedido.classList.remove("active");

    if (pedidoCancelamento) {

        pedidoCancelamento.value =
            pedidoCancelamento.dataset.anterior;

        pedidoCancelamento = null;
    }
}