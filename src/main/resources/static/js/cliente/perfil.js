document.addEventListener('DOMContentLoaded', function() {

    // Toast
    const toast = document.getElementById('toast');

    if (toast) {
        toast.classList.add('ativo');

        setTimeout(() => {
            toast.classList.remove('ativo');
        }, 6000);
    }

    // Dados pessoais
    const form = document.getElementById('formDadosPessoais');

    // Validação nome
    const inputNome = document.getElementById('nome');
    const erroNome = document.getElementById('erroNome');

    inputNome.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        if (this.value.trim().length < 3) {
            erroNome.textContent = 'Digite um nome com pelo menos de 3 caracteres.';
        } else {
            erroNome.textContent = '';
        }
    });

    // Validação telefone + máscara
    const inputTelefone = document.getElementById('telefone');
    const erroTelefone = document.getElementById('erroTelefone');
    const tipoTelefone = document.getElementById('tipoTelefone');

    inputTelefone.addEventListener('input', function () {
        let telefone = inputTelefone.value.replace(/\D/g, '');
        const tipo = tipoTelefone.value;

        if (tipo === '2') { // Fixo
            telefone = telefone.slice(0, 10);
            if (telefone.length > 2) telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            telefone = telefone.slice(0, 11);
            if (telefone.length > 2) telefone = telefone.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        inputTelefone.value = telefone;

        if (!telefoneValido(telefone)) {
            erroTelefone.textContent = 'Digite o telefone completo.';
        } else {
            erroTelefone.textContent = '';
        }
    });

    function telefoneValido(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (tipoTelefone.value === '2') {
            return telefone.length === 10;
        } else {
            return telefone.length === 11;
        }
    }

    tipoTelefone.addEventListener('change', function () {
        inputTelefone.value = '';
        erroTelefone.textContent = '';
        if (this.value === '2') {
            inputTelefone.placeholder = '(00) 0000-0000';
        } else {
            inputTelefone.placeholder = '(00) 00000-0000';
        }
    });

    // Impedir envio se houver erro
    form.addEventListener('submit', function (event) {

        let formularioValido = true;

        // Nome
        if (inputNome.value.trim() === '') {
            erroNome.textContent = 'Preencha o nome.';
            formularioValido = false;
        }

        // Telefone
        if (inputTelefone.value.trim() === '') {
            erroTelefone.textContent = 'Preencha o telefone.';
            formularioValido = false;
        }

        if (!formularioValido) {
            event.preventDefault();
        }

    });

    // Senha
    document.querySelectorAll('.btn-mostrar-senha').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const senha = document.getElementById(botao.dataset.input);
            const icone = botao.querySelector('i');

            if (senha.type === "password") {
                senha.type = "text";
                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");
            } else {
                senha.type = "password";
                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");
            }
        });
    });

    // Alterar senha
    const formSenha = document.querySelector('.form-alterar-senha');
    const atual = document.getElementById('senhaAtual');
    const nova = document.getElementById('novaSenha');
    const confirmar = document.getElementById('confirmarSenha');

    const erroSenhaAtual = document.getElementById('erroSenhaAtual');
    const erroNovaSenha = document.getElementById('erroNovaSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');

    // Validar senha atual
    atual.addEventListener('input', function() {
        erroSenhaAtual.textContent = '';

        if (this.value === '') {
            erroSenhaAtual.textContent = 'Digite sua senha atual.';
        }
    });

    // Validar nova senha enquanto digita
    nova.addEventListener('input', function() {
        erroNovaSenha.textContent = '';

        if (this.value.length < 8) {
            erroNovaSenha.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        } else if (!/[A-Z]/.test(this.value)) {
            erroNovaSenha.textContent = 'A senha deve ter pelo menos uma letra maiúscula.';
        } else if (!/[a-z]/.test(this.value)) {
            erroNovaSenha.textContent = 'A senha deve ter pelo menos uma letra minúscula.';
        } else if (!/[^A-Za-z0-9]/.test(this.value)) {
            erroNovaSenha.textContent = 'A senha deve ter pelo menos um caractere especial.';
        }

        if (confirmar.value !== '') {
            erroConfirmarSenha.textContent = '';

            if (confirmar.value !== this.value) {
                erroConfirmarSenha.textContent = 'As senhas não coincidem.';
            }
        }
    });

    // Validar confirmação enquanto digita
    confirmar.addEventListener('input', function() {
        erroConfirmarSenha.textContent = '';

        if (this.value !== nova.value) {
            erroConfirmarSenha.textContent = 'As senhas não coincidem.';
        }
    });

    // Enviar formulário
    formSenha.addEventListener('submit', function(e) {

        let valido = true;

        if (atual.value === '') {
            erroSenhaAtual.textContent = 'Digite sua senha atual.';
            valido = false;
        }

        if (nova.value === '') {
            erroNovaSenha.textContent = 'Digite uma nova senha.';
            valido = false;
        }

        if (confirmar.value === '') {
            erroConfirmarSenha.textContent = 'Confirme a nova senha.';
            valido = false;
        }

        if (!valido) {
            e.preventDefault();
        }
    });

    // Endereço
    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');

    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
    const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');

    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');

    const nomeIdentificacao = document.getElementById('nomeIdentificacao');
    const tipoEndereco = document.getElementById('tipoEndereco');
    const tipoResidencia = document.getElementById('tipoResidencia');
    const tipoLogradouro = document.getElementById('tipoLogradouro');

    const cep = document.getElementById('cep');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const numeroEndereco = document.getElementById('numero');

    const estado = document.getElementById('estado');
    const cidade = document.getElementById('cidade');
    const pais = document.getElementById('pais');

    const observacoes = document.getElementById('observacoes');

    // Esconde o campo de salvar perfil
    if (campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }

    // Funções de erro
    function limparErrosEndereco() {
        document.querySelectorAll('#formEndereco .mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });
    }

    function mostrarErro(campoErro, mensagem) {
        if (campoErro) {
            campoErro.textContent = mensagem;
        }
    }

    // Nome de identificação
    nomeIdentificacao.addEventListener('input', function () {
        // Permite apenas letras, acentos e espaços
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        const erro = document.getElementById('erroNomeIdentificacao');
        if (this.value.trim().length < 3) {
            erro.textContent = 'Digite um nome com pelo menos 3 caracteres.';
        } else {
            erro.textContent = '';
        }
    });


    // Validação CEP + máscara + API ViaCEP
    cep.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        this.value = valor;

        const erroCep = document.getElementById('erroCep');
        erroCep.textContent = '';

        // Se ainda não tiver 8 números
        if (valor.replace(/\D/g, '').length === 8) {
            buscarCep(valor);
        } else {
            erroCep.textContent = 'Digite um CEP válido';
            return false;
        }

    });


    function buscarCep(valorCep) {
        const cepNumeros = valorCep.replace(/\D/g, '');
        const erroCep = document.getElementById('erroCep');

        fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
            .then(response => response.json())
            .then(dados => {
                if (dados.erro) {
                    erroCep.textContent = 'CEP não encontrado.';
                    return;
                }

                erroCep.textContent = '';

                // Preenche os campos retornados pelo ViaCEP
                logradouro.value = dados.logradouro || '';
                bairro.value = dados.bairro || '';
                cidade.value = dados.localidade || '';

                // Seleciona o estado
                for (let i = 0; i < estado.options.length; i++) {
                    if (estado.options[i].textContent.startsWith(dados.uf)) {
                        estado.value = estado.options[i].value;
                        break;
                    }
                }

            })
            .catch(() => {
                erroCep.textContent = 'Não foi possível consultar o CEP.';
            });
    }


    // Número
    numeroEndereco.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });

    // Validação completa
    function validarEndereco() {
        let formularioValido = true;
        limparErrosEndereco();

        // Nome de identificação
        if (nomeIdentificacao.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroNomeIdentificacao'),
                'Preencha o nome de identificação.'
            );
            formularioValido = false;
        }

        // Tipo de endereço
        if (tipoEndereco.value === '') {
            mostrarErro(
                document.getElementById('erroTipoEndereco'),
                'Selecione o tipo de endereço.'
            );
            formularioValido = false;
        }

        // Tipo de residencia
        if (tipoResidencia.value === '') {
            mostrarErro(
                document.getElementById('erroTipoResidencia'),
                'Selecione o tipo de residência.'
            );
            formularioValido = false;
        }

        // Tipo de logradouro
        if (tipoLogradouro.value === '') {
            mostrarErro(
                document.getElementById('erroTipoLogradouro'),
                'Selecione o tipo de logradouro.'
            );
            formularioValido = false;
        }

        // CEP

        const cepNumeros = cep.value.replace(/\D/g, '');
        if (cep.value.trim() === '') {

            mostrarErro(
                document.getElementById('erroCep'),
                'Preencha o CEP.'
            );

            formularioValido = false;
        }

        // Logradouro
        if (logradouro.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroLogradouro'),
                'Preencha o logradouro.'
            );
            formularioValido = false;
        }

        // Bairro
        if (bairro.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroBairro'),
                'Preencha o nome do bairro.'
            );
            formularioValido = false;
        }

        // Número
        if (numeroEndereco.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroNumero'),
                'Preencha o número.'
            );
            formularioValido = false;
        }

        // Estado
        if (estado.value === '') {
            mostrarErro(
                document.getElementById('erroEstado'),
                'Selecione o estado.'
            );
            formularioValido = false;
        }

        // Cidade

        if (cidade.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroCidade'),
                'Preencha o nome da cidade.'
            );
            formularioValido = false;
        }

        // País
        if (pais.value.trim() === '') {
            mostrarErro(
                document.getElementById('erroPais'),
                'Preencha o nome do país.'
            );
            formularioValido = false;
        }

        return formularioValido;
    }

    // Adicionar endereço
    const enderecoId = document.getElementById('enderecoId');
    btnAdicionarEndereco.addEventListener('click', function () {
        formEndereco.reset();
        limparErrosEndereco();

        enderecoId.value = '';

        tituloEndereco.textContent = 'Adicionar endereço';
        btnSalvarEndereco.textContent = 'Adicionar';

        tipoEndereco.value = '';
        tipoResidencia.value = '';
        tipoLogradouro.value = '';
        estado.value = '';
        pais.value = '';

        campoSalvarPerfil.style.display = 'none';

        formEndereco.action = '/cliente/adicionar-endereco';

        modalEndereco.classList.add('active');
    });

    // Editar
    document.querySelectorAll('.editar-endereco').forEach(function (botao) {
        botao.addEventListener('click', function (e) {
            e.preventDefault();

            limparErrosEndereco();

            enderecoId.value = this.dataset.id;

            tituloEndereco.textContent = 'Editar endereço';
            btnSalvarEndereco.textContent = 'Salvar';

            nomeIdentificacao.value = this.dataset.nome || '';
            tipoEndereco.value = this.dataset.tipoEndereco || '';
            tipoResidencia.value = this.dataset.tipoResidencia || '';
            tipoLogradouro.value = this.dataset.tipoLogradouro || '';

            cep.value = this.dataset.cep || '';
            logradouro.value = this.dataset.logradouro || '';
            bairro.value = this.dataset.bairro || '';
            numeroEndereco.value = this.dataset.numero || '';

            estado.value = this.dataset.estado || '';
            cidade.value = this.dataset.cidade || '';
            pais.value = this.dataset.pais || 'Brasil';

            observacoes.value = this.dataset.observacoes || '';

            campoSalvarPerfil.style.display = 'none';

            formEndereco.action = '/cliente/editar-endereco';

            modalEndereco.classList.add('active');
        });
    });

    // Fechar modal
    btnFecharEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });

    btnCancelarEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });


    // Salvar endereço
    formEndereco.addEventListener('submit', function (e) {

        if (!validarEndereco()) {
            e.preventDefault();
            return;
        }
    });

    // Cartão
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');
    const btnAdicionarCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    const numeroCartao = document.getElementById('numeroCartao');
    const nomeCartao = document.getElementById('nomeCartao');
    const bandeiraCartao = document.getElementById('bandeiraCartao');
    const cvv = document.getElementById('cvvCartao');
    const validade = document.getElementById('validadeCartao');
    const erroNumeroCartao = document.getElementById('erroNumeroCartao');
    const erroNomeCartao = document.getElementById('erroNomeCartao');
    const erroBandeira = document.getElementById('erroBandeira');
    const erroCvv = document.getElementById('erroCVV');
    const erroValidade = document.getElementById('erroValidadeCartao');
    const campoSalvarPerfilCartao = document.getElementById('campoSalvarCartao');
    const cartaoPreferencial = document.getElementById('cartaoPreferencial');

    if (campoSalvarPerfilCartao) {
        campoSalvarPerfilCartao.style.display = 'none';
    }

// Abrir cartão
    btnAdicionarCartao.addEventListener('click', function () {

        formCartao.reset();

        document.getElementById('tituloModalCartao').textContent =
            'Cadastrar cartão';

        document.getElementById('btnSalvarCartao').textContent =
            'Cadastrar';

        erroNumeroCartao.textContent = '';
        erroNomeCartao.textContent = '';
        erroBandeira.textContent = '';
        erroCvv.textContent = '';

        if (erroValidade) {
            erroValidade.textContent = '';
        }

        cartaoPreferencial.checked = false;

        formCartao.action = '/cliente/adicionar-cartao';
        formCartao.method = 'post';

        modalCartao.classList.add('active');
    });

// Fechar cartão
    if (btnFecharCartao) {
        btnFecharCartao.addEventListener('click', function () {
            modalCartao.classList.remove('active');
        });
    }

    if (btnCancelarCartao) {
        btnCancelarCartao.addEventListener('click', function () {
            modalCartao.classList.remove('active');
        });
    }

// Nome do cartão
    nomeCartao.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        if (this.value.trim().length < 3) {
            erroNomeCartao.textContent = 'Digite um nome com pelo menos 3 caracteres.';
        } else {
            erroNomeCartao.textContent = '';
        }
    });

// Número do cartão
    numeroCartao.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '');

        valor = valor.slice(0, 16);

        if (valor.length > 4) {
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        }

        this.value = valor;

        if (valor.length > 0 && !numeroValido(valor)) {
            erroNumeroCartao.textContent = 'Digite um número de cartão válido.';
        } else {
            erroNumeroCartao.textContent = '';
        }
    });

// Bandeira
    bandeiraCartao.addEventListener('change', function () {
        if (this.value === '') {
            erroBandeira.textContent = 'Selecione a bandeira do cartão.';
        } else {
            erroBandeira.textContent = '';
        }
    });

// CVV
    cvv.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);

        if (this.value.length > 0 && this.value.length < 3) {
            erroCvv.textContent = 'Digite um CVV válido.';
        } else {
            erroCvv.textContent = '';
        }
    });

// Validade
    if (validade) {
        validade.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 4);

            if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
            }

            this.value = valor;

            if (valor.length === 5) {
                validarValidade();
            } else {
                erroValidade.textContent = '';
            }
        });
    }

// Validar validade
    function validarValidade() {
        const valor = validade.value;

        if (valor.length !== 5) {
            erroValidade.textContent = 'Digite uma validade válida.';
            return false;
        }

        const partes = valor.split('/');
        const mes = parseInt(partes[0]);
        const ano = parseInt('20' + partes[1]);

        if (mes < 1 || mes > 12) {
            erroValidade.textContent = 'Digite uma validade válida.';
            return false;
        }

        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = hoje.getMonth() + 1;

        if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
            erroValidade.textContent = 'Cartão vencido.';
            return false;
        }

        erroValidade.textContent = '';
        return true;
    }

// Validar número do cartão
    function numeroValido(numero) {
        numero = numero.replace(/\D/g, '');

        if (numero.length !== 16) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 16; i++) {
            let digito = Number(numero[i]);

            if (i % 2 === 0) {
                digito = digito * 2;

                if (digito > 9) {
                    digito = digito - 9;
                }
            }

            soma += digito;
        }

        return soma % 10 === 0;
    }

// Validar cartão
    formCartao.addEventListener('submit', function (event) {

        let formularioValido = true;

        erroNumeroCartao.textContent = '';
        erroNomeCartao.textContent = '';
        erroBandeira.textContent = '';
        erroCvv.textContent = '';

        if (erroValidade) {
            erroValidade.textContent = '';
        }

        const numero = numeroCartao.value.replace(/\D/g, '');

        if (numero.length === 0) {

            erroNumeroCartao.textContent =
                'Preencha o número do cartão.';

            formularioValido = false;

        } else if (!numeroValido(numero)) {

            erroNumeroCartao.textContent =
                'Digite um número de cartão válido.';

            formularioValido = false;
        }

        if (nomeCartao.value.trim() === '') {

            erroNomeCartao.textContent =
                'Preencha o nome do cartão.';

            formularioValido = false;
        }

        if (bandeiraCartao.value === '') {

            erroBandeira.textContent =
                'Selecione a bandeira do cartão.';

            formularioValido = false;
        }

        if (cvv.value.trim() === '') {

            erroCvv.textContent =
                'Preencha o CVV.';

            formularioValido = false;

        } else if (!/^\d{3,4}$/.test(cvv.value)) {

            erroCvv.textContent =
                'Digite um CVV válido.';

            formularioValido = false;
        }

        if (!formularioValido) {
            event.preventDefault();
        }
    });

        const modalExcluir = document.getElementById('modalConfirmarExclusao');
        const btnFecharExcluir = document.getElementById('btnFecharModalExclusao');
        const btnCancelarExcluir = document.getElementById('btnCancelarExclusao');
        const formExcluir = document.getElementById('formExcluir');
        const mensagemModalExclusao = document.getElementById('mensagemModalExclusao');
        const idExcluir = document.getElementById('idExcluir');


        // =========================
        // EXCLUIR ENDEREÇO
        // =========================

    document.querySelectorAll('.excluir-endereco').forEach(botao => {

        botao.addEventListener('click', function () {

            const id = this.dataset.id;
            const nome = this.dataset.nome;

            mensagemModalExclusao.textContent =
                `Tem certeza de que deseja excluir o endereço "${nome}"?`;

            formExcluir.action = '/cliente/excluir-endereco';

            idExcluir.name = 'enderecoId';
            idExcluir.value = id;

            modalExcluir.classList.add('active');
        });
    });

        // =========================
        // EXCLUIR CARTÃO
        // =========================

    document.querySelectorAll('.excluir-cartao').forEach(botao => {

        botao.addEventListener('click', function () {

            const id = this.dataset.id;
            const nome = this.dataset.nome;

            mensagemModalExclusao.textContent =
                `Tem certeza de que deseja excluir o cartão ${nome}?`;

            formExcluir.action = '/cliente/excluir-cartao';

            idExcluir.name = 'cartaoId';
            idExcluir.value = id;

            modalExcluir.classList.add('active');
        });
    });


        // =========================
        // FECHAR MODAL
        // =========================

        function fecharModalExcluir() {
            modalExcluir.classList.remove('active');
        }

        btnFecharExcluir.addEventListener('click', fecharModalExcluir);

        btnCancelarExcluir.addEventListener('click', fecharModalExcluir);



});