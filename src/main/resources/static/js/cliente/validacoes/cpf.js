document.addEventListener('DOMContentLoaded', () => {
    const inputCpf = document.getElementById('cpf');
    const erroCpf = document.getElementById('erroCpf');

    inputCpf.addEventListener('input', function () {
        let cpf = this.value.replace(/\D/g, '').slice(0, 11);

        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        this.value = cpf;

        if (cpf.length < 14) {
            erroCpf.textContent = 'Digite o CPF completo.';
        } else if (!cpfValido(cpf)) {
            erroCpf.textContent = 'Digite um CPF válido.';
        } else {
            erroCpf.textContent = '';
        }
    });
});

function cpfValido(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;
    let resultado = 11 - resto;

    if (resultado >= 10) {
        resultado = 0;
    }

    if (resultado !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;
    let resultado2 = 11 - resto;

    if (resultado2 >= 10) {
        resultado2 = 0;
    }

    return resultado2 === Number(cpf[10]);
}