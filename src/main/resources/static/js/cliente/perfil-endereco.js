document.addEventListener('DOMContentLoaded', function () {
    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
    const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');
    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');
    const enderecoId = document.getElementById('enderecoId');

    const modalExclusao = document.getElementById('modalConfirmarExclusao');
    const btnFecharExclusao = document.getElementById('btnFecharModalExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');

    configurarEndereco(modalEndereco);

    if (campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }

    // Adicionar endereço
    btnAdicionarEndereco.addEventListener('click', function () {
        formEndereco.reset();
        enderecoId.value = '';
        tituloEndereco.textContent = 'Adicionar endereço';
        btnSalvarEndereco.textContent = 'Adicionar';
        formEndereco.action = '/cliente/adicionar-endereco';

        modalEndereco.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        modalEndereco.classList.add('active');
    });

    // Editar endereço
    document.querySelectorAll('.editar-endereco').forEach(function (botao) {
        botao.addEventListener('click', function (event) {
            event.preventDefault();

            modalEndereco.querySelectorAll('.mensagem-erro').forEach(function (erro) {
                erro.textContent = '';
            });

            enderecoId.value = this.dataset.id || '';
            tituloEndereco.textContent = 'Editar endereço';
            btnSalvarEndereco.textContent = 'Salvar';

            modalEndereco.querySelector('.nome-identificacao').value = this.dataset.nome || '';
            modalEndereco.querySelector('.tipo-endereco').value = this.dataset.tipoEndereco || '';
            modalEndereco.querySelector('.tipo-residencia').value = this.dataset.tipoResidencia || '';
            modalEndereco.querySelector('.tipo-logradouro').value = this.dataset.tipoLogradouro || '';
            modalEndereco.querySelector('.cep').value = this.dataset.cep || '';
            modalEndereco.querySelector('.logradouro').value = this.dataset.logradouro || '';
            modalEndereco.querySelector('.bairro').value = this.dataset.bairro || '';
            modalEndereco.querySelector('.numero').value = this.dataset.numero || '';
            modalEndereco.querySelector('.estado').value = this.dataset.estado || '';
            modalEndereco.querySelector('.cidade').value = this.dataset.cidade || '';
            modalEndereco.querySelector('.pais').value = this.dataset.pais || 'Brasil';
            modalEndereco.querySelector('#observacoes').value = this.dataset.observacoes || '';

            formEndereco.action = '/cliente/editar-endereco';

            modalEndereco.classList.add('active');
        });
    });

    // Excluir endereço
    document.querySelectorAll('.excluir-endereco').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const mensagem = document.getElementById('mensagemModalExclusao');
            const idExcluir = document.getElementById('idExcluir');
            const formExcluir = document.getElementById('formExcluir');

            mensagem.textContent =
                'Tem certeza que deseja excluir o endereço "' +
                this.dataset.nome + '"?';

            idExcluir.name = 'enderecoId';
            idExcluir.value = this.dataset.id;
            formExcluir.action = '/cliente/excluir-endereco';

            modalExclusao.classList.add('active');
        });
    });

    // Fechar modal de endereço
    btnFecharEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });

    btnCancelarEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });

// Validação antes do envio
formEndereco.addEventListener('submit', function (event) {
    let formularioValido = true;

    const nome = modalEndereco.querySelector('.nome-identificacao');
    const tipoEndereco = modalEndereco.querySelector('.tipo-endereco');
    const tipoResidencia = modalEndereco.querySelector('.tipo-residencia');
    const tipoLogradouro = modalEndereco.querySelector('.tipo-logradouro');
    const cep = modalEndereco.querySelector('.cep');
    const logradouro = modalEndereco.querySelector('.logradouro');
    const bairro = modalEndereco.querySelector('.bairro');
    const numero = modalEndereco.querySelector('.numero');
    const estado = modalEndereco.querySelector('.estado');
    const cidade = modalEndereco.querySelector('.cidade');
    const pais = modalEndereco.querySelector('.pais');

    const erroNome = modalEndereco.querySelector('.erroNomeIdentificacao');
    const erroTipoEndereco = modalEndereco.querySelector('.erroTipoEndereco');
    const erroTipoResidencia = modalEndereco.querySelector('.erroTipoResidencia');
    const erroTipoLogradouro = modalEndereco.querySelector('.erroTipoLogradouro');
    const erroCep = modalEndereco.querySelector('.erroCep');
    const erroLogradouro = modalEndereco.querySelector('.erroLogradouro');
    const erroBairro = modalEndereco.querySelector('.erroBairro');
    const erroNumero = modalEndereco.querySelector('.erroNumero');
    const erroEstado = modalEndereco.querySelector('.erroEstado');
    const erroCidade = modalEndereco.querySelector('.erroCidade');
    const erroPais = modalEndereco.querySelector('.erroPais');

    erroNome.textContent = '';
    erroTipoEndereco.textContent = '';
    erroTipoResidencia.textContent = '';
    erroTipoLogradouro.textContent = '';
    erroCep.textContent = '';
    erroLogradouro.textContent = '';
    erroBairro.textContent = '';
    erroNumero.textContent = '';
    erroEstado.textContent = '';
    erroCidade.textContent = '';
    erroPais.textContent = '';

    // Nome de identificação
    if (nome.value.trim() === '') {
        formularioValido = false;
        erroNome.textContent = 'Preencha o nome com até 20 caracteres.';
        nome.focus();

    } else if (nome.value.trim().length < 3) {
        formularioValido = false;
        erroNome.textContent = 'Digite um nome com pelo menos 3 caracteres.';
        nome.focus();
    }

    // Tipo de endereço
    if (tipoEndereco.value === '') {
        formularioValido = false;
        erroTipoEndereco.textContent = 'Selecione o tipo de endereço.';
        tipoEndereco.focus();
    }

    // Tipo de residência
    if (tipoResidencia.value === '') {
        formularioValido = false;
        erroTipoResidencia.textContent = 'Selecione o tipo de residência.';
        tipoResidencia.focus();
    }

    // Tipo de logradouro
    if (tipoLogradouro.value === '') {
        formularioValido = false;
        erroTipoLogradouro.textContent = 'Selecione o tipo de logradouro.';
        tipoLogradouro.focus();
    }

    // CEP
    const cepNumeros = cep.value.replace(/\D/g, '');

    if (cep.value.trim() === '') {
        formularioValido = false;
        erroCep.textContent = 'Preencha o CEP.';
        cep.focus();

    } else if (cepNumeros.length !== 8) {
        formularioValido = false;
        erroCep.textContent = 'Digite um CEP válido.';
        cep.focus();
    }

    // Logradouro
    if (logradouro.value.trim() === '') {
        formularioValido = false;
        erroLogradouro.textContent = 'Preencha o logradouro.';
        logradouro.focus();
    }

    // Bairro
    if (bairro.value.trim() === '') {
        formularioValido = false;
        erroBairro.textContent = 'Preencha o nome do bairro.';
        bairro.focus();
    }

    // Número
    if (numero.value.trim() === '') {
        formularioValido = false;
        erroNumero.textContent = 'Preencha o número.';
        numero.focus();
    }

    // Estado
    if (estado.value === '') {
        formularioValido = false;
        erroEstado.textContent = 'Selecione o estado.';
        estado.focus();
    }

    // Cidade
    if (cidade.value.trim() === '') {
        formularioValido = false;
        erroCidade.textContent = 'Preencha o nome da cidade.';
        cidade.focus();
    }

    // País
    if (pais.value.trim() === '') {
        formularioValido = false;
        erroPais.textContent = 'Preencha o nome do país.';
        pais.focus();
    }

    if (!formularioValido) {
        event.preventDefault();
    }
});

    // Fechar modal de exclusão
    btnFecharExclusao.addEventListener('click', function () {
        modalExclusao.classList.remove('active');
    });

    btnCancelarExclusao.addEventListener('click', function () {
        modalExclusao.classList.remove('active');
    });
});

