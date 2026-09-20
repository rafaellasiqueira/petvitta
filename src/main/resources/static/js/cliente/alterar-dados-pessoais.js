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
        const inputTipoTelefone = document.getElementById('tipoTelefone');
        const erroTelefone = document.getElementById('erroTelefone');
        const telefone = inputTelefone.value.replace(/\D/g, '');

        if (telefone === '') {
            erroTelefone.textContent = 'Preencha o telefone.';
            inputTelefone.focus();
            formularioValido = false;

        } else if (
            inputTipoTelefone.value === '2' &&
            telefone.length < 10
        ) {
            erroTelefone.textContent = 'Digite o telefone completo.';
            inputTelefone.focus();
            formularioValido = false;

        } else if (
            inputTipoTelefone.value !== '2' &&
            telefone.length < 11
        ) {
            erroTelefone.textContent = 'Digite o telefone completo.';
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