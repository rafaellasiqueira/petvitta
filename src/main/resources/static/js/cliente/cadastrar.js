document.addEventListener('DOMContentLoaded', function () {


    // =====================================================
    // MOSTRAR E OCULTAR SENHA
    // =====================================================

    document.querySelectorAll('.btn-mostrar-senha').forEach(function (botao) {

        botao.addEventListener('click', function () {

            const senha =
                document.getElementById(botao.dataset.input);

            const icone =
                botao.querySelector('i');


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


    // =====================================================
    // CPF
    // =====================================================

    document.getElementById('cpf').addEventListener('input', function () {

        let valor =
            this.value
                .replace(/\D/g, '')
                .slice(0, 11);


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


    // =====================================================
    // TELEFONE
    // =====================================================

    document.getElementById('telefone').addEventListener('input', function () {

        let telefone =
            this.value.replace(/\D/g, '');

        const tipo =
            document.getElementById('tipoTelefone').value;


        if (tipo === 'fixo') {

            telefone =
                telefone.slice(0, 10);


            if (telefone.length > 2) {

                telefone = telefone.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );

            }

        } else {

            telefone =
                telefone.slice(0, 11);


            if (telefone.length > 2) {

                telefone = telefone.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    '($1) $2-$3'
                );

            }

        }


        this.value = telefone;

    });


    // =====================================================
    // MUDAR PLACEHOLDER DO TELEFONE
    // =====================================================

    document.getElementById('tipoTelefone').addEventListener('change', function () {

        const telefone =
            document.getElementById('telefone');


        if (this.value === 'fixo') {

            telefone.placeholder =
                '(00) 0000-0000';

        } else {

            telefone.placeholder =
                '(00) 00000-0000';

        }

    });


    // =====================================================
    // DATA DE NASCIMENTO
    // =====================================================

    const dataNascimento =
        document.getElementById('dataNascimento');

    const erroDataNascimento =
        document.getElementById('erroDataNascimento');


    dataNascimento.addEventListener('change', function () {

        erroDataNascimento.textContent = '';


        if (this.value === '') {
            return;
        }


        const data =
            new Date(this.value + 'T00:00:00');

        const hoje =
            new Date();


        hoje.setHours(0, 0, 0, 0);


        if (data > hoje) {

            erroDataNascimento.textContent =
                'A data de nascimento não pode ser futura.';

        }

    });


    // =====================================================
    // NOME
    // =====================================================

    document.getElementById('nome').addEventListener('input', function () {

        this.value =
            this.value.replace(
                /[^A-Za-zÀ-ÿ\s]/g,
                ''
            );

    });


    // =====================================================
    // SENHA
    // =====================================================

    const senha =
        document.getElementById('senha');

    const confirmarSenha =
        document.getElementById('confirmarSenha');

    const erroSenha =
        document.getElementById('erroSenha');

    const erroConfirmarSenha =
        document.getElementById('erroConfirmarSenha');


    senha.addEventListener('input', function () {

        erroSenha.textContent = '';


        if (this.value.length < 8) {

            erroSenha.textContent =
                'A senha deve ter pelo menos 8 caracteres.';

        } else if (!/[A-Z]/.test(this.value)) {

            erroSenha.textContent =
                'A senha deve ter pelo menos uma letra maiúscula.';

        } else if (!/[a-z]/.test(this.value)) {

            erroSenha.textContent =
                'A senha deve ter pelo menos uma letra minúscula.';

        } else if (!/[^A-Za-z0-9]/.test(this.value)) {

            erroSenha.textContent =
                'A senha deve ter pelo menos um caractere especial.';

        }

    });


    confirmarSenha.addEventListener('input', function () {

        erroConfirmarSenha.textContent = '';


        if (this.value !== senha.value) {

            erroConfirmarSenha.textContent =
                'As senhas não coincidem.';

        }

    });


    // =====================================================
    // ADICIONAR ENDEREÇO
    // =====================================================

    const listaEnderecos =
        document.getElementById('listaEnderecos');

    const btnAdicionarEndereco =
        document.getElementById('btnAdicionarEndereco');


    btnAdicionarEndereco.addEventListener('click', function () {

        // Pega o primeiro endereço
        const endereco =
            listaEnderecos.querySelector('.item-endereco');


        // Faz uma cópia dele
        const novoEndereco =
            endereco.cloneNode(true);


        // Limpa os inputs
        novoEndereco.querySelectorAll('input').forEach(function (input) {

            input.value = '';

        });


        // Limpa os selects
        novoEndereco.querySelectorAll('select').forEach(function (select) {

            select.selectedIndex = 0;

        });


        // Limpa textarea
        novoEndereco.querySelectorAll('textarea').forEach(function (textarea) {

            textarea.value = '';

        });


        // Número do endereço
        const quantidade =
            listaEnderecos.querySelectorAll('.item-endereco').length + 1;


        novoEndereco.querySelector('h2').textContent =
            'Endereço ' + quantidade;


        // Adiciona o novo endereço
        listaEnderecos.appendChild(novoEndereco);

    });


    // =====================================================
    // ADICIONAR CARTÃO
    // =====================================================

    const listaCartoes =
        document.getElementById('listaCartoes');

    const btnAdicionarCartao =
        document.getElementById('btnAdicionarCartao');


    btnAdicionarCartao.addEventListener('click', function () {

        // Pega o primeiro cartão
        const cartao =
            listaCartoes.querySelector('.item-cartao');


        // Faz uma cópia
        const novoCartao =
            cartao.cloneNode(true);


        // Limpa os inputs
        novoCartao.querySelectorAll('input').forEach(function (input) {

            input.value = '';

        });


        // Limpa os selects
        novoCartao.querySelectorAll('select').forEach(function (select) {

            select.selectedIndex = 0;

        });


        // Número do cartão
        const quantidade =
            listaCartoes.querySelectorAll('.item-cartao').length + 1;


        novoCartao.querySelector('h2').textContent =
            'Cartão ' + quantidade;


        // Adiciona o cartão
        listaCartoes.appendChild(novoCartao);

    });


    // =====================================================
    // REMOVER ENDEREÇO OU CARTÃO
    // =====================================================

    document.addEventListener('click', function (event) {

        const botao =
            event.target.closest('.btn-remover-item');


        if (!botao) {
            return;
        }


        const item =
            botao.closest('.item-endereco, .item-cartao');


        if (!item) {
            return;
        }


        const lista =
            item.parentElement;


        // Não permite remover o último
        if (lista.children.length > 1) {

            item.remove();

        }

    });


    // =====================================================
    // MÁSCARAS DOS ENDEREÇOS
    // =====================================================

    document.addEventListener('input', function (event) {


        // -------------------------
        // CEP
        // -------------------------

        if (event.target.classList.contains('cep')) {

            let valor =
                event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 8);


            if (valor.length > 5) {

                valor = valor.replace(
                    /(\d{5})(\d)/,
                    '$1-$2'
                );

            }


            event.target.value = valor;

        }


        // -------------------------
        // NÚMERO DO ENDEREÇO
        // -------------------------

        if (event.target.classList.contains('numero-endereco')) {

            event.target.value =
                event.target.value.replace(
                    /\D/g,
                    ''
                );

        }


        // -------------------------
        // NÚMERO DO CARTÃO
        // -------------------------

        if (event.target.classList.contains('numero-cartao')) {

            let numero =
                event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 16);


            numero =
                numero.replace(
                    /(\d{4})(?=\d)/g,
                    '$1 '
                );


            event.target.value =
                numero;


            const mensagem =
                event.target
                    .closest('.campo-grupo')
                    .querySelector('.erroNumeroCartao');


            if (numero.replace(/\D/g, '').length !== 16) {

                mensagem.textContent =
                    'Digite o número completo do cartão.';

            } else {

                mensagem.textContent =
                    '';

            }

        }


        // -------------------------
        // CVV
        // -------------------------

        if (event.target.classList.contains('cvv-cartao')) {

            event.target.value =
                event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 4);

        }


        // -------------------------
        // NOME DO CARTÃO
        // -------------------------

        if (event.target.classList.contains('nome-cartao')) {

            event.target.value =
                event.target.value.replace(
                    /[^A-Za-zÀ-ÿ\s]/g,
                    ''
                );

        }


        // -------------------------
        // VALIDADE
        // -------------------------

        if (event.target.classList.contains('validade-cartao')) {

            let validade =
                event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 4);


            if (validade.length > 2) {

                validade =
                    validade.replace(
                        /(\d{2})(\d{0,2})/,
                        '$1/$2'
                    );

            }


            event.target.value =
                validade;


            // Verificar validade
            const mensagem =
                event.target
                    .closest('.campo-grupo')
                    .querySelector('.erroValidadeCartao');


            mensagem.textContent = '';


            if (validade.length === 5) {

                const partes =
                    validade.split('/');


                const mes =
                    parseInt(partes[0]);


                const ano =
                    parseInt('20' + partes[1]);


                if (mes < 1 || mes > 12) {

                    mensagem.textContent =
                        'Digite uma validade válida.';

                } else {

                    const dataValidade =
                        new Date(
                            ano,
                            mes - 1,
                            1
                        );


                    const hoje =
                        new Date();


                    hoje.setHours(0, 0, 0, 0);


                    if (dataValidade < hoje) {

                        mensagem.textContent =
                            'Cartão vencido.';

                    }

                }

            }

        }

    });


    // =====================================================
    // SUBMIT
    // =====================================================

    document
        .getElementById('formCadastroCliente')
        .addEventListener('submit', function (event) {

            event.preventDefault();

            cadastrarCliente();

        });

});


// =====================================================
// CADASTRAR CLIENTE
// =====================================================

function cadastrarCliente() {

    let valido = true;


    // Limpar mensagens
    document
        .querySelectorAll('.mensagem-erro')
        .forEach(function (erro) {

            erro.textContent = '';

        });


    const toast =
        document.getElementById('toast');

    const toastMensagem =
        document.getElementById('toastMensagem');


    toastMensagem.textContent =
        'Cliente cadastrado com sucesso!';


    toast.classList.add('ativo');


    setTimeout(function () {

        window.location.href =
            '/cliente/login';

    }, 2000);

}