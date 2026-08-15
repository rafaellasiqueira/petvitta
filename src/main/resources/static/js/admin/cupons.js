const modal = document.getElementById('modalCupom');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnFechar = document.getElementById('btnFecharModal');
const btnCancelar = document.getElementById('btnCancelar');
const botoesEditar = document.querySelectorAll('.btn-editar');
const tituloModal = document.getElementById('tituloModal');
const codigo = document.getElementById('codigo');
const tipoDesconto = document.getElementById('tipoDesconto');
const labelDesconto = document.getElementById('labelDesconto');
const desconto = document.getElementById('desconto');
const validade = document.getElementById('validade');


// Abrir modal para cadastrar
btnCadastrar.addEventListener('click', function () {
    tituloModal.textContent = 'Cadastrar cupom';
    codigo.value = '';
    tipoDesconto.value = 'percentual';
    desconto.value = '';
    validade.value = '';
    labelDesconto.textContent = 'Percentual';
    desconto.placeholder = 'Digite o percentual';
    modal.classList.add('active');
});


// Abrir modal para editar
botoesEditar.forEach(botao => {
    botao.addEventListener('click', function () {
        tituloModal.textContent = 'Editar cupom';
        codigo.value = botao.dataset.codigo;
        tipoDesconto.value = botao.dataset.tipo;
        desconto.value = botao.dataset.desconto;
        validade.value = botao.dataset.validade;

        if (botao.dataset.tipo === 'percentual') {
            labelDesconto.textContent = 'Percentual';
            desconto.placeholder = 'Digite o percentual';
        } else {
            labelDesconto.textContent = 'Valor';
            desconto.placeholder = 'Digite o valor';

        }

        modal.classList.add('active');
    });
});

// Trocar entre Percentual e Valor
tipoDesconto.addEventListener('change', function () {

    if (tipoDesconto.value === 'percentual') {
        labelDesconto.textContent = 'Percentual';
        desconto.placeholder = 'Digite o percentual';
    } else {
        labelDesconto.textContent = 'Valor';
        desconto.placeholder = 'Digite o valor';

    }

});


// Fechar pelo X
btnFechar.addEventListener('click', function () {
    modal.classList.remove('active');
});


// Fechar pelo botão Cancelar
btnCancelar.addEventListener('click', function () {
    modal.classList.remove('active');
});