function configurarCartao(cartao) {

    const numero = cartao.querySelector('.numero-cartao');
    const nome = cartao.querySelector('.nome-cartao');
    const bandeira = cartao.querySelector('.bandeira-cartao');
    const cvv = cartao.querySelector('.cvv-cartao');

    const erroNumero = cartao.querySelector('.erroNumeroCartao');
    const erroNome = cartao.querySelector('.erroNomeCartao');
    const erroCvv = cartao.querySelector('.erroCvvCartao');

    // Nome
    nome.addEventListener('input', function () {

        nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        if (nome.value.trim().length > 0 &&
            nome.value.trim().length < 3) {

            erroNome.textContent =
                'O nome deve ter pelo menos 3 caracteres.';

        } else {
            erroNome.textContent = '';
        }
    });

    // Número
    numero.addEventListener('input', function () {

        let valor = numero.value
            .replace(/\D/g, '')
            .slice(0, 16);

        if (valor.length > 4) {
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        }

        numero.value = valor;

        if (valor.replace(/\D/g, '').length > 0 &&
            !numeroValido(valor)) {

            erroNumero.textContent =
                'Número do cartão inválido.';

        } else {
            erroNumero.textContent = '';
        }
    });

    // CVV
    cvv.addEventListener('input', function () {

        cvv.value = cvv.value
            .replace(/\D/g, '')
            .slice(0, 4);

        if (cvv.value.length > 0 &&
            cvv.value.length < 3) {

            erroCvv.textContent =
                'O CVV deve ter 3 ou 4 números.';

        } else {
            erroCvv.textContent = '';
        }
    });
}

function numeroValido(numero) {
    numero = numero.replace(/\D/g, '');

    if (numero.length !== 16) {
        return false;
    }

    let soma = 0;
    let dobro = false;

    for (let i = numero.length - 1; i >= 0; i--) {
        let digito = Number(numero[i]);

        if (dobro) {
            digito *= 2;

            if (digito > 9) {
                digito -= 9;
            }
        }

        soma += digito;
        dobro = !dobro;
    }

    return soma % 10 === 0;
}
