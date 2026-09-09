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
    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');
    const nomeIdentificacao = document.getElementById('nomeIdentificacao');
    const tipoEndereco = document.getElementById('tipoEndereco');
    const tipoResidencia = document.getElementById('tipoResidencia');
    const tipoLogradouro = document.getElementById('tipoLogradouro');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const estado = document.getElementById('estado');
    const cidade = document.getElementById('cidade');
    const pais = document.getElementById('pais');
    const observacoes = document.getElementById('observacoes');
    const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');

    if (campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }

    // Endereço
    const cep = document.getElementById('cep');
    const numeroEndereco = document.getElementById('numero');

    cep.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        this.value = valor;
    });

    // Número
    numeroEndereco.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });

    btnAdicionarEndereco.addEventListener('click', function() {
        formEndereco.reset();

        tituloEndereco.textContent = 'Adicionar endereço';

        document.getElementById('pais').value ='Brasil';

        modalEndereco.classList.add('active');
    });

    btnFecharEndereco.addEventListener('click', function() {
        modalEndereco.classList.remove('active');
    });

    btnCancelarEndereco.addEventListener('click', function() {
        modalEndereco.classList.remove('active');
    });

    document.querySelectorAll('.editar-endereco').forEach(function(botao) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            tituloEndereco.textContent = 'Editar endereço';
            btnSalvarEndereco.textContent = 'Salvar';

            nomeIdentificacao.value = this.dataset.nome;
            tipoEndereco.value = this.dataset.tipoEndereco;
            tipoResidencia.value = this.dataset.tipoResidencia;
            tipoLogradouro.value = this.dataset.tipoLogradouro;
            cep.value = this.dataset.cep;
            logradouro.value = this.dataset.logradouro;
            bairro.value = this.dataset.bairro;
            numeroEndereco.value = this.dataset.numero;
            estado.value = this.dataset.estado;
            cidade.value = this.dataset.cidade;
            pais.value = this.dataset.pais;
            observacoes.value = this.dataset.observacoes;

            campoSalvarPerfil.style.display = 'none';

            modalEndereco.classList.add('active');
        });
    });

    formEndereco.addEventListener('submit', function(e) {
        e.preventDefault();

        modalEndereco.classList.remove('active');
        mostrarToast('Endereço salvo com sucesso!');
    });


    // Cartão
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');
    const btnAdicionarCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    const numeroCartao = document.getElementById('numeroCartao');
    const cvv = document.getElementById('cvvCartao');
    const validade = document.getElementById('validadeCartao');
    const mensagemErroNumero = document.getElementById('mensagemErroNumero');
    const mensagemErroValidade = document.getElementById('mensagemErroValidade');
    const campoSalvarPerfilCartao = document.getElementById('campoSalvarCartao');


    if (campoSalvarPerfilCartao) {
        campoSalvarPerfilCartao.style.display = 'none';
    }

    // Abrir cartão
    btnAdicionarCartao.addEventListener('click', function (e) {
        e.preventDefault();

        formCartao.reset();

        document.getElementById('tituloModalCartao').textContent = 'Cadastrar cartão';
        document.getElementById('btnSalvarCartao').textContent = 'Cadastrar';

        mensagemErroNumero.textContent = '';
        mensagemErroValidade.textContent = '';

        modalCartao.classList.add('active');
    });

    // Fechar cartão
    btnFecharCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    btnCancelarCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    document.getElementById('nomeCartao').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });

    // Número do cartão
    numeroCartao.addEventListener('input', function () {
        let numero = this.value.replace(/\D/g, '');
        numero = numero.slice(0, 16);
        numero = numero.replace(/(\d{4})(?=\d)/g, '$1 ');

        this.value = numero;
    });

    // CVV
    cvv.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

    // Validade
    validade.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 4);

        if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }

        this.value = valor;
    });

    // Validar cartão enquanto digita
    numeroCartao.addEventListener('input', function() {
        mensagemErroNumero.textContent = '';

        const numero = this.value.replace(/\D/g, '');

        if (numero.length > 0 && numero.length < 16) {
            mensagemErroNumero.textContent = 'Digite o número completo do cartão.';
        }
    });

    validade.addEventListener('input', function() {
        mensagemErroValidade.textContent = '';

        const valor = this.value;

        if (valor.length === 5) {
            const partes = valor.split('/');
            const mes = parseInt(partes[0]);
            const ano = parseInt('20' + partes[1]);

            if (mes < 1 || mes > 12) {
                mensagemErroValidade.textContent = 'Digite uma validade válida.';
                return;
            }

            const dataValidade = new Date(ano, mes - 1, 1);
            const hoje = new Date();

            hoje.setHours(0, 0, 0, 0);

            if (dataValidade < hoje) {
                mensagemErroValidade.textContent = 'Cartão vencido.';
            }
        }
    });

// Validar cartão
    formCartao.addEventListener('submit', function(e) {
        e.preventDefault();

        mensagemErroNumero.textContent = '';
        mensagemErroValidade.textContent = '';

        const numero = numeroCartao.value.replace(/\D/g, '');
        const valorValidade = validade.value;

        let valido = true;

        if (numero.length !== 16) {
            mensagemErroNumero.textContent = 'Digite o número completo do cartão.';
            valido = false;
        }

        if (valorValidade.length !== 5) {
            mensagemErroValidade.textContent = 'Digite uma validade válida.';
            valido = false;
        } else {
            const partes = valorValidade.split('/');
            const mes = parseInt(partes[0]);
            const ano = parseInt('20' + partes[1]);

            if (mes < 1 || mes > 12) {
                mensagemErroValidade.textContent = 'Digite uma validade válida.';
                valido = false;
            } else {
                const dataValidade = new Date(ano, mes - 1, 1);
                const hoje = new Date();

                hoje.setHours(0, 0, 0, 0);

                if (dataValidade < hoje) {
                    mensagemErroValidade.textContent = 'Cartão vencido.';
                    valido = false;
                }
            }
        }

        if (!valido) {
            return;
        }

        modalCartao.classList.remove('active');
        mostrarToast('Cartão salvo com sucesso!');
    });

    document.querySelectorAll('.editar-cartao').forEach(function(botao) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            document.getElementById('tituloModalCartao').textContent = 'Editar cartão';
            document.getElementById('btnSalvarCartao').textContent = 'Salvar';

            numeroCartao.value = this.dataset.numero.replace(/\*/g, '').trim();
            document.getElementById('nomeCartao').value = this.dataset.nome;
            document.getElementById('bandeiraCartao').value = this.dataset.bandeira;
            cvv.value = this.dataset.cvv;
            validade.value = this.dataset.validade;

            mensagemErroNumero.textContent = '';
            mensagemErroValidade.textContent = '';

            modalCartao.classList.add('active');
        });
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