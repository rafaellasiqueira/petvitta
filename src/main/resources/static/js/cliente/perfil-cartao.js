document.addEventListener('DOMContentLoaded', function () {
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');
    const btnAdicionarCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    const campoSalvarPerfil = document.getElementById('campoSalvarCartao');

    const modalExclusao = document.getElementById('modalConfirmarExclusao');
    const formExcluir = document.getElementById('formExcluir');
    const idExcluir = document.getElementById('idExcluir');
    const mensagemExclusao = document.getElementById('mensagemModalExclusao');
    const btnFecharExclusao = document.getElementById('btnFecharModalExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');

    configurarCartao(modalCartao);

    if (campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }

    // Adicionar cartão
    btnAdicionarCartao.addEventListener('click', function () {
        formCartao.reset();

        modalCartao.querySelectorAll('.mensagem-erro').forEach(function (erro) {
            erro.textContent = '';
        });

        modalCartao.classList.add('active');
    });

    // Fechar modal do cartão
    btnFecharCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    btnCancelarCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    // Validar cartão
    formCartao.addEventListener('submit', function (event) {
        let formularioValido = true;

        const numero = modalCartao.querySelector('.numero-cartao');
        const nome = modalCartao.querySelector('.nome-cartao');
        const bandeira = modalCartao.querySelector('.bandeira-cartao');
        const cvv = modalCartao.querySelector('.cvv-cartao');

        const erroNumero = modalCartao.querySelector('.erroNumeroCartao');
        const erroNome = modalCartao.querySelector('.erroNomeCartao');
        const erroBandeira = modalCartao.querySelector('.erroBandeiraCartao');
        const erroCvv = modalCartao.querySelector('.erroCvvCartao');

        erroNumero.textContent = '';
        erroNome.textContent = '';
        erroBandeira.textContent = '';
        erroCvv.textContent = '';

        // Número
        if (numero.value.trim() === '') {
            formularioValido = false;
            erroNumero.textContent = 'Preencha o número do cartão.';
            numero.focus();

        } else if (!numeroValido(numero.value)) {
            formularioValido = false;
            erroNumero.textContent = 'Número do cartão inválido.';
            numero.focus();
        }

        // Nome
        if (nome.value.trim() === '') {
            formularioValido = false;
            erroNome.textContent = 'Preencha o nome impresso no cartão.';
            nome.focus();

        } else if (nome.value.trim().length < 3) {
            formularioValido = false;
            erroNome.textContent = 'O nome deve ter pelo menos 3 caracteres.';
            nome.focus();
        }

        // Bandeira
        if (bandeira.value === '') {
            formularioValido = false;
            erroBandeira.textContent = 'Selecione a bandeira do cartão.';
            bandeira.focus();
        }

        // CVV
        if (cvv.value.trim() === '') {
            formularioValido = false;
            erroCvv.textContent = 'Preencha o código de segurança.';
            cvv.focus();

        } else if (
            cvv.value.length < 3 ||
            cvv.value.length > 4
        ) {
            formularioValido = false;
            erroCvv.textContent = 'O CVV deve ter 3 ou 4 números.';
            cvv.focus();
        }

        if (!formularioValido) {
            event.preventDefault();
        }
    });

    // Excluir cartão
    document.querySelectorAll('.excluir-cartao').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const ultimosDigitos = this.dataset.numero.slice(-4);

            mensagemExclusao.textContent = 'Tem certeza que deseja excluir o cartão final ' + ultimosDigitos + '?';
            idExcluir.name = 'cartaoId';
            idExcluir.value = this.dataset.id;
            formExcluir.action = '/cliente/excluir-cartao';
            modalExclusao.classList.add('active');
        });
    });

    // Fechar modal de exclusão
    btnFecharExclusao.addEventListener('click', function () {
        modalExclusao.classList.remove('active');
    });

    btnCancelarExclusao.addEventListener('click', function () {
        modalExclusao.classList.remove('active');
    });
});
