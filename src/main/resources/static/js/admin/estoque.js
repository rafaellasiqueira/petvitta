const modal = document.getElementById('modalEstoque');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnFechar = document.getElementById('btnFecharModal');
const btnCancelar = document.getElementById('btnCancelar');
const botoesEditar = document.querySelectorAll('.btn-editar');
const tituloModal = document.getElementById('tituloModal');
const produto = document.getElementById('produto');
const fornecedor = document.getElementById('fornecedor');
const quantidade = document.getElementById('quantidade');
const data = document.getElementById('dataEntrada');
const valorCusto = document.getElementById('valorCusto');
const valorVenda = document.getElementById('valorVenda');

// Abrir modal para cadastrar
btnCadastrar.addEventListener('click', function () {
    tituloModal.textContent = 'Registrar entrada';
    produto.value = '';
    fornecedor.value = '';
    quantidade.value = '';
    data.value = '';
    valorCusto.value = '';
    valorVenda.value = '';
    modal.classList.add('active');
});

// Fechar pelo X
btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});


// Fechar pelo botão Cancelar
btnCancelar.addEventListener('click', function () {
    modal.classList.remove('active');
});