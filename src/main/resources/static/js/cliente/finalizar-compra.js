// Modal de alterar endereço
const modalAlterar = document.getElementById('modalAlterarEndereco');
const btnAlterarEndereco = document.getElementById('btnAlterarEndereco');
const btnFecharAlterar = document.getElementById('btnFecharModalAlterarEndereco');
const btnConfirmarEndereco = document.getElementById('btnConfirmarEndereco');


// Modal de adicionar/editar endereço
const modalAdicionar = document.getElementById('modalAdicionarEndereco');
const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
const btnFecharAdicionar = document.getElementById('btnFecharModalEndereco');
const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');

const tituloModalEndereco = document.getElementById('tituloModalEndereco');


// Campos do formulário
const nomeIdentificacao = document.getElementById('nomeIdentificacao');
const tipoEndereco = document.getElementById('tipoEndereco');
const tipoResidencia = document.getElementById('tipoResidencia');
const tipoLogradouro = document.getElementById('tipoLogradouro');
const cep = document.getElementById('cep');
const logradouro = document.getElementById('logradouro');
const bairro = document.getElementById('bairro');
const numero = document.getElementById('numero');
const estado = document.getElementById('estado');
const cidade = document.getElementById('cidade');
const pais = document.getElementById('pais');
const observacoes = document.getElementById('observacoes');
const salvarPerfil = document.getElementById('salvarPerfil');


// ================================
// ABRIR MODAL DE ALTERAR ENDEREÇO
// ================================

btnAlterarEndereco.addEventListener('click', function (event) {
    event.preventDefault();

    modalAlterar.classList.add('active');
});


// ================================
// FECHAR MODAL DE ALTERAR ENDEREÇO
// ================================

btnFecharAlterar.addEventListener('click', function () {
    modalAlterar.classList.remove('active');
});


// ================================
// CONFIRMAR ENDEREÇO SELECIONADO
// ================================

btnConfirmarEndereco.addEventListener('click', function () {

    const enderecoSelecionado = document.querySelector(
        'input[name="endereco"]:checked'
    );

    if (enderecoSelecionado) {
        modalAlterar.classList.remove('active');
    } else {
        alert('Selecione um endereço.');
    }
});


// ================================
// ABRIR MODAL PARA ADICIONAR
// ================================

btnAdicionarEndereco.addEventListener('click', function () {

    // Muda o título
    tituloModalEndereco.textContent = 'Adicionar endereço';

    // Muda o texto do botão
    btnSalvarEndereco.textContent = 'Adicionar';

    // Limpa os campos
    limparFormulario();

    // Fecha o modal de seleção
    modalAlterar.classList.remove('active');

    // Abre o modal de cadastro
    modalAdicionar.classList.add('active');
});


// ================================
// FECHAR MODAL
// ================================

btnFecharAdicionar.addEventListener('click', function () {
    modalAdicionar.classList.remove('active');
});


// ================================
// BOTÃO CANCELAR
// ================================

btnCancelarEndereco.addEventListener('click', function () {
    modalAdicionar.classList.remove('active');
});


// ================================
// BOTÃO ADICIONAR / SALVAR
// ================================

btnSalvarEndereco.addEventListener('click', function () {

    // Aqui futuramente você pode enviar os dados para o Spring Boot

    console.log('Nome:', nomeIdentificacao.value);
    console.log('Tipo de endereço:', tipoEndereco.value);
    console.log('Tipo de residência:', tipoResidencia.value);
    console.log('Tipo de logradouro:', tipoLogradouro.value);
    console.log('CEP:', cep.value);
    console.log('Logradouro:', logradouro.value);
    console.log('Bairro:', bairro.value);
    console.log('Número:', numero.value);
    console.log('Estado:', estado.value);
    console.log('Cidade:', cidade.value);
    console.log('País:', pais.value);
    console.log('Observações:', observacoes.value);
    console.log('Salvar no perfil:', salvarPerfil.checked);

    modalAdicionar.classList.remove('active');
});


// ================================
// LIMPAR FORMULÁRIO
// ================================

function limparFormulario() {

    nomeIdentificacao.value = '';
    tipoEndereco.value = '';
    tipoResidencia.value = '';
    tipoLogradouro.value = '';
    cep.value = '';
    logradouro.value = '';
    bairro.value = '';
    numero.value = '';
    estado.value = '';
    cidade.value = '';
    pais.value = 'Brasil';
    observacoes.value = '';
    salvarPerfil.checked = false;
}

// ================================
// EDITAR ENDEREÇO
// ================================

const botoesEditarEndereco = document.querySelectorAll('.editar-endereco');

botoesEditarEndereco.forEach(function (botao) {

    botao.addEventListener('click', function (event) {

        // Impede o clique de selecionar o radio
        event.preventDefault();

        // Abre o modal de adicionar/editar
        modalAdicionar.classList.add('active');

        // Altera o título
        tituloModalEndereco.textContent = 'Editar endereço';

        // Altera o texto do botão
        btnSalvarEndereco.textContent = 'Salvar';

        // Exemplo: pega o endereço onde o botão foi clicado
        const endereco = botao.closest('.modalEndereco');

        const nome = endereco.querySelector('h3').textContent;
        const tipoResidenciaTexto = endereco.querySelectorAll('span')[0].textContent;
        const enderecoCompleto = endereco.querySelectorAll('span')[1].textContent;
        const cepTexto = endereco.querySelectorAll('span')[2].textContent;

        // Preenche o nome
        nomeIdentificacao.value = nome;

        // Preenche o tipo de residência
        tipoResidencia.value = tipoResidenciaTexto.toLowerCase();

        // Exemplo de CEP
        const cepValor = cepTexto
            .replace('CEP:', '')
            .split(',')[0]
            .trim();

        cep.value = cepValor;

        // Aqui você pode preencher os outros campos
        // quando tiver os dados separados:
        //
        // tipoEndereco.value = ...
        // tipoLogradouro.value = ...
        // logradouro.value = ...
        // bairro.value = ...
        // numero.value = ...
        // estado.value = ...
        // cidade.value = ...
        // pais.value = ...
        // observacoes.value = ...
    });
});