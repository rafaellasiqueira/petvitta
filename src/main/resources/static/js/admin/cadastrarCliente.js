document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // MODO EDIÇÃO?
    // =========================================================

    const params = new URLSearchParams(window.location.search);
    const modoEdicao = params.get('editar') === 'true';

    const tituloPagina = document.getElementById('tituloPagina');
    const btnSalvar = document.getElementById('btnSalvarCliente');
    const codigoClienteInput = document.getElementById('codigoCliente');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const dicaSenhaEdicao = document.getElementById('dicaSenhaEdicao');


    const campos = {
        nome: document.getElementById('nome'),
        cpf: document.getElementById('cpf'),
        tipoTelefone: document.getElementById('tipoTelefone'),
        telefone: document.getElementById('telefone'),
        genero: document.getElementById('genero'),
        dataNascimento: document.getElementById('dataNascimento'),
        email: document.getElementById('email'),
        nomeIdentificacao: document.getElementById('nomeIdentificacao'),
        tipoEndereco: document.getElementById('tipoEndereco'),
        tipoResidencia: document.getElementById('tipoResidencia'),
        tipoLogradouro: document.getElementById('tipoLogradouro'),
        cep: document.getElementById('cep'),
        logradouro: document.getElementById('logradouro'),
        bairro: document.getElementById('bairro'),
        numero: document.getElementById('numero'),
        estado: document.getElementById('estado'),
        cidade: document.getElementById('cidade'),
        pais: document.getElementById('pais'),
        observacoes: document.getElementById('observacoes')
    };


    // =========================================================
    // PREENCHER FORMULÁRIO NO MODO EDIÇÃO
    //
    // OBS (BACKEND): isso aqui é só front. Numa versão real, o
    // ideal é o controller já devolver o cliente preenchido em
    // GET /admin/cadastrarCliente?codigo=CL-001 (Model/Thymeleaf),
    // em vez de depender do localStorage que a listagem preencheu.
    // =========================================================

    if (modoEdicao) {

        const dadosSalvos = localStorage.getItem('clienteParaEditar');

        if (dadosSalvos) {

            const cliente = JSON.parse(dadosSalvos);

            if (tituloPagina) tituloPagina.textContent = 'Editar cliente';
            if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
            if (codigoClienteInput) codigoClienteInput.value = cliente.codigo || '';

            Object.keys(campos).forEach((chave) => {

                if (campos[chave] && cliente[chave] !== undefined) {
                    campos[chave].value = cliente[chave];
                }
            });

            // Na edição a senha não é obrigatória
            if (senha) {
                senha.removeAttribute('required');
                senha.value = '';
                senha.placeholder = 'Deixe em branco para manter a senha atual';
            }

            if (confirmarSenha) {
                confirmarSenha.removeAttribute('required');
                confirmarSenha.value = '';
                confirmarSenha.placeholder = 'Deixe em branco para manter a senha atual';
            }

            if (dicaSenhaEdicao) {
                dicaSenhaEdicao.style.display = 'block';
            }
        }
    }


    // =========================================================
    // MOSTRAR / OCULTAR SENHA
    // =========================================================

    document.querySelectorAll('.btn-mostrar-senha').forEach((botao) => {

        botao.addEventListener('click', () => {

            const input = document.getElementById(botao.dataset.input);
            if (!input) return;

            const icone = botao.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icone?.classList.remove('fa-eye');
                icone?.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icone?.classList.remove('fa-eye-slash');
                icone?.classList.add('fa-eye');
            }
        });
    });


    // =========================================================
    // MÁSCARAS
    // =========================================================

    function aplicarMascara(input, formatador) {

        if (!input) return;

        input.addEventListener('input', () => {
            input.value = formatador(input.value);
        });
    }


    aplicarMascara(campos.cpf, (valor) => {

        valor = valor.replace(/\D/g, '').substring(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return valor;
    });


    aplicarMascara(campos.telefone, (valor) => {

        valor = valor.replace(/\D/g, '').substring(0, 11);

        if (valor.length > 10) {
            valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        } else {
            valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        }

        return valor.trim();
    });


    aplicarMascara(campos.cep, (valor) => {

        valor = valor.replace(/\D/g, '').substring(0, 8);

        if (valor.length > 5) {
            valor = valor.substring(0, 5) + '-' + valor.substring(5);
        }

        return valor;
    });


    // =========================================================
    // VALIDAÇÃO DE SENHA
    // =========================================================

    function senhasValidas() {

        const erroSenha = document.getElementById('erroSenha');
        const erroConfirmar = document.getElementById('erroConfirmarSenha');

        if (erroSenha) erroSenha.textContent = '';
        if (erroConfirmar) erroConfirmar.textContent = '';

        const valorSenha = senha?.value || '';
        const valorConfirmar = confirmarSenha?.value || '';

        // Na edição, deixar em branco = não trocar a senha
        if (modoEdicao && !valorSenha && !valorConfirmar) {
            return true;
        }

        const regraTamanho = valorSenha.length >= 8;
        const regraMaiuscula = /[A-Z]/.test(valorSenha);
        const regraMinuscula = /[a-z]/.test(valorSenha);
        const regraEspecial = /[^A-Za-z0-9]/.test(valorSenha);

        if (!regraTamanho || !regraMaiuscula || !regraMinuscula || !regraEspecial) {
            if (erroSenha) erroSenha.textContent = 'A senha não atende aos requisitos mínimos.';
            return false;
        }

        if (valorSenha !== valorConfirmar) {
            if (erroConfirmar) erroConfirmar.textContent = 'As senhas não coincidem.';
            return false;
        }

        return true;
    }


    // =========================================================
    // ENVIO DO FORMULÁRIO (SIMULADO)
    //
    // OBS (BACKEND): aqui só simula o sucesso. O envio real precisa
    // de um controller Spring: POST /admin/clientes para cadastro
    // e algo como POST/PUT /admin/clientes/{codigo} para edição,
    // com validação de CPF/e-mail duplicado consultando o banco
    // (JPA) e hash de senha (BCrypt) antes de salvar.
    // =========================================================

    const form = document.querySelector('.form-cadastrar-cliente');

    if (form) {

        form.addEventListener('submit', (event) => {

            event.preventDefault();

            if (!senhasValidas()) {
                return;
            }

            localStorage.removeItem('clienteParaEditar');

            alert(modoEdicao
                ? 'Cliente atualizado com sucesso! (simulado, ainda sem backend)'
                : 'Cliente cadastrado com sucesso! (simulado, ainda sem backend)');

            window.location.href = '/admin/clientes';
        });
    }

});