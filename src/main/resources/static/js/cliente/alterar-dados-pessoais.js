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
            inputNome.focus();
            formularioValido = false;
        }

        // Telefone
        const inputTelefone = document.getElementById('telefone');
        const erroTelefone = document.getElementById('erroTelefone');

        if (inputTelefone.value.trim() === '') {
            erroTelefone.textContent = 'Preencha o telefone.';
            inputTelefone.focus();
            formularioValido = false;
        }

        const inputDataNascimento = document.getElementById('dataNascimento');
        const erroDataNascimento = document.getElementById('erroDataNascimento');

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

        if (!formularioValido) {
            event.preventDefault();
        }

    });
});