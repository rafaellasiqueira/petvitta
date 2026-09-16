document.querySelectorAll('.btn-mostrar-senha').forEach(function (botao) {

    botao.addEventListener('click', function () {

        const campoSenha = this.closest('.senha-container');
        const input = campoSenha.querySelector('input');
        const icone = this.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';

            icone.classList.remove('fa-eye');
            icone.classList.add('fa-eye-slash');

        } else {
            input.type = 'password';

            icone.classList.remove('fa-eye-slash');
            icone.classList.add('fa-eye');
        }
    });

});