// Status das trocas
const status = {
    "Solicitada": 1,
    "Troca aceita": 2,
    "Item enviado": 3,
    "Item recebido": 4,
    "Troca processada": 5
};

const dropdowns = document.querySelectorAll(".dropdown");
let trocaRecusa;

// Guarda o status anterior
dropdowns.forEach(function(dropdown) {
    dropdown.dataset.anterior = dropdown.value;

    dropdown.addEventListener("change", function() {
        let anterior = this.dataset.anterior;
        let novo = this.value;

        // Não permite alterar uma troca recusada
        if (anterior === "Recusada") {
            mostrarToast("A troca recusada não pode ser alterada.");
            this.value = anterior;
            return;
        }

        // Não permite voltar o status
        if (status[novo] < status[anterior]) {
            mostrarToast("Não é permitido voltar o status.");
            this.value = anterior;
            return;
        }

        // Recusar troca
        if (novo === "Recusada") {
            if (anterior !== "Solicitada") {
                mostrarToast("Essa troca não pode mais ser recusada.");
                this.value = anterior;
                return;
            }

            trocaRecusa = this;
            document.getElementById("modalRecusa").classList.add("active");
            return;
        }

        // Salva o novo status
        this.dataset.anterior = novo;

        // Abre estoque quando receber o item
        if (novo === "Item recebido") {
            abrirEstoque(this);
        }
    });
});

// Mostrar mensagem
function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMensagem").innerText = mensagem;
    toast.classList.add("ativo");
    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 3000);
}

// Abrir modal de estoque
function abrirEstoque(dropdown) {
    const linha = dropdown.closest("tr");
    const botao = linha.querySelector(".btn-detalhes");

    const produtos = botao.dataset.produto.split(",");
    const lista = document.getElementById("listaItensEstoque");
    lista.innerHTML = ""; /* Limpa o conteúdo do modal */

    produtos.forEach(function(produto) {
        lista.innerHTML += `
            <div class="item-estoque-linha">
                <span>${produto.trim()}</span> <!-- Remove espaço em branco -->
                <input type="number" min="1" value="1"
                       class="quantidade-item">
            </div>
        `;
    });
    document.getElementById("modalEstoque").classList.add("active");
}


// Modal recusar

// Confirmar recusa
document.getElementById("btnConfirmarRecusa").addEventListener("click", function() {
        if (trocaRecusa) {
            trocaRecusa.value = "Recusada";
            trocaRecusa.dataset.anterior = "Recusada";
        }

        document.getElementById("modalRecusa").classList.remove("active");
        trocaRecusa = null;
    });

// Cancelar
function cancelarRecusa() {
    document.getElementById("modalRecusa").classList.remove("active");

    if (trocaRecusa) {
        trocaRecusa.value = trocaRecusa.dataset.anterior;
        trocaRecusa = null;
    }
}

// Fecha o modal de recusa
document.getElementById("btnFecharRecusa")
    .addEventListener("click", cancelarRecusa);

document.getElementById("btnCancelarRecusa")
    .addEventListener("click", cancelarRecusa);


// Modal de detalhes
const modalDetalhes = document.getElementById("modalTrocas");

document.querySelectorAll(".btn-detalhes").forEach(function(botao) {
    botao.addEventListener("click", function() {

        const linha = botao.closest("tr");
        const statusAtual = linha.querySelector(".dropdown").value;

        document.getElementById("modalStatus").innerText = statusAtual;
        document.getElementById("modalCodigo").innerText = botao.dataset.codigo;
        document.getElementById("modalCliente").innerText = botao.dataset.cliente;
        document.getElementById("modalProduto").innerText = botao.dataset.produto;
        document.getElementById("modalMotivo").innerText = botao.dataset.motivo;
        document.getElementById("modalJustificativa").innerText = botao.dataset.justificativa;
        document.getElementById("modalSolicitado").innerText = botao.dataset.solicitado;

        const secaoStatus = document.getElementById("secaoStatus");

        if (statusAtual === "Solicitada") {
            secaoStatus.style.display = "none";

        } else {
            document.getElementById("labelStatus").innerText =
                statusAtual + " em: ";

            document.getElementById("modalDataStatus").innerText =
                new Date().toLocaleDateString("pt-BR");

            secaoStatus.style.display = "block";
        }

        modalDetalhes.classList.add("active");
    });
});


// Fechar detalhes
document.getElementById("btnFecharModal")
    .addEventListener("click", function() {
        modalDetalhes.classList.remove("active");
    });


// Fechar estoque
document.getElementById("btnFecharEstoque")
    .addEventListener("click", function() {
        document.getElementById("modalEstoque").classList.remove("active");
    });


// Confirmar estoque
document.getElementById("btnConfirmarEstoque")
    .addEventListener("click", function() {

        const lista = document.getElementById("listaItensEstoque");
        const resumo = document.getElementById("resumoItens");
        resumo.innerHTML = "";

        lista.querySelectorAll(".item-estoque-linha").forEach(function(item) {
            const produto = item.querySelector("span").innerText;
            const quantidade = item.querySelector(".quantidade-item").value;

            resumo.innerHTML +=
                `<li>${produto} - Quantidade: ${quantidade}</li>`;
        });

        document.getElementById("resumoCupom").innerText = "TROCA-2026-001";

        document.getElementById("modalEstoque").classList.remove("active");
        document.getElementById("modalResumo").classList.add("active");
    });


// Fechar resumo
document.getElementById("btnFecharResumo")
    .addEventListener("click", function() {
        document.getElementById("modalResumo").classList.remove("active");
    });