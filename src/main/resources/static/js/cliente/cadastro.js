document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formCadastroCliente');

    // Selecionar primeira opção
    document.querySelectorAll('select').forEach(function (select) {
        select.selectedIndex = 0;
    });

// Adicionar endereço
    const listaEnderecos = document.getElementById('listaEnderecos');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');

    btnAdicionarEndereco.addEventListener('click', function () {

        const endereco = listaEnderecos
            .querySelector('.endereco-item')
            .cloneNode(true);

        const indice =
            listaEnderecos.querySelectorAll('.endereco-item').length;

        endereco.querySelector('.btn-remover-item').style.display = 'block';

        endereco.querySelectorAll('input').forEach(function (input) {
            input.value = '';
        });

        endereco.querySelectorAll('select').forEach(function (select) {
            select.selectedIndex = 0;
        });

        endereco.querySelectorAll('textarea').forEach(function (textarea) {
            textarea.value = '';
        });

        endereco.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        endereco.querySelectorAll('[name]').forEach(function (campo) {
            campo.name = campo.name.replace(
                /\[\d+\]/,
                `[${indice}]`
            );
        });

        listaEnderecos.appendChild(endereco);

        configurarEndereco(endereco);
    });

    // Excluir endereço
    document.addEventListener('click', function (event) {
        const botao = event.target.closest('.endereco-item .btn-remover-item');

        if (!botao) {
            return;
        }

        const endereco = botao.closest('.endereco-item');
        endereco.remove();
    });

    // Adicionar cartão
    const listaCartoes = document.getElementById('listaCartoes');
    const btnAdicionarCartao = document.getElementById('btnAdicionarCartao');

    btnAdicionarCartao.addEventListener('click', function () {

        const cartao = listaCartoes
            .querySelector('.cartao-item')
            .cloneNode(true);

        const indice =
            listaCartoes.querySelectorAll('.cartao-item').length;

        cartao.querySelector('.btn-remover-item').style.display = 'block';

        cartao.querySelectorAll('input').forEach(function (input) {
            input.value = '';
            input.checked = false;
        });

        cartao.querySelectorAll('select').forEach(function (select) {
            select.selectedIndex = 0;
        });

        cartao.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        cartao.querySelectorAll('[name]').forEach(function (campo) {
            campo.name = campo.name.replace(
                /\[\d+\]/,
                `[${indice}]`
            );
        });


        listaCartoes.appendChild(cartao);

        configurarCartao(cartao);
        configurarPreferencial(cartao);
    });


// Configurar primeiro endereço
    document.querySelectorAll('.endereco-item').forEach(function (endereco) {
        configurarEndereco(endereco);
    });

// Configurar primeiro cartão
    document.querySelectorAll('.cartao-item').forEach(function (cartao) {
        configurarCartao(cartao);
        configurarPreferencial(cartao);
    });

    // Excluir cartão
    document.addEventListener('click', function (event) {
        const botao = event.target.closest('.cartao-item .btn-remover-item');

        if (!botao) {
            return;
        }

        const cartao = botao.closest('.cartao-item');
        cartao.remove();
    });

    // Data de nascimento
    const inputDataNascimento = document.getElementById('dataNascimento');
    const erroDataNascimento = document.getElementById('erroDataNascimento');

    // Gênero
    const inputGenero = document.getElementById('genero');
    const erroGenero = document.getElementById('erroGenero');


    // Senha
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');

    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmarSenha =
        document.getElementById('erroConfirmarSenha');

    senha.addEventListener('input', function () {

        validarSenha(senha, erroSenha);
    });

    confirmarSenha.addEventListener('input', function () {

        validarConfirmacaoSenha(
            senha,
            confirmarSenha,
            erroConfirmarSenha
        );
    });


// Validação antes do envio
form.addEventListener('submit', function (event) {
    let formularioValido = true;

    // Nome
    const inputNome = document.getElementById('nome');
    const erroNome = document.getElementById('erroNome');

    if (inputNome.value.trim() === '') {
        erroNome.textContent = 'Preencha o nome.';
        inputNome.focus();
        formularioValido = false;
    } else if (inputNome.value.trim().length < 3) {
        erroNome.textContent = 'Digite um nome com pelo menos 3 caracteres.';
        inputNome.focus();
        formularioValido = false;
    }

    // CPF
    const inputCpf = document.getElementById('cpf');
    const erroCpf = document.getElementById('erroCpf');

    if (inputCpf.value.trim() === '') {
        erroCpf.textContent = 'Preencha o CPF.';
        inputCpf.focus();
        formularioValido = false;
    } else if (!cpfValido(inputCpf.value)) {
        erroCpf.textContent = 'Digite um CPF válido.';
        inputCpf.focus();
        formularioValido = false;
    }

    // Tipo de telefone
    const inputTipoTelefone = document.getElementById('tipoTelefone');
    const erroTipoTelefone =
        document.getElementById('erroTipoTelefone');

    if (inputTipoTelefone.value.trim() === '') {
        erroTipoTelefone.textContent = 'Selecione o tipo de telefone.';
        inputTipoTelefone.focus();
        formularioValido = false;
    }

    // Telefone
    const inputTelefone = document.getElementById('telefone');
    const erroTelefone = document.getElementById('erroTelefone');

    const telefone = inputTelefone.value.replace(/\D/g, '');

    if (telefone === '') {
        erroTelefone.textContent = 'Preencha o telefone.';
        inputTelefone.focus();
        formularioValido = false;

    } else if (
        inputTipoTelefone.value === '2' &&
        telefone.length !== 10
    ) {
        erroTelefone.textContent = 'Digite o telefone completo.';
        inputTelefone.focus();
        formularioValido = false;

    } else if (
        inputTipoTelefone.value !== '2' &&
        telefone.length !== 11
    ) {
        erroTelefone.textContent = 'Digite o telefone completo.';
        inputTelefone.focus();
        formularioValido = false;
    }

    // Gênero
    if (inputGenero.value.trim() === '') {
        erroGenero.textContent = 'Selecione o gênero.';
        inputGenero.focus();
        formularioValido = false;
    }

    // Data
    if (inputDataNascimento.value === '') {
        erroDataNascimento.textContent = 'Preencha a data de nascimento.';
        inputDataNascimento.focus();
        formularioValido = false;

    } else {
        const data = new Date(inputDataNascimento.value);
        const hoje = new Date();

        if (data > hoje) {
            erroDataNascimento.textContent = 'A data não pode ser futura.';
            inputDataNascimento.focus();
            formularioValido = false;
        }
    }

    // E-mail
    const inputEmail = document.getElementById('email');
    const erroEmail = document.getElementById('erroEmail');

    if (inputEmail.value.trim() === '') {
        erroEmail.textContent = 'Preencha o e-mail.';
        inputEmail.focus();
        formularioValido = false;

    } else if (!inputEmail.checkValidity()) {
        erroEmail.textContent = 'Digite um e-mail válido.';
        inputEmail.focus();
        formularioValido = false;
    }

    // Senha
    const senha = document.getElementById('senha');
    const erroSenha = document.getElementById('erroSenha');

    if (!validarSenha(senha, erroSenha)) {
        formularioValido = false;
    }

    // Confirmar senha
    const confirmarSenha = document.getElementById('confirmarSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');

    if (!validarConfirmacaoSenha(
        senha,
        confirmarSenha,
        erroConfirmarSenha
    )) {
        formularioValido = false;
    }

    // Validação dos endereços
    document.querySelectorAll('.endereco-item').forEach(function (endereco) {

        const nome = endereco.querySelector('.nome-identificacao');
        const tipoEndereco = endereco.querySelector('[name*=".tipoEndereco"]');
        const tipoResidencia = endereco.querySelector('[name*=".tipoResidencia"]');
        const tipoLogradouro = endereco.querySelector('[name*=".tipoLogradouro"]');
        const cep = endereco.querySelector('.cep');
        const logradouro = endereco.querySelector('.logradouro');
        const bairro = endereco.querySelector('.bairro');
        const numero = endereco.querySelector('.numero');
        const estado = endereco.querySelector('.estado');
        const cidade = endereco.querySelector('.cidade');
        const pais = endereco.querySelector('.pais');

        if (nome.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroNomeIdentificacao').textContent = 'Preencha o nome com até 20 caracteres.';
            nome.focus();

        } else if (nome.value.trim().length < 3) {
            formularioValido = false;
            endereco.querySelector('.erroNomeIdentificacao').textContent = 'Digite um nome com pelo menos 3 caracteres.';
            nome.focus();
        }

        if (tipoEndereco.value === '') {
            formularioValido = false;
            endereco.querySelector('.erroTipoEndereco').textContent = 'Selecione o tipo de endereço.';
            tipoEndereco.focus();
        }

        if (tipoResidencia.value === '') {
            formularioValido = false;
            endereco.querySelector('.erroTipoResidencia').textContent = 'Selecione o tipo de residência.';
            tipoResidencia.focus();
        }

        if (tipoLogradouro.value === '') {
            formularioValido = false;
            endereco.querySelector('.erroTipoLogradouro').textContent = 'Selecione o tipo de logradouro.';
            tipoLogradouro.focus();
        }

        const cepNumeros = cep.value.replace(/\D/g, '');

        if (cep.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroCep').textContent = 'Preencha o CEP.';
            cep.focus();

        } else if (cepNumeros.length !== 8) {
            formularioValido = false;
            endereco.querySelector('.erroCep').textContent = 'Digite um CEP válido.';
            cep.focus();
        }

        if (logradouro.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroLogradouro').textContent = 'Preencha o logradouro.';
            logradouro.focus();
        }

        if (bairro.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroBairro').textContent = 'Preencha o nome do bairro.';
            bairro.focus();
        }

        if (numero.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroNumero').textContent = 'Preencha o número.';
            numero.focus();
        }

        if (estado.value === '') {
            formularioValido = false;
            endereco.querySelector('.erroEstado').textContent = 'Selecione o estado.';
            estado.focus();
        }

        if (cidade.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroCidade').textContent = 'Preencha o nome da cidade.';
            cidade.focus();
        }

        if (pais.value.trim() === '') {
            formularioValido = false;
            endereco.querySelector('.erroPais').textContent = 'Preencha o nome do país.';
            pais.focus();
        }
    });


    // Validação dos cartões
    document.querySelectorAll('.cartao-item').forEach(function (cartao) {

        const numero = cartao.querySelector('.numero-cartao');
        const nome = cartao.querySelector('.nome-cartao');
        const bandeira = cartao.querySelector('[name*=".bandeira"]');
        const cvv = cartao.querySelector('.cvv-cartao');

        const erroNumero = cartao.querySelector('.erroNumeroCartao');
        const erroNome = cartao.querySelector('.erroNomeCartao');
        const erroBandeira = cartao.querySelector('.erroBandeiraCartao');
        const erroCvv = cartao.querySelector('.erroCvvCartao');

        if (numero.value.trim() === '') {
            formularioValido = false;
            erroNumero.textContent = 'Preencha o número do cartão.';
            numero.focus();

        } else if (!numeroValido(numero.value)) {
            formularioValido = false;
            erroNumero.textContent = 'Número do cartão inválido.';
            numero.focus();
        }

        if (nome.value.trim() === '') {
            formularioValido = false;
            erroNome.textContent = 'Preencha o nome do cartão.';
            nome.focus();

        } else if (nome.value.trim().length < 3) {
            formularioValido = false;
            erroNome.textContent = 'O nome deve ter pelo menos 3 caracteres.';
            nome.focus();
        }

        if (bandeira.value === '') {
            formularioValido = false;
            erroBandeira.textContent = 'Selecione a bandeira do cartão.';
            bandeira.focus();
        }

        if (cvv.value.trim() === '') {
            formularioValido = false;
            erroCvv.textContent = 'Preencha o CVV.';
            cvv.focus();

        } else if (cvv.value.length < 3 || cvv.value.length > 4) {
            formularioValido = false;
            erroCvv.textContent = 'O CVV deve ter 3 ou 4 números.';
            cvv.focus();
        }
    });

    // Impede o envio se houver algum erro
    if (!formularioValido) {
        event.preventDefault();
    }
});
});

function configurarPreferencial(cartao) {
    const radio = cartao.querySelector('input[type="radio"]');
    radio.addEventListener('change', function () {
        document.querySelectorAll('.cartao-item input[type="radio"]')
            .forEach(function (outroRadio) {
                if (outroRadio !== radio) {
                    outroRadio.checked = false;
                }
            });
    });
}