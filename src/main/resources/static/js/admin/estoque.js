const modal = document.getElementById('modalEstoque');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnFechar = document.getElementById('btnFecharModal');
const btnCancelar = document.getElementById('btnCancelar');
const produto = document.getElementById('produto');
const fornecedor = document.getElementById('fornecedor');
const quantidade = document.getElementById('quantidade');
const data = document.getElementById('dataEntrada');
const valorCusto = document.getElementById('valorCusto');
const valorVenda = document.getElementById('valorVenda');

btnCadastrar.addEventListener('click', function () {
    produto.value = '';
    fornecedor.value = '';
    quantidade.value = '';
    data.value = '';
    valorCusto.value = '';
    valorVenda.value = '';
    modal.classList.add('active');
});

btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});

btnCancelar.addEventListener('click', function () {
    modal.classList.remove('active');
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