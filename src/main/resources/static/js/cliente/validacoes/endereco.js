function configurarEndereco(endereco) {
    const nomeIdentificacao = endereco.querySelector('.nome-identificacao');
    const erroNomeIdentificacao = endereco.querySelector('.erroNomeIdentificacao');
    const cep = endereco.querySelector('.cep');
    const erroCep = endereco.querySelector('.erroCep');
    const numero = endereco.querySelector('.numero');

    // Nome de identificação
    nomeIdentificacao.addEventListener('input', function () {
        nomeIdentificacao.value = nomeIdentificacao.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

        if (nomeIdentificacao.value.trim().length < 3) {
            erroNomeIdentificacao.textContent =
                'Digite um nome com pelo menos 3 caracteres.';
        } else if (nomeIdentificacao.value.trim().length > 20) {
            erroNomeIdentificacao.textContent =
                'Digite um nome com no máximo 20 caracteres.';
        }
    });

    // CEP
    cep.addEventListener('input', function () {
        let valor = cep.value.replace(/\D/g, '').slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        cep.value = valor;
        erroCep.textContent = '';

        if (valor.replace(/\D/g, '').length === 8) {
            buscarCep(valor, endereco);
        } else {
            erroCep.textContent = 'Digite um CEP válido.';
        }
    });

    // Número
    numero.addEventListener('input', function () {
        numero.value = numero.value.replace(/\D/g, '');
    });
}

function buscarCep(valorCep, endereco) {
    const cepNumeros = valorCep.replace(/\D/g, '');

    fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then(response => response.json())
        .then(dados => {
            const erroCep = endereco.querySelector('.erroCep');

            if (dados.erro) {
                erroCep.textContent = 'CEP não encontrado.';
                return;
            }

            erroCep.textContent = '';

            endereco.querySelector('.logradouro').value =
                dados.logradouro || '';

            endereco.querySelector('.bairro').value =
                dados.bairro || '';

            endereco.querySelector('.cidade').value =
                dados.localidade || '';

            const estado = endereco.querySelector('.estado');

            for (let i = 0; i < estado.options.length; i++) {
                if (estado.options[i].textContent.startsWith(dados.uf)) {
                    estado.value = estado.options[i].value;
                    break;
                }
            }
        })
        .catch(() => {
            endereco.querySelector('.erroCep').textContent =
                'Não foi possível consultar o CEP.';
        });
}

