document.addEventListener('DOMContentLoaded', function () {
    const tipoTelefone = document.getElementById('tipoTelefone');
    const telefone = document.getElementById('telefone');

    // Mostrar / ocultar senha
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

    // CPF
    document.getElementById('cpf').addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 11);

        if (valor.length > 9) {
            valor = valor.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            );
        } else if (valor.length > 6) {
            valor = valor.replace(
                /(\d{3})(\d{3})(\d{1,3})/,
                '$1.$2.$3'
            );
        } else if (valor.length > 3) {
            valor = valor.replace(
                /(\d{3})(\d{1,3})/,
                '$1.$2'
            );
        }

        this.value = valor;
    });

    // Telefone
    telefone.addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '');
        const tipo = tipoTelefone.value;

        if (tipo === 'fixo') {
            valor = valor.slice(0, 10);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        } else {
            valor = valor.slice(0, 11);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        }

        this.value = valor;
    });

    // Mudar placeholder do telefone
    tipoTelefone.addEventListener('change', function() {
        if (this.value === 'fixo') {
            telefone.placeholder = '(00) 0000-0000';
        } else {
            telefone.placeholder = '(00) 00000-0000';
        }
    });

    // CEP
    configurarCEP();

    // Número do endereço
    configurarNumero();

    // Cartão
    configurarCartao(document.querySelector('.cartao-item'));

    // Adicionar endereço
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');

    if (btnAdicionarEndereco) {
        btnAdicionarEndereco.addEventListener('click',
            adicionarEndereco
        );
    }

    // Adicionar cartão
    const btnAdicionarCartao = document.getElementById('btnAdicionarCartao');

    if (btnAdicionarCartao) {
        btnAdicionarCartao.addEventListener('click',
            adicionarCartao
        );
    }
});

// Adicionar endereço
function adicionarEndereco() {
    const lista = document.getElementById('listaEnderecos');
    const original = lista.querySelector('.endereco-item');
    const novo = original.cloneNode(true);

    novo.querySelectorAll('input, select, textarea').forEach(function(campo) {
        if  (campo.name === 'pais') {
            campo.value = 'Brasil';
        } else {
            campo.value = '';
        }

    });

    const botaoRemover = novo.querySelector('.btn-remover-item');

    if (botaoRemover) {
        botaoRemover.style.display = 'flex';
    }

    lista.appendChild(novo);
    configurarCEP();
    configurarNumero();
}

// Remover endereço
function removerEndereco(botao) {
    const lista = document.getElementById('listaEnderecos');
    const endereco = botao.closest('.endereco-item');
    const quantidade = lista.querySelectorAll('.endereco-item').length;

    if (quantidade <= 1) {
        return;
    }
    endereco.remove();
}

// Máscara CEP
function configurarCEP() {
    document.querySelectorAll('input[name="cep"]').forEach(function(cep) {
        if (cep.dataset.configurado === 'true') {
            return;
        }
        cep.dataset.configurado = 'true';
        cep.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, '').slice(0, 8);
            if (valor.length > 5) {
                valor = valor.replace(
                    /(\d{5})(\d)/,
                    '$1-$2'
                );
            }
            this.value = valor;
        });
    });
}

// Número do endereço
function configurarNumero() {
    document.querySelectorAll('input[name="numero"]').forEach(function(numero) {
        if (numero.dataset.configurado === 'true') {
            return;
        }
        numero.dataset.configurado = 'true';
        numero.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    });
}

// Adicionar cartão
function adicionarCartao() {
    const lista = document.getElementById('listaCartoes');
    const original = lista.querySelector('.cartao-item');
    const novo = original.cloneNode(true);
    novo.querySelectorAll('input, select').forEach(function(campo) {

        if (campo.type === 'radio') {
            campo.checked = false;
        } else {
            campo.value = '';
        }

    });

    const botaoRemover = novo.querySelector('.btn-remover-item');

    if (botaoRemover) {
        botaoRemover.style.display = 'flex';
    }

    lista.appendChild(novo);
    configurarCartao(novo);
}

// Remover o cartão
function removerCartao(botao) {
    const lista = document.getElementById('listaCartoes');
    const cartao = botao.closest('.cartao-item');
    const quantidade = lista.querySelectorAll('.cartao-item').length;

    if (quantidade <= 1) {
        return;
    }

    cartao.remove();
}

// Máscara do cartão
function configurarCartao(cartao) {
    if (!cartao) {
        return;
    }

    const numero = cartao.querySelector('input[name="numeroCartao"]');
    const cvv = cartao.querySelector('input[name="cvvCartao"]');
    const validade = cartao.querySelector('input[name="validadeCartao"]');

    // Número do cartão
    if (numero) {
        numero.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 16);

            if (valor.length > 12) {
                valor = valor.replace(
                    /(\d{4})(\d{4})(\d{4})(\d{1,4})/,
                    '$1 $2 $3 $4'
                );
            } else if (valor.length > 8) {
                valor = valor.replace(
                    /(\d{4})(\d{4})(\d{1,4})/,
                    '$1 $2 $3'
                );
            } else if (valor.length > 4) {
                valor = valor.replace(
                    /(\d{4})(\d{1,4})/,
                    '$1 $2'
                );
            }

            this.value = valor;
        });
    }

    // CVV
    if (cvv) {
        cvv.addEventListener('input', function () {
            this.value =this.value
                    .replace(/\D/g, '')
                    .slice(0, 4);
        });
    }

    // Validade
    if (validade) {
        validade.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 4);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{1,2})/,
                    '$1/$2'
                );
            }

            this.value = valor;
        });
    }
}

// Cadastrar cliente
function cadastrarCliente() {
    let valido = true;

    // Limpa as mensagens
    document.querySelectorAll('.mensagem-erro').forEach(function(erro) {
        erro.textContent = '';
    });

    // Cartões
    document.querySelectorAll('.cartao-item').forEach(function(cartao) {

        const numero = cartao.querySelector('input[name="numeroCartao"]');
        const cvv = cartao.querySelector('input[name="cvvCartao"]');
        const validade = cartao.querySelector('input[name="validadeCartao"]');

        const erroNumero = cartao.querySelector('.erroNumeroCartao');
        const erroCvv = cartao.querySelector('.erroCvvCartao');
        const erroValidade = cartao.querySelector('.erroValidadeCartao');

        if (numero.value.replace(/\D/g, '').length !== 16) {
            erroNumero.textContent = 'Digite o número completo do cartão.';
            valido = false;
        }

        if (cvv.value.replace(/\D/g, '').length < 3) {
            erroCvv.textContent = 'Digite um CVV válido.';
            valido = false;
        }

        const valorValidade = validade.value.replace(/\D/g, '');

        if (valorValidade.length !== 4) {

            erroValidade.textContent = 'Digite a validade no formato MM/AA.';
            valido = false;

        } else {

            const mes = parseInt(valorValidade.substring(0, 2));
            const ano = parseInt(valorValidade.substring(2, 4));

            const hoje = new Date();
            const anoAtual = parseInt(
                hoje.getFullYear().toString().slice(-2)
            );
            const mesAtual = hoje.getMonth() + 1;

            if (
                mes < 1 ||
                mes > 12 ||
                ano < anoAtual ||
                (ano === anoAtual && mes < mesAtual)
            ) {
                erroValidade.textContent = 'Digite uma validade válida.';
                valido = false;
            }
        }
    });

    // Nome
    if (document.getElementById('nome').value.trim() === '') {
        document.getElementById('erroNome').textContent =
            'Digite o nome do cliente.';

        valido = false;
    }

    // CPF
    if (document.getElementById('cpf').value.trim() === '') {
        document.getElementById('erroCpf').textContent =
            'Digite o CPF.';

        valido = false;
    }

    // Tipo telefone
    if (document.getElementById('tipoTelefone').value === '') {
        document.getElementById('erroTipoTelefone').textContent =
            'Selecione o tipo de telefone.';

        valido = false;
    }

    // Telefone
    if (document.getElementById('telefone').value.trim() === '') {
        document.getElementById('erroTelefone').textContent =
            'Digite o telefone.';

        valido = false;
    }

    // Gênero
    if (document.getElementById('genero').value === '') {
        document.getElementById('erroGenero').textContent =
            'Selecione o gênero.';
        valido = false;
    }

    // Data de nascimento
    const dataNascimento =
        document.getElementById('dataNascimento');
    if (dataNascimento.value === '') {

        document.getElementById('erroDataNascimento').textContent =
            'Informe a data de nascimento.';

        valido = false;

    } else {
        const data =
            new Date(dataNascimento.value + 'T00:00:00');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (data > hoje) {
            document.getElementById('erroDataNascimento').textContent =
                'A data de nascimento não pode ser futura.';
            valido = false;
        }
    }

    // E-mail
    if (document.getElementById('email').value.trim() === '') {
        document.getElementById('erroEmail').textContent =
            'Digite o e-mail.';
        valido = false;
    }

    // Senha
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmar = document.getElementById('erroConfirmarSenha');

    if (senha === '') {
        erroSenha.textContent =
            'Digite uma senha.';

        valido = false;

    } else if (senha.length < 8) {
        erroSenha.textContent =
            'A senha deve ter pelo menos 8 caracteres.';

        valido = false;

    } else if (!/[A-Z]/.test(senha)) {
        erroSenha.textContent =
            'A senha deve ter pelo menos uma letra maiúscula.';

        valido = false;

    } else if (!/[a-z]/.test(senha)) {
        erroSenha.textContent =
            'A senha deve ter pelo menos uma letra minúscula.';

        valido = false;

    } else if (!/[^A-Za-z0-9]/.test(senha)) {
        erroSenha.textContent =
            'A senha deve ter pelo menos um caractere especial.';

        valido = false;
    }

    if (confirmarSenha === '') {
        erroConfirmar.textContent =
            'Confirme a senha.';

        valido = false;

    } else if (senha !== confirmarSenha) {
        erroConfirmar.textContent =
            'As senhas não coincidem.';

        valido = false;
    }

    // Se tiver algum erro
    if (!valido) {
        return;
    }

    // Mostra o toast
    const toast = document.getElementById('toast');
    const toastMensagem = document.getElementById('toastMensagem');

    toastMensagem.textContent = 'Cliente cadastrado com sucesso!';
    toast.classList.add('ativo');

    // Vai para a página de clientes
    setTimeout(function() {
        window.location.href = '/admin/clientes';
    }, 2000);
}