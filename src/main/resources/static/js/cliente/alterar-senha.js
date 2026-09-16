document.addEventListener('DOMContentLoaded', function () {

    // Campos
    const formSenha = document.getElementById('formAlterarSenha');

    const senhaAtual = document.getElementById('senhaAtual');
    const novaSenha = document.getElementById('novaSenha');
    const confirmarSenha = document.getElementById('confirmarSenha');

    const erroSenhaAtual = document.getElementById('erroSenhaAtual');
    const erroNovaSenha = document.getElementById('erroNovaSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');


    // Nova senha
    novaSenha.addEventListener('input', function () {
        validarSenha(novaSenha, erroNovaSenha);
    });


    // Confirmar senha
    confirmarSenha.addEventListener('input', function () {
        validarConfirmacaoSenha(
            novaSenha,
            confirmarSenha,
            erroConfirmarSenha
        );
    });


    // Enviar formulário
    formSenha.addEventListener('submit', function (e) {

        let valido = true;


        if (senhaAtual.value.trim() === '') {
            erroSenhaAtual.textContent =
                'Digite sua senha atual.';

            valido = false;
        }


        if (!validarSenha(novaSenha, erroNovaSenha)) {
            valido = false;
        }


        if (!validarConfirmacaoSenha(
            novaSenha,
            confirmarSenha,
            erroConfirmarSenha
        )) {
            valido = false;
        }


        if (!valido) {
            e.preventDefault();
        }
    });

});