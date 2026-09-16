document.addEventListener('DOMContentLoaded', function() {

    // Dados pessoais
    const form = document.getElementById('formDadosPessoais');

    // Impedir envio se houver erro
    form.addEventListener('submit', function (event) {
        let formularioValido = true;

        // Nome
        const inputNome = document.getElementById('nome');
        const erroNome = document.getElementById('erroNome');

        if (inputNome.value.trim() === '') {
            erroNome.textContent = 'Preencha o nome.';
            formularioValido = false;
        }

        // Telefone
        const inputTelefone = document.getElementById('telefone');
        const erroTelefone = document.getElementById('erroTelefone');

        if (inputTelefone.value.trim() === '') {
            erroTelefone.textContent = 'Preencha o telefone.';
            formularioValido = false;
        }

        if (!formularioValido) {
            event.preventDefault();
        }

    });
});