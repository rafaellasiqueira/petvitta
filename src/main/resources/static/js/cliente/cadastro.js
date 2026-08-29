document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formCadastroCliente');

    document.querySelectorAll('.cep').forEach(function (input) {
        input.value = input.value.replace(/\D/g, '').slice(0, 8);
    });

    // Validação nome
    const inputNome = document.getElementById('nome');
    const erroNome = document.getElementById('erroNome');

    inputNome.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
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

        let resto = (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        if (resto !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        resto = (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        return resto === Number(cpf[10]);
    }

    // Validação telefone + máscara
    const inputTelefone = document.getElementById('telefone');
    const erroTelefone = document.getElementById('erroTelefone');
    const tipoTelefone = document.getElementById('tipoTelefone');

    inputTelefone.addEventListener('input', function () {
        let telefone = inputTelefone.value.replace(/\D/g, '');
        const tipo = tipoTelefone.value;

        if (tipo === 'fixo') {
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
        if (tipoTelefone.value === 'fixo') {
            return telefone.length === 10;
        } else {
            return telefone.length === 11;
        }
    }

    tipoTelefone.addEventListener('change', function () {
        inputTelefone.value = '';
        erroTelefone.textContent = '';
        if (this.value === 'fixo') {
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

        if (!valor) {
            erroDataNascimento.textContent = 'Informe a data de nascimento.';
            return false;
        }

        const [ano, mes, dia] = valor.split('-').map(Number);
        const data = new Date(ano, mes - 1, dia);
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        if (
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            erroDataNascimento.textContent = 'Digite uma data válida.';
            return false;
        }

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

    function senhaValida() {
        return senha.value.length >= 8 &&
               /[A-Z]/.test(senha.value) &&
               /[a-z]/.test(senha.value) &&
               /[^A-Za-z0-9]/.test(senha.value);
    }

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
                erroNomeIdentificacao.textContent = 'Digite um nome válido.';
            } else {
                erroNomeIdentificacao.textContent = '';
            }
        });

        // Validação CEP + máscara
        inputCep.addEventListener('input', function () {
            let cep = inputCep.value.replace(/\D/g, '').slice(0, 8);

            if (cep.length > 5) {
                cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
            }

            inputCep.value = cep;

            if (!cepValido(cep)) {
                erroCep.textContent = 'Digite o CEP completo.';
            } else {
                erroCep.textContent = '';
            }
        });

        // Validação número do endereço
        inputNumero.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    function cepValido(cep) {
        cep = cep.replace(/\D/g, '');

        if (cep.length === 8) {
            return true;
        } else {
            return false;
        }
    }

    document.querySelectorAll('.endereco-item').forEach(function (endereco) {
        configurarEndereco(endereco);
    });

    // Validação dos cartões
    function configurarCartao(cartao) {
        const numero = cartao.querySelector('.numero-cartao');
        const nome = cartao.querySelector('.nome-cartao');
        const bandeira = cartao.querySelector('[name="bandeiraCartao"]');
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

            if (!numeroValido(valor, bandeira.value)) {
                erroNumero.textContent = 'Digite um número de cartão válido.';
            } else {
                erroNumero.textContent = '';
            }
        });

        // Nome do cartão
        nome.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
        });

        // CVV
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');

            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }

            if (this.value.length < 3) {
                erroCvv.textContent = 'Digite um CVV válido.';
            } else {
                erroCvv.textContent = '';
            }
        });
    }

    function numeroValido(numero, bandeira) {
        numero = numero.replace(/\D/g, '');

        let tamanho = 16;

        if (bandeira === 'american-express') {
            tamanho = 15;
        }

        if (numero.length !== tamanho) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < numero.length; i++) {
            let digito = Number(numero[i]);

            if ((numero.length - i) % 2 === 0) {
                digito = digito * 2;

                if (digito > 9) {
                    digito = digito - 9;
                }
            }

            soma = soma + digito;
        }

        if (soma % 10 === 0) {
            return true;
        } else {
            return false;
        }
    }

    document.querySelectorAll('.cartao-item').forEach(function (cartao) {
        configurarCartao(cartao);
    });

    // Impedir envio se houver erro
    form.addEventListener('submit', function (event) {

        if (inputNome.value.trim().length < 3) {
            erroNome.textContent = 'O nome deve ter pelo menos 3 caracteres.';
            event.preventDefault();
        }

        if (!cpfValido(inputCpf.value)) {
            event.preventDefault();
        }

        if (!telefoneValido(inputTelefone.value)) {
            event.preventDefault();
        }

        if (!validarDataNascimento()) {
            event.preventDefault();
        }

        if (!inputEmail.checkValidity()) {
            event.preventDefault();
        }

        if (!senhaValida()) {
            event.preventDefault();
        }

        if (confirmarSenha.value !== senha.value) {
            event.preventDefault();
        }

        document.querySelectorAll('.endereco-item').forEach(function (endereco) {
            const inputNomeIdentificacao = endereco.querySelector('.nome-identificacao');
            const inputCep = endereco.querySelector('.cep');

            if (inputNomeIdentificacao.value.trim().length < 3) {
                event.preventDefault();
            }

            if (!cepValido(inputCep.value)) {
                event.preventDefault();
            }
        });

        document.querySelectorAll('.cartao-item').forEach(function (cartao) {
            const numero = cartao.querySelector('.numero-cartao');
            const bandeira = cartao.querySelector('[name="bandeiraCartao"]');
            const cvv = cartao.querySelector('.cvv-cartao');

            if (!numeroValido(numero.value, bandeira.value)) {
                event.preventDefault();
            }

            if (cvv.value.length < 3 || cvv.value.length > 4) {
                event.preventDefault();
            }
        });
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

        if (!botao) return;

        const item = botao.closest('.endereco-item, .cartao-item');

        if (item) {
            item.remove();
        }
    });

});