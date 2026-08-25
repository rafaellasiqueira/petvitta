document.addEventListener('DOMContentLoaded', () => {

//Filtro
const btnFiltro = document.getElementById('btnfiltrar');
const painelFiltro = document.getElementById('painelFiltro');
const btnLimpar = document.getElementById('btnLimparFiltro');

btnFiltro.addEventListener('click', () => {

    if (painelFiltro.style.display === 'none') {
        painelFiltro.style.display = 'block';
    } else {
        painelFiltro.style.display = 'none';
    }

});

// Máscaras
// Máscara CPF
document.getElementById('filtroCpf').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11); /* Remove oq nao e numero e limita a 11 caracteres */

    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.value = valor;
});

// Máscara telefone
document.getElementById('filtroTelefone').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length >  2) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
    }

    this.value = valor;
});

// Modais Ativar e Inativar
const modalInativar = document.getElementById('modalInativarCliente');
const modalAtivar = document.getElementById('modalAtivarCliente');
const formInativar = document.getElementById('formInativarCliente');
const formAtivar = document.getElementById('formAtivarCliente');
let botaoClicado;

document.querySelectorAll('.btn-inativar, .btn-ativar').forEach(botao => {
    botao.addEventListener('click', function () {
        botaoClicado = this;

        if (this.classList.contains('btn-inativar')) {
            modalInativar.classList.add('active');
        } else {
            modalAtivar.classList.add('active');
        }
    });
});

// Confirmar inativação
formInativar.addEventListener('submit', (event) => {
    event.preventDefault();

    const linha = botaoClicado.closest('tr');
    linha.classList.add('inativo');

    botaoClicado.textContent = 'Ativar';
    botaoClicado.classList.remove('btn-inativar');
    botaoClicado.classList.add('btn-ativar');
    modalInativar.classList.remove('active');
    formInativar.reset();
});

// Confirmar Ativação
formAtivar.addEventListener('submit', (event) => {
    event.preventDefault();

    const linha = botaoClicado.closest('tr');
    linha.classList.remove('inativo');

    botaoClicado.textContent = 'Inativar';
    botaoClicado.classList.remove('btn-ativar');
    botaoClicado.classList.add('btn-inativar');
    modalAtivar.classList.remove('active');
    formAtivar.reset();
});

// Fechal modal inativar
document.getElementById('btnFecharModalInativar').addEventListener('click', () => {
    modalInativar.classList.remove('active');
    formInativar.reset();
});

document.getElementById('btnCancelarInativar').addEventListener('click', () => {
    modalInativar.classList.remove('active');
    formInativar.reset();
});

// Fechar modal ativar
document.getElementById('btnFecharModalAtivar').addEventListener('click', () => {
    modalAtivar.classList.remove('active');
    formAtivar.reset();
});

document.getElementById('btnCancelarAtivar').addEventListener('click', () => {
    modalAtivar.classList.remove('active');
    formAtivar.reset();
});

// Editar cliente
document.querySelectorAll('.btn-editar').forEach(botao => {
    botao.addEventListener('click', () => {
        const cliente = {
            codigo: botao.dataset.codigo,
            nome: botao.dataset.nome,
            cpf: botao.dataset.cpf,
            email: botao.dataset.email,
            telefone: botao.dataset.telefone,
            tipoTelefone: 'celular',
            dataNascimento: '1995-05-20',
            genero: 'feminino'
        };
        localStorage.setItem('clienteParaEditar', JSON.stringify(cliente));
        window.location.href = '/admin/cadastrarCliente?editar=true';
    });
});

// Ver detalhes
document.querySelectorAll('.btn-detalhes').forEach(icone => {
    icone.addEventListener('click', () => {

        const cliente = {
            codigo: icone.dataset.codigo,
            nome: icone.dataset.nome,
            cpf: icone.dataset.cpf,
            email: icone.dataset.email,
            genero: icone.dataset.genero,
            ranking: icone.dataset.ranking,
            dataNascimento: icone.dataset.nascimento,
            telefone: icone.dataset.telefone,

            // Endereço
            nomeIdentificacao: icone.dataset.nomeIdentificacao,
            tipoEndereco: icone.dataset.tipoEndereco,
            tipoResidencia: icone.dataset.tipoResidencia,
            tipoLogradouro: icone.dataset.tipoLogradouro,
            cep: icone.dataset.cep,
            logradouro: icone.dataset.logradouro,
            bairro: icone.dataset.bairro,
            numero: icone.dataset.numero,
            estado: icone.dataset.estado,
            cidade: icone.dataset.cidade,
            pais: icone.dataset.pais,
            observacoes: icone.dataset.observacoes
        };

        localStorage.setItem('clienteParaDetalhar',JSON.stringify(cliente));

        window.location.href = '/admin/detalhesCliente';
    });

});

});