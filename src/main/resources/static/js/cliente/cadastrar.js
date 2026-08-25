document.addEventListener('DOMContentLoaded', function() {
    const tipoTelefone = document.getElementById('tipoTelefone');
    const telefone = document.getElementById('telefone');

    // Mostrar e ocultar senha
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

    // Máscara CPF
    document.getElementById('cpf').addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '').slice(0, 11);

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
    document.getElementById('telefone').addEventListener('input', function() {
        let telefone = this.value.replace(/\D/g, '');
        const tipo = document.getElementById('tipoTelefone').value;

        if (tipo === 'fixo') {
            telefone = telefone.slice(0, 10);

            if (telefone.length > 2) {
                telefone = telefone.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }

        } else {
            telefone = telefone.slice(0, 11);

            if (telefone.length > 2) {
                telefone = telefone.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        }

        this.value = telefone;
    });

    // Mudar placeholder do telefone
    document.getElementById('tipoTelefone').addEventListener('change', function() {
        const telefone = document.getElementById('telefone');

        if (this.value === 'fixo') {
            telefone.placeholder = '(00) 0000-0000';
        } else {
            telefone.placeholder = '(00) 00000-0000';
        }
    });

    // Máscara CEP
    document.getElementById('cep').addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '').slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        this.value = valor;
    });

    // Número do endereço
    document.getElementById('numero').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // CVV
    document.getElementById('cvvCartao').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

    // Máscara número do cartão
    document.getElementById('numeroCartao').addEventListener('input', function() {
        const mensagem = document.querySelector('.erroNumeroCartao');
        let numero = this.value.replace(/\D/g, '');
        numero = numero.slice(0, 16);

        if (numero.length !== 16) {
            mensagem.textContent = 'Digite o número completo do cartão.';
        } else {
            mensagem.textContent = '';
        }

        numero = numero.replace(/(\d{4})(?=\d)/g, '$1 ');
        this.value = numero;
    });

    // Máscara validade do cartão
    document.getElementById('validadeCartao').addEventListener('input', function() {
        let validade = this.value.replace(/\D/g, '');

        validade = validade.slice(0, 4);

        if (validade.length > 2) {
            validade = validade.replace(
                /(\d{2})(\d{0,2})/,
                '$1/$2'
            );
        }
        this.value = validade;
    });


    // Verificar validade do cartão
    document.getElementById('validadeCartao').addEventListener('input', function() {
        const validade = this.value;
        const mensagem = document.querySelector('.erroValidadeCartao');

        mensagem.textContent = '';

        if (validade.length === 5) {

            const partes = validade.split('/');
            const mes = parseInt(partes[0]);
            const ano = parseInt('20' + partes[1]);

            if (mes < 1 || mes > 12) {
                mensagem.textContent = 'Digite uma validade válida.';
            } else {

                const dataValidade = new Date(ano, mes - 1, 1); /* Menos 1 pq javascript começa com 0 o primeiro mês */
                const hoje = new Date();

                hoje.setHours(0, 0, 0, 0);

                if (dataValidade < hoje) {
                    mensagem.textContent = 'Cartão vencido.';
                }
            }
        }
    });

    // Não deixar entrar números ou caracteres especiais no nome
    document.getElementById('nome').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });

    // Não deixa entrar números ou caracteres especiais no nome do cartão
    document.getElementById('nomeCartao').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });

    // Validar senha enquanto digita
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');

    senha.addEventListener('input', function() {
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
        erroConfirmarSenha.textContent = '';

        if (this.value !== senha.value) {
            erroConfirmarSenha.textContent = 'As senhas não coincidem.';
        }
    });

    // Validar data de nascimento
    const dataNascimento = document.getElementById('dataNascimento');
    const erroDataNascimento = document.getElementById('erroDataNascimento');

    dataNascimento.addEventListener('change', function() {
        erroDataNascimento.textContent = '';

        if (this.value === '') {
            return;
        }

        const data = new Date(this.value + 'T00:00:00');
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        if (data > hoje) {
            erroDataNascimento.textContent = 'A data de nascimento não pode ser futura.';
        }
    });

    // Submit
    document.getElementById('formCadastroCliente').addEventListener('submit', function(event) {
        event.preventDefault();
        cadastrarCliente();
    });
});

// Cadastrar cliente
function cadastrarCliente() {
    let valido = true;

    document.querySelectorAll('.mensagem-erro').forEach(function(erro) {
        erro.textContent = '';
    });

    const toast = document.getElementById('toast');
    const toastMensagem = document.getElementById('toastMensagem');

    toastMensagem.textContent = 'Cliente cadastrado com sucesso!';
    toast.classList.add('ativo');

    setTimeout(function() {
        window.location.href = '/cliente/login';
    }, 2000);
}