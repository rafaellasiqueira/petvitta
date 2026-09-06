document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formCadastroCliente');

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

    // Validação CPF + máscara
    const inputCpf = document.getElementById('cpf');
    const erroCpf = document.getElementById('erroCpf');

    inputCpf.addEventListener('input', function () {
        let cpf = inputCpf.value.replace(/\D/g, '').slice(0, 11);

        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        inputCpf.value = cpf;

        if (cpf.length < 14) {
            erroCpf.textContent = 'Digite o CPF completo.';
        } else if (!cpfValido(cpf)) {
            erroCpf.textContent = 'Digite um CPF válido.';
        } else {
            erroCpf.textContent = '';
        }
    });

    function cpfValido(cpf) {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }

        let resto = soma % 11;
        let resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        resto = soma % 11;
        let resultado2 = 11 - resto;

        if (resultado2 >= 10) {
            resultado2 = 0;
        }

        return resultado2 === Number(cpf[10]);
    }

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

    // Validação data de nascimento
    const inputDataNascimento = document.getElementById('dataNascimento');
    const erroDataNascimento = document.getElementById('erroDataNascimento');

    function validarDataNascimento() {
        const valor = inputDataNascimento.value;

        if (valor.split('-')[0].length !== 4) {
            erroDataNascimento.textContent = 'Digite um ano com 4 dígitos.';
            return false;
        }

        const data = new Date(valor);
        const hoje = new Date();


        if (data > hoje) {
            erroDataNascimento.textContent = 'A data não pode ser futura.';
            return false;
        }

        erroDataNascimento.textContent = '';
        return true;
    }

    inputDataNascimento.addEventListener('input', validarDataNascimento);

    // Mostrar senha
    document.querySelectorAll('.btn-mostrar-senha').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const senha = document.getElementById(botao.dataset.input);
            const icone = botao.querySelector('i');

            if (senha.type === 'password') {
                senha.type = 'text';
                icone.classList.remove('fa-eye');
                icone.classList.add('fa-eye-slash');
            } else {
                senha.type = 'password';
                icone.classList.remove('fa-eye-slash');
                icone.classList.add('fa-eye');
            }
        });
    });

    // Validação e-mail
    const inputEmail = document.getElementById('email');
    const erroEmail = document.getElementById('erroEmail');

    inputEmail.addEventListener('input', function() {
        if (inputEmail.checkValidity()) {
            erroEmail.textContent = '';
        } else {
            erroEmail.textContent = 'Digite um e-mail válido.';
        }
    });

    // Validação senha
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');

    senha.addEventListener('input', function () {

        erroSenha.textContent = '';

        if (this.value.length < 8) {
            erroSenha.textContent = 'A senha deve ter pelo menos 8 caracteres.';

        } else if (!/[A-Z]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos uma letra maiúscula.';

        } else if (!/[a-z]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos uma letra minúscula.';

        } else if (!/[^A-Za-z0-9]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos um caractere especial.';
        }
    });

    confirmarSenha.addEventListener('input', function() {
        if (this.value !== senha.value) {
            erroConfirmarSenha.textContent = 'As senhas não coincidem.';
        } else {
            erroConfirmarSenha.textContent = '';
        }
    });

    // Validação endereco
    function configurarEndereco(endereco) {
        const inputNomeIdentificacao = endereco.querySelector('.nome-identificacao');
        const erroNomeIdentificacao = endereco.querySelector('.erroNomeIdentificacao');
        const inputCep = endereco.querySelector('.cep');
        const erroCep = endereco.querySelector('.erroCep');
        const inputNumero = endereco.querySelector('.numero');

        // Validação nome de identificação
        inputNomeIdentificacao.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

            if (this.value.trim().length < 3) {
                erroNomeIdentificacao.textContent = 'Digite um nome com pelo menos 3 caracteres.';
            } else {
                erroNomeIdentificacao.textContent = '';
            }
        });

        // Validação CEP + máscara + API ViaCEP
        inputCep.addEventListener('input', function () {
            let cep = inputCep.value.replace(/\D/g, '').slice(0, 8);

            if (cep.length > 5) {
                cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
            }

            inputCep.value = cep;
            erroCep.textContent = '';
            if (cep.replace(/\D/g, '').length === 8) {
                buscarCep(cep);
            } else {
                erroCep.textContent = 'Digite um CEP válido.';
                return false;
            }
        });

        function buscarCep(cep) {
            cep = cep.replace(/\D/g, '');

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(dados => {

                    if (dados.erro) {
                        erroCep.textContent = 'CEP não encontrado.';
                        return;
                    }

                    erroCep.textContent = '';

                    const logradouro = endereco.querySelector('.logradouro');
                    const bairro = endereco.querySelector('.bairro');
                    const cidade = endereco.querySelector('.cidade');
                    const estado = endereco.querySelector('.estado');

                    logradouro.value = dados.logradouro || '';

                    bairro.value = dados.bairro || '';

                    cidade.value = dados.localidade || '';

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

        // Validação número do endereço
        inputNumero.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    document.querySelectorAll('.endereco-item').forEach(function (endereco) {
        configurarEndereco(endereco);
    });

    // Validação dos cartões
    function configurarCartao(cartao) {
        const numero = cartao.querySelector('.numero-cartao');
        const nome = cartao.querySelector('.nome-cartao');
        const erroNomeCartao = cartao.querySelector('.erroNomeCartao');
        const cvv = cartao.querySelector('.cvv-cartao');
        const erroNumero = cartao.querySelector('.erroNumeroCartao');
        const erroCvv = cartao.querySelector('.erroCvvCartao');


        // Número do cartão
        numero.addEventListener('input', function() {
            let valor = numero.value.replace(/\D/g, '');

            valor = valor.slice(0, 16);

            if (valor.length > 4) {
                valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
            }

            numero.value = valor;

            if (!numeroValido(valor)) {
                erroNumero.textContent = 'Digite um número de cartão válido.';
            } else {
                erroNumero.textContent = '';
            }
        });

        // Nome do cartão
        nome.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

            if (this.value.trim().length < 3) {
                erroNomeCartao.textContent = 'Digite um nome com pelo menos 3 caracteres.';
            } else {
                erroNomeCartao.textContent = '';
            }
        });

        // CVV
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');

            if (this.value.length < 3) {
                erroCvv.textContent = 'Digite um CVV válido.';
            } else {
                erroCvv.textContent = '';
            }
        });
    }

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

            soma = soma + digito;
        }

        return soma % 10 === 0;
    }

    document.querySelectorAll('.cartao-item').forEach(function (cartao) {
        configurarCartao(cartao);
    });

    // Impedir envio se houver erro
    form.addEventListener('submit', function (event) {

        let formularioValido = true;

        // Nome
        if (inputNome.value.trim() === '') {
            erroNome.textContent = 'Preencha o nome.';
            formularioValido = false;
        }

        // CPF
        if (inputCpf.value.trim() === '') {
            erroCpf.textContent = 'Preencha o CPF.';
            formularioValido = false;
        }

        // Telefone
        if (inputTelefone.value.trim() === '') {
            erroTelefone.textContent = 'Preencha o telefone.';
            formularioValido = false;
        }

        // Data de nascimento
        if (inputDataNascimento.value === '') {
            erroDataNascimento.textContent = 'Preencha a data de nascimento.';
            formularioValido = false;
        }

        // E-mail
        if (inputEmail.value.trim() === '') {
            erroEmail.textContent = 'Preencha o e-mail.';
            formularioValido = false;
        }

        // Senha
        if (senha.value === '') {
            erroSenha.textContent = 'Preencha a senha.';
            formularioValido = false;
        }

        // Confirmar senha
        if (confirmarSenha.value === '') {
            erroConfirmarSenha.textContent = 'Confirme a senha.';
            formularioValido = false;
        }

        // Endereços
        document.querySelectorAll('.endereco-item').forEach(function (endereco) {

            const nome = endereco.querySelector('.nome-identificacao');
            const erroNome = endereco.querySelector('.erroNomeIdentificacao');

            const tipoEndereco = endereco.querySelector('[name*=".tipoEndereco"]');
            const erroTipoEndereco = endereco.querySelector('.erroTipoEndereco');

            const tipoResidencia = endereco.querySelector('[name*=".tipoResidencia"]');
            const erroTipoResidencia = endereco.querySelector('.erroTipoResidencia');

            const tipoLogradouro = endereco.querySelector('[name*=".tipoLogradouro"]');
            const erroTipoLogradouro = endereco.querySelector('.erroTipoLogradouro');

            const estado = endereco.querySelector('.estado');
            const erroEstado = endereco.querySelector('.erroEstado');

            const cep = endereco.querySelector('.cep');
            const erroCep = endereco.querySelector('.erroCep');

            const logradouro = endereco.querySelector('.logradouro');
            const erroLogradouro = endereco.querySelector('.erroLogradouro');

            const bairro = endereco.querySelector('.bairro');
            const erroBairro = endereco.querySelector('.erroBairro');

            const numero = endereco.querySelector('.numero');
            const erroNumero = endereco.querySelector('.erroNumero');

            const cidade = endereco.querySelector('.cidade');
            const erroCidade = endereco.querySelector('.erroCidade');

            const pais = endereco.querySelector('.pais');
            const erroPais = endereco.querySelector('.erroPais');


            // Nome de identificação
            if (nome.value.trim() === '') {
                erroNome.textContent = 'Preencha o nome de identificação.';
                formularioValido = false;
            }

            // Tipo de endereço
            if (tipoEndereco.value === '') {
                erroTipoEndereco.textContent = 'Selecione o tipo de endereço.';
                formularioValido = false;
            }

            // Tipo de residência
            if (tipoResidencia.value === '') {
                erroTipoResidencia.textContent = 'Selecione o tipo de residência.';
                formularioValido = false;
            }

            // Tipo de logradouro
            if (tipoLogradouro.value === '') {
                erroTipoLogradouro.textContent = 'Selecione o tipo de logradouro.';
                formularioValido = false;
            }

            // CEP
            if (cep.value.trim() === '') {
                erroCep.textContent = 'Preencha o CEP.';
                formularioValido = false;
            }

            // Logradouro
            if (logradouro.value.trim() === '') {
                erroLogradouro.textContent = 'Preencha o logradouro.';
                formularioValido = false;
            }

            // Bairro
            if (bairro.value.trim() === '') {
                erroBairro.textContent = 'Preencha o nome do bairro.';
                formularioValido = false;
            }

            // Número
            if (numero.value.trim() === '') {
                erroNumero.textContent = 'Preencha o número.';
                formularioValido = false;
            }

            // Estado
            if (estado.value === '') {
                erroEstado.textContent = 'Selecione o estado.';
                formularioValido = false;
            }

            // Cidade
            if (cidade.value.trim() === '') {
                erroCidade.textContent = 'Preencha o nome da cidade.';
                formularioValido = false;
            }

            // País
            if (pais.value.trim() === '') {
                erroPais.textContent = 'Preencha o nome do país.';
                formularioValido = false;
            }
        });

        // Cartões
        document.querySelectorAll('.cartao-item').forEach(function (cartao) {

            const numero = cartao.querySelector('.numero-cartao');
            const nome = cartao.querySelector('.nome-cartao');
            const bandeira = cartao.querySelector('[name*=".bandeira"]');
            const cvv = cartao.querySelector('.cvv-cartao');

            const erroNumero = cartao.querySelector('.erroNumeroCartao');
            const erroNome = cartao.querySelector('.erroNomeCartao');
            const erroBandeiraCartao = cartao.querySelector('.erroBandeiraCartao');
            const erroCvv = cartao.querySelector('.erroCvvCartao');

            if (numero.value.trim() === '') {
                erroNumero.textContent = 'Preencha o número do cartão.';
                formularioValido = false;
            }

            if (nome.value.trim() === '') {
                erroNome.textContent = 'Preencha o nome do cartão.';
                formularioValido = false;
            }

            if (bandeira.value === '') {
                erroBandeiraCartao.textContent = 'Selecione a bandeira do cartão.';
                formularioValido = false;
            }

            if (cvv.value.trim() === '') {
                erroCvv.textContent = 'Preencha o CVV.';
                formularioValido = false;
            }
        });

        if (!formularioValido) {
            event.preventDefault();
        }
    });

    // Adicionar endereco
    const listaEnderecos = document.getElementById('listaEnderecos');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');

    btnAdicionarEndereco.addEventListener('click', function () {
        const endereco = listaEnderecos.querySelector('.endereco-item').cloneNode(true);
        const indice = listaEnderecos.querySelectorAll('.endereco-item').length;

        endereco.querySelector('.btn-remover-item').style.display = 'block';

        endereco.querySelectorAll('input').forEach(function (input) {
            input.value = '';

            if (input.name) {
                input.name = input.name.replace(
                    /enderecos\[\d+\]/,
                    `enderecos[${indice}]`
                );
            }
        });

        endereco.querySelectorAll('select').forEach(function (select) {
            select.selectedIndex = 0;

            if (select.name) {
                select.name = select.name.replace(
                    /enderecos\[\d+\]/,
                    `enderecos[${indice}]`
                );
            }
        });

        endereco.querySelectorAll('textarea').forEach(function (textarea) {
            textarea.value = '';

            if (textarea.name) {
                textarea.name = textarea.name.replace(
                    /enderecos\[\d+\]/,
                    `enderecos[${indice}]`
                );
            }
        });

        endereco.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        listaEnderecos.appendChild(endereco);

        configurarEndereco(endereco);
    });

    // Adicionar cartão
    const listaCartoes = document.getElementById('listaCartoes');
    const btnAdicionarCartao = document.getElementById('btnAdicionarCartao');

    btnAdicionarCartao.addEventListener('click', function () {
        const cartao = listaCartoes.querySelector('.cartao-item').cloneNode(true);
        const indice = listaCartoes.querySelectorAll('.cartao-item').length;

        cartao.querySelector('.btn-remover-item').style.display = 'block';

        cartao.querySelectorAll('input').forEach(function (input) {
            input.value = '';

            if (input.type === 'radio') {
                input.checked = false;
            }
        });

        cartao.querySelectorAll('select').forEach(function (select) {
            select.selectedIndex = 0;
        });

        cartao.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        cartao.querySelectorAll('[name]').forEach(function (campo) {
            campo.name = campo.name.replace(/\[\d+\]/, `[${indice}]`);
        });

        listaCartoes.appendChild(cartao);

        configurarCartao(cartao);
    });

    // Excluir
    document.addEventListener('click', function (event) {
        const botao = event.target.closest('.btn-remover-item');

        const item = botao.closest('.endereco-item, .cartao-item');

        item.remove();
    });
});