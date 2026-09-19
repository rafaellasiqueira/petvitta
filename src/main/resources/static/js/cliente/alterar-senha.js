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

        let formularioValido = true;


        if (senhaAtual.value.trim() === '') {
            erroSenhaAtual.textContent = 'Digite sua senha atual.';
            senhaAtual.focus();

            formularioValido = false;
        }


        if (!validarSenha(novaSenha, erroNovaSenha)) {
            formularioValido = false;
        }


        if (!validarConfirmacaoSenha(
            novaSenha,
            confirmarSenha,
            erroConfirmarSenha
        )) {
            formularioValido = false;
        }


        if (!formularioValido) {
            e.preventDefault();
        }
    });

});