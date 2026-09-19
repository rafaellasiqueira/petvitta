document.addEventListener('DOMContentLoaded', () => {

    // Nome
    const inputNome = document.getElementById('nome');
    const erroNome = document.getElementById('erroNome');

    inputNome.addEventListener('input', function () {
        inputNome.value = inputNome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        if (inputNome.value.trim().length < 3) {
            erroNome.textContent = 'Digite um nome com pelo menos 3 caracteres.';
            inputNome.focus();
        } else {
            erroNome.textContent = '';
        }
    });

    // Telefone
    const inputTelefone = document.getElementById('telefone');
    const erroTelefone = document.getElementById('erroTelefone');
    const tipoTelefone = document.getElementById('tipoTelefone');

    inputTelefone.addEventListener('input', function () {
        let telefone = inputTelefone.value.replace(/\D/g, '');
        const tipo = tipoTelefone.value;

        if (tipo === '2') {
            telefone = telefone.slice(0, 10);

            if (telefone.length > 2) {
                telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            }
        } else {
            telefone = telefone.slice(0, 11);

            if (telefone.length > 2) {
                telefone = telefone.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }

        inputTelefone.value = telefone;

        if (telefone.replace(/\D/g, '').length < 10) {
            erroTelefone.textContent = 'Digite o telefone completo.';
            inputTelefone.focus();
        } else {
            erroTelefone.textContent = '';
        }
    });

    tipoTelefone.addEventListener('change', function () {
        inputTelefone.value = '';
        erroTelefone.textContent = '';

        if (tipoTelefone.value === '2') {
            inputTelefone.placeholder = '(00) 0000-0000';
        } else {
            inputTelefone.placeholder = '(00) 00000-0000';
        }
    });

    // Data de nascimento
    const inputDataNascimento = document.getElementById('dataNascimento');
    const erroDataNascimento = document.getElementById('erroDataNascimento');

    inputDataNascimento.addEventListener('input', function () {
        const data = new Date(inputDataNascimento.value);
        const hoje = new Date();

        if (inputDataNascimento.value.split('-')[0].length !== 4) {
            erroDataNascimento.textContent = 'Digite um ano com 4 dígitos.';
            inputDataNascimento.focus();
        } else if (data > hoje) {
            erroDataNascimento.textContent = 'A data não pode ser futura.';
            inputDataNascimento.focus();
        } else {
            erroDataNascimento.textContent = '';
        }
    });
});

function validarSenha(senha, erroSenha) {
    erroSenha.textContent = '';

    if (senha.value.length < 8) {
        erroSenha.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        senha.focus();
        return false;
    }

    if (!/[A-Z]/.test(senha.value)) {
        erroSenha.textContent = 'A senha deve ter pelo menos uma letra maiúscula.';
        senha.focus();
        return false;
    }

    if (!/[a-z]/.test(senha.value)) {
        erroSenha.textContent = 'A senha deve ter pelo menos uma letra minúscula.';
        senha.focus();
        return false;
    }

    if (!/[^A-Za-z0-9]/.test(senha.value)) {
        erroSenha.textContent = 'A senha deve ter pelo menos um caractere especial.';
        senha.focus();
        return false;
    }
    return true;
}


function validarConfirmacaoSenha(senha, confirmarSenha, erroConfirmarSenha) {
    if (confirmarSenha.value !== senha.value) {
        erroConfirmarSenha.textContent = 'As senhas não coincidem.';
        confirmarSenha.focus();
        return false;
    }

    erroConfirmarSenha.textContent = '';
    return true;
}