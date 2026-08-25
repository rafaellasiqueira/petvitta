const modal = document.getElementById('modalCupom');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnFechar = document.getElementById('btnFecharModal');
const btnCancelar = document.getElementById('btnCancelar');
const botoesEditar = document.querySelectorAll('.btn-editar');
const tituloModal = document.getElementById('tituloModal');
const codigo = document.getElementById('codigo');
const tipoDesconto = document.getElementById('tipoDesconto');
const validade = document.getElementById('validade');
const valor = document.getElementById('valor');

// Abrir modal para cadastrar
btnCadastrar.addEventListener('click', function () {
    tituloModal.textContent = 'Cadastrar cupom';
    codigo.value = '';
    validade.value = '';
    valor.value = '';
    modal.classList.add('active');
});

// Abrir modal para editar
botoesEditar.forEach(botao => {
    botao.addEventListener('click', function () {
        tituloModal.textContent = 'Editar cupom';
        codigo.value = botao.dataset.codigo;
        validade.value = botao.dataset.validade;
        valor.value = botao.dataset.valor;
        modal.classList.add('active');
    });
});

// Fechar pelo X
btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});

// Fechar pelo botão Cancelar
btnCancelar.addEventListener('click', function () {
    modal.classList.remove('active');
});