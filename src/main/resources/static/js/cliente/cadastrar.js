document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       CONFIGURAÇÕES
    ====================================================== */

    const form = document.getElementById('formCadastroCliente');

    const listaEnderecos =
        document.getElementById('listaEnderecos');

    const listaCartoes =
        document.getElementById('listaCartoes');

    const btnAdicionarEndereco =
        document.getElementById('btnAdicionarEndereco');

    const btnAdicionarCartao =
        document.getElementById('btnAdicionarCartao');


    /* =====================================================
       MOSTRAR / OCULTAR SENHA
    ====================================================== */

    document.querySelectorAll('.btn-mostrar-senha')
        .forEach(function (botao) {

            botao.addEventListener('click', function () {

                const idInput = botao.dataset.input;

                const senha =
                    document.getElementById(idInput);

                const icone =
                    botao.querySelector('i');


                if (senha.type === 'password') {

                    senha.type = 'text';

                    icone.classList.remove('fa-eye');

                    icone.classList.add('fa-eye-slash');

                } else {

                    senha.type = 'password';

                    icone.classList.remove('fa-eye-slash');

                    icone.classList.add('fa-eye');

                }

            });

        });


    /* =====================================================
       MÁSCARA CPF
    ====================================================== */

    const cpf = document.getElementById('cpf');

    if (cpf) {

        cpf.addEventListener('input', function () {

            let valor =
                this.value.replace(/\D/g, '');

            valor =
                valor.substring(0, 11);

            valor =
                valor.replace(
                    /(\d{3})(\d)/,
                    '$1.$2'
                );

            valor =
                valor.replace(
                    /(\d{3})(\d)/,
                    '$1.$2'
                );

            valor =
                valor.replace(
                    /(\d{3})(\d{1,2})$/,
                    '$1-$2'
                );

            this.value = valor;

        });

    }


    /* =====================================================
       MÁSCARA TELEFONE
    ====================================================== */

    const telefone =
        document.getElementById('telefone');

    const tipoTelefone =
        document.getElementById('tipoTelefone');


    if (telefone) {

        telefone.addEventListener('input', function () {

            let valor =
                this.value.replace(/\D/g, '');

            const tipo =
                tipoTelefone.value;


            if (tipo === 'fixo') {

                /* Fixo: (00) 0000-0000 */

                valor =
                    valor.substring(0, 10);

                if (valor.length > 2) {

                    valor =
                        valor.replace(
                            /(\d{2})(\d{4})(\d{0,4})/,
                            '($1) $2-$3'
                        );

                }

            } else {

                /* Celular: (00) 00000-0000 */

                valor =
                    valor.substring(0, 11);

                if (valor.length > 2) {

                    valor =
                        valor.replace(
                            /(\d{2})(\d{5})(\d{0,4})/,
                            '($1) $2-$3'
                        );

                }

            }

            this.value = valor;

        });

    }


    /* =====================================================
       ALTERAR PLACEHOLDER DO TELEFONE
    ====================================================== */

    if (tipoTelefone) {

        tipoTelefone.addEventListener('change', function () {

            if (this.value === 'fixo') {

                telefone.placeholder =
                    '(00) 0000-0000';

            } else {

                telefone.placeholder =
                    '(00) 00000-0000';

            }

            telefone.value = '';

        });

    }


    /* =====================================================
       CEP
    ====================================================== */

    document.addEventListener('input', function (event) {

        if (
            event.target.matches(
                'input[name="cep"]'
            )
        ) {

            mascararCEP(event.target);

        }

    });


    /* =====================================================
       VIA CEP
    ====================================================== */

    document.addEventListener('blur', function (event) {

        if (
            event.target.matches(
                'input[name="cep"]'
            )
        ) {

            buscarCEP(event.target);

        }

    }, true);


    /* =====================================================
       ADICIONAR ENDEREÇO
    ====================================================== */

    if (btnAdicionarEndereco) {

        btnAdicionarEndereco.addEventListener(
            'click',
            function () {

                adicionarEndereco();

            }
        );

    }


    /* =====================================================
       ADICIONAR CARTÃO
    ====================================================== */

    if (btnAdicionarCartao) {

        btnAdicionarCartao.addEventListener(
            'click',
            function () {

                adicionarCartao();

            }
        );

    }


    /* =====================================================
       MÁSCARAS DOS CARTÕES
    ====================================================== */

    document.addEventListener('input', function (event) {

        /* Número do cartão */

        if (
            event.target.matches(
                'input[name="numeroCartao"]'
            )
        ) {

            mascararNumeroCartao(
                event.target
            );

        }


        /* CVV */

        if (
            event.target.matches(
                'input[name="cvvCartao"]'
            )
        ) {

            event.target.value =
                event.target.value
                    .replace(/\D/g, '')
                    .substring(0, 4);

        }


        /* Validade */

        if (
            event.target.matches(
                'input[name="validadeCartao"]'
            )
        ) {

            mascararValidade(
                event.target
            );

        }

    });


    /* =====================================================
       DETECTAR BANDEIRA DO CARTÃO
    ====================================================== */

    document.addEventListener('input', function (event) {

        if (
            event.target.matches(
                'input[name="numeroCartao"]'
            )
        ) {

            const cartao =
                event.target.closest('.cartao-item');

            detectarBandeira(cartao);

        }

    });


    /* =====================================================
       RADIO PREFERENCIAL

       Permite clicar novamente no selecionado
       para desmarcá-lo.
    ====================================================== */

    document.addEventListener('click', function (event) {

        if (
            !event.target.matches(
                'input[type="radio"][data-toggle-preferencial]'
            )
        ) {
            return;
        }


        const radio =
            event.target;


        if (radio.dataset.selecionado === 'true') {

            radio.checked = false;

            radio.dataset.selecionado = 'false';

        } else {

            radio.dataset.selecionado = 'true';

            const nome =
                radio.name;


            document.querySelectorAll(
                `input[type="radio"][name="${nome}"]`
            ).forEach(function (outroRadio) {

                if (outroRadio !== radio) {

                    outroRadio.dataset.selecionado =
                        'false';

                }

            });

        }

    });


    /* =====================================================
       ALTERAÇÃO DE RADIO POR TECLADO / OUTROS EVENTOS
    ====================================================== */

    document.addEventListener('change', function (event) {

        if (
            !event.target.matches(
                'input[type="radio"][data-toggle-preferencial]'
            )
        ) {
            return;
        }

        const radio =
            event.target;

        if (radio.checked) {

            radio.dataset.selecionado =
                'true';

            document.querySelectorAll(
                `input[type="radio"][name="${radio.name}"]`
            ).forEach(function (outroRadio) {

                if (outroRadio !== radio) {

                    outroRadio.dataset.selecionado =
                        'false';

                }

            });

        }

    });


    /* =====================================================
       FORMULÁRIO
    ====================================================== */

    if (form) {

        form.addEventListener('submit', function (event) {

            event.preventDefault();

            cadastrarCliente();

        });

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    inicializarPreferenciais();

});


/* =========================================================
   INICIALIZAR PREFERENCIAIS
========================================================= */

function inicializarPreferenciais() {

    document.querySelectorAll(
        'input[type="radio"][data-toggle-preferencial]'
    ).forEach(function (radio) {

        radio.dataset.selecionado =
            radio.checked ? 'true' : 'false';

    });

}


/* =========================================================
   ADICIONAR ENDEREÇO
========================================================= */

function adicionarEndereco() {

    const lista =
        document.getElementById('listaEnderecos');

    const original =
        lista.querySelector('.endereco-item');


    if (!original) {
        return;
    }


    const novo =
        original.cloneNode(true);


    /* Limpa campos */

    novo.querySelectorAll(
        'input, select, textarea'
    ).forEach(function (campo) {

        if (campo.type === 'radio') {

            campo.checked = false;

            campo.dataset.selecionado =
                'false';

        } else if (
            campo.name === 'pais'
        ) {

            campo.value = 'Brasil';

        } else {

            campo.value = '';

        }

    });


    /* Remove mensagens de erro */

    novo.querySelectorAll(
        '.mensagem-erro'
    ).forEach(function (erro) {

        erro.textContent = '';

    });


    /* Mostra botão excluir */

    const botaoRemover =
        novo.querySelector('.btn-remover-item');

    if (botaoRemover) {

        botaoRemover.style.display =
            'flex';

    }


    /* Atualiza título */

    const quantidade =
        lista.querySelectorAll(
            '.endereco-item'
        ).length + 1;


    const titulo =
        novo.querySelector('h2');

    if (titulo) {

        titulo.textContent =
            'Endereço ' + quantidade;

    }


    /* Adiciona */

    lista.appendChild(novo);


    atualizarTitulosEnderecos();

}


/* =========================================================
   REMOVER ENDEREÇO
========================================================= */

function removerEndereco(botao) {

    const lista =
        document.getElementById('listaEnderecos');

    const endereco =
        botao.closest('.endereco-item');


    const quantidade =
        lista.querySelectorAll(
            '.endereco-item'
        ).length;


    if (quantidade <= 1) {

        mostrarToast(
            'É necessário manter pelo menos um endereço.',
            'erro'
        );

        return;

    }


    endereco.remove();


    atualizarTitulosEnderecos();

}


/* =========================================================
   ATUALIZAR TÍTULOS DOS ENDEREÇOS
========================================================= */

function atualizarTitulosEnderecos() {

    const enderecos =
        document.querySelectorAll(
            '.endereco-item'
        );


    enderecos.forEach(function (endereco, index) {

        const titulo =
            endereco.querySelector('h2');


        if (index === 0) {

            titulo.textContent =
                'Endereço';

        } else {

            titulo.textContent =
                'Endereço ' + (index + 1);

        }

    });


    /* Primeiro endereço não pode ser removido */

    enderecos.forEach(function (endereco, index) {

        const botao =
            endereco.querySelector(
                '.btn-remover-item'
            );

        if (!botao) {
            return;
        }


        if (index === 0 && enderecos.length === 1) {

            botao.style.display =
                'none';

        } else {

            botao.style.display =
                'flex';

        }

    });

}


/* =========================================================
   ADICIONAR CARTÃO
========================================================= */

function adicionarCartao() {

    const lista =
        document.getElementById('listaCartoes');

    const original =
        lista.querySelector('.cartao-item');


    if (!original) {
        return;
    }


    const novo =
        original.cloneNode(true);


    /* Limpa os campos */

    novo.querySelectorAll(
        'input, select'
    ).forEach(function (campo) {

        if (campo.type === 'radio') {

            campo.checked = false;

            campo.dataset.selecionado =
                'false';

        } else {

            campo.value = '';

        }

    });


    /* Mostra remover */

    const botaoRemover =
        novo.querySelector('.btn-remover-item');

    if (botaoRemover) {

        botaoRemover.style.display =
            'flex';

    }


    /* Atualiza título */

    const quantidade =
        lista.querySelectorAll(
            '.cartao-item'
        ).length + 1;


    const titulo =
        novo.querySelector('h2');

    if (titulo) {

        titulo.textContent =
            'Cartão ' + quantidade;

    }


    lista.appendChild(novo);


    atualizarTitulosCartoes();

}


/* =========================================================
   REMOVER CARTÃO
========================================================= */

function removerCartao(botao) {

    const lista =
        document.getElementById('listaCartoes');

    const cartao =
        botao.closest('.cartao-item');


    const quantidade =
        lista.querySelectorAll(
            '.cartao-item'
        ).length;


    if (quantidade <= 1) {

        mostrarToast(
            'É necessário manter pelo menos um cartão.',
            'erro'
        );

        return;

    }


    cartao.remove();


    atualizarTitulosCartoes();

}


/* =========================================================
   ATUALIZAR TÍTULOS DOS CARTÕES
========================================================= */

function atualizarTitulosCartoes() {

    const cartoes =
        document.querySelectorAll(
            '.cartao-item'
        );


    cartoes.forEach(function (cartao, index) {

        const titulo =
            cartao.querySelector('h2');


        if (index === 0) {

            titulo.textContent =
                'Cartão';

        } else {

            titulo.textContent =
                'Cartão ' + (index + 1);

        }

    });


    cartoes.forEach(function (cartao, index) {

        const botao =
            cartao.querySelector(
                '.btn-remover-item'
            );


        if (!botao) {
            return;
        }


        if (
            index === 0 &&
            cartoes.length === 1
        ) {

            botao.style.display =
                'none';

        } else {

            botao.style.display =
                'flex';

        }

    });

}


/* =========================================================
   MÁSCARA CEP
========================================================= */

function mascararCEP(input) {

    let valor =
        input.value.replace(/\D/g, '');

    valor =
        valor.substring(0, 8);


    if (valor.length > 5) {

        valor =
            valor.replace(
                /^(\d{5})(\d)/,
                '$1-$2'
            );

    }


    input.value = valor;

}


/* =========================================================
   VIA CEP
========================================================= */

async function buscarCEP(input) {

    const cep =
        input.value.replace(/\D/g, '');


    /* Se estiver vazio */

    if (cep.length === 0) {

        limparEndereco(input);

        return;

    }


    /* CEP incompleto */

    if (cep.length !== 8) {

        mostrarErroCampo(
            input,
            'Digite um CEP válido.'
        );

        return;

    }


    const endereco =
        input.closest('.endereco-item');


    if (!endereco) {
        return;
    }


    /* Limpa erro */

    limparErroCampo(input);


    /* Campos */

    const logradouro =
        endereco.querySelector(
            'input[name="logradouro"]'
        );

    const bairro =
        endereco.querySelector(
            'input[name="bairro"]'
        );

    const cidade =
        endereco.querySelector(
            'input[name="cidade"]'
        );

    const estado =
        endereco.querySelector(
            'select[name="estado"]'
        );


    /* Loading */

    logradouro.value =
        'Consultando...';

    bairro.value =
        'Consultando...';

    cidade.value =
        'Consultando...';


    try {

        const resposta =
            await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );


        if (!resposta.ok) {

            throw new Error(
                'Erro ao consultar CEP.'
            );

        }


        const dados =
            await resposta.json();


        /* CEP não encontrado */

        if (dados.erro) {

            limparEndereco(input);

            mostrarErroCampo(
                input,
                'CEP não encontrado.'
            );

            return;

        }


        /* Preenche */

        logradouro.value =
            dados.logradouro || '';

        bairro.value =
            dados.bairro || '';

        cidade.value =
            dados.localidade || '';

        estado.value =
            dados.uf || '';


        /* Complemento */

        const observacoes =
            endereco.querySelector(
                'textarea[name="observacoes"]'
            );


        if (
            dados.complemento &&
            observacoes &&
            observacoes.value.trim() === ''
        ) {

            observacoes.value =
                dados.complemento;

        }


    } catch (erro) {

        console.error(
            'Erro ViaCEP:',
            erro
        );


        limparEndereco(input);


        mostrarErroCampo(
            input,
            'Não foi possível consultar o CEP. Tente novamente.'
        );

    }

}


/* =========================================================
   LIMPAR ENDEREÇO
========================================================= */

function limparEndereco(input) {

    const endereco =
        input.closest('.endereco-item');


    if (!endereco) {
        return;
    }


    const logradouro =
        endereco.querySelector(
            'input[name="logradouro"]'
        );

    const bairro =
        endereco.querySelector(
            'input[name="bairro"]'
        );

    const cidade =
        endereco.querySelector(
            'input[name="cidade"]'
        );

    const estado =
        endereco.querySelector(
            'select[name="estado"]'
        );


    if (logradouro) {
        logradouro.value = '';
    }

    if (bairro) {
        bairro.value = '';
    }

    if (cidade) {
        cidade.value = '';
    }

    if (estado) {
        estado.value = '';
    }

}


/* =========================================================
   MÁSCARA CARTÃO
========================================================= */

function mascararNumeroCartao(input) {

    let valor =
        input.value.replace(/\D/g, '');

    valor =
        valor.substring(0, 16);


    valor =
        valor.replace(
            /(\d{4})(?=\d)/g,
            '$1 '
        );


    input.value =
        valor;

}


/* =========================================================
   DETECTAR BANDEIRA
========================================================= */

function detectarBandeira(cartao) {

    if (!cartao) {
        return;
    }


    const numero =
        cartao.querySelector(
            'input[name="numeroCartao"]'
        );


    const bandeira =
        cartao.querySelector(
            'select[name="bandeiraCartao"]'
        );


    if (!numero || !bandeira) {
        return;
    }


    const valor =
        numero.value.replace(/\D/g, '');


    if (!valor) {
        return;
    }


    /* Visa */

    if (/^4/.test(valor)) {

        bandeira.value =
            'visa';

        return;

    }


    /* Mastercard */

    if (
        /^5[1-5]/.test(valor) ||
        /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(valor)
    ) {

        bandeira.value =
            'mastercard';

        return;

    }


    /* Elo */

    const elo =
        /^(4011|431274|438935|451416|4576|504175|5067|5090|627780|636368|636297|650|6516|6550)/;

    if (elo.test(valor)) {

        bandeira.value =
            'elo';

        return;

    }


    /* American Express */

    if (/^3[47]/.test(valor)) {

        bandeira.value =
            'american-express';

        return;

    }


    /* Hipercard */

    if (
        /^606282/.test(valor) ||
        /^3841/.test(valor)
    ) {

        bandeira.value =
            'hipercard';

        return;

    }

}


/* =========================================================
   MÁSCARA VALIDADE
========================================================= */

function mascararValidade(input) {

    let valor =
        input.value.replace(/\D/g, '');

    valor =
        valor.substring(0, 4);


    if (valor.length >= 3) {

        valor =
            valor.replace(
                /^(\d{2})(\d{1,2})$/,
                '$1/$2'
            );

    }


    input.value =
        valor;

}


/* =========================================================
   VALIDAÇÃO CPF
========================================================= */

function validarCPF(valor) {

    const cpf =
        valor.replace(/\D/g, '');


    if (cpf.length !== 11) {
        return false;
    }


    /* CPFs com todos os números iguais */

    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }


    let soma = 0;


    for (let i = 0; i < 9; i++) {

        soma +=
            parseInt(cpf.charAt(i)) *
            (10 - i);

    }


    let resto =
        (soma * 10) % 11;


    if (resto === 10) {
        resto = 0;
    }


    if (
        resto !==
        parseInt(cpf.charAt(9))
    ) {

        return false;

    }


    soma = 0;


    for (let i = 0; i < 10; i++) {

        soma +=
            parseInt(cpf.charAt(i)) *
            (11 - i);

    }


    resto =
        (soma * 10) % 11;


    if (resto === 10) {
        resto = 0;
    }


    return (
        resto ===
        parseInt(cpf.charAt(10))
    );

}


/* =========================================================
   LUHN
========================================================= */

function validarLuhn(numero) {

    const digitos =
        numero
            .replace(/\D/g, '')
            .split('')
            .reverse()
            .map(Number);


    if (digitos.length < 13) {
        return false;
    }


    let soma = 0;


    digitos.forEach(function (digito, index) {

        if (index % 2 === 1) {

            digito *= 2;

            if (digito > 9) {
                digito -= 9;
            }

        }

        soma += digito;

    });


    return soma % 10 === 0;

}


/* =========================================================
   VALIDAR CARTÃO
========================================================= */

function validarCartao(item) {

    let valido = true;


    const numero =
        item.querySelector(
            'input[name="numeroCartao"]'
        );

    const nome =
        item.querySelector(
            'input[name="nomeCartao"]'
        );

    const bandeira =
        item.querySelector(
            'select[name="bandeiraCartao"]'
        );

    const cvv =
        item.querySelector(
            'input[name="cvvCartao"]'
        );

    const validade =
        item.querySelector(
            'input[name="validadeCartao"]'
        );


    /* Remove erros anteriores */

    item.querySelectorAll(
        '.mensagem-erro'
    ).forEach(function (erro) {

        erro.textContent = '';

    });


    /* Número */

    const numeroLimpo =
        numero.value.replace(/\D/g, '');


    if (!numeroLimpo) {

        adicionarErroCartao(
            numero,
            'Digite o número do cartão.'
        );

        valido = false;

    } else if (
        numeroLimpo.length < 13 ||
        numeroLimpo.length > 16
    ) {

        adicionarErroCartao(
            numero,
            'Digite um número de cartão válido.'
        );

        valido = false;

    } else if (
        !validarLuhn(numeroLimpo)
    ) {

        adicionarErroCartao(
            numero,
            'O número do cartão é inválido.'
        );

        valido = false;

    }


    /* Nome */

    const nomeLimpo =
        nome.value.trim();


    if (!nomeLimpo) {

        adicionarErroCartao(
            nome,
            'Digite o nome impresso no cartão.'
        );

        valido = false;

    } else if (
        nomeLimpo.length < 3
    ) {

        adicionarErroCartao(
            nome,
            'Digite o nome completo impresso no cartão.'
        );

        valido = false;

    } else if (
        !/^[A-Za-zÀ-ÿ\s]+$/.test(nomeLimpo)
    ) {

        adicionarErroCartao(
            nome,
            'O nome do cartão deve conter apenas letras.'
        );

        valido = false;

    }


    /* Bandeira */

    if (!bandeira.value) {

        adicionarErroCartao(
            bandeira,
            'Selecione a bandeira do cartão.'
        );

        valido = false;

    }


    /* CVV */

    const cvvValor =
        cvv.value.replace(/\D/g, '');


    if (!cvvValor) {

        adicionarErroCartao(
            cvv,
            'Digite o CVV.'
        );

        valido = false;

    } else if (
        cvvValor.length < 3 ||
        cvvValor.length > 4
    ) {

        adicionarErroCartao(
            cvv,
            'O CVV deve possuir 3 ou 4 dígitos.'
        );

        valido = false;

    }


    /* Validade */

    if (
        !validarValidadeCartao(
            validade.value
        )
    ) {

        adicionarErroCartao(
            validade,
            'Informe uma validade válida.'
        );

        valido = false;

    }


    return valido;

}


/* =========================================================
   VALIDAR VALIDADE DO CARTÃO
========================================================= */

function validarValidadeCartao(valor) {

    const match =
        valor.match(
            /^(0[1-9]|1[0-2])\/(\d{2})$/
        );


    if (!match) {
        return false;
    }


    const mes =
        parseInt(match[1], 10);

    const ano =
        parseInt(match[2], 10);


    const agora =
        new Date();


    const anoAtual =
        agora.getFullYear() % 100;

    const mesAtual =
        agora.getMonth() + 1;


    if (ano < anoAtual) {
        return false;
    }


    if (
        ano === anoAtual &&
        mes < mesAtual
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   ERRO DO CARTÃO
========================================================= */

function adicionarErroCartao(
    campo,
    mensagem
) {

    let erro =
        campo.parentElement.querySelector(
            '.mensagem-erro'
        );


    if (!erro) {

        erro =
            document.createElement('p');

        erro.className =
            'mensagem-erro';

        campo.parentElement.appendChild(
            erro
        );

    }


    erro.textContent =
        mensagem;

}


/* =========================================================
   ERRO DE CAMPO
========================================================= */

function mostrarErroCampo(
    campo,
    mensagem
) {

    let erro =
        campo.parentElement.querySelector(
            '.mensagem-erro'
        );


    if (!erro) {

        erro =
            document.createElement('p');

        erro.className =
            'mensagem-erro';

        campo.parentElement.appendChild(
            erro
        );

    }


    erro.textContent =
        mensagem;

}


/* =========================================================
   LIMPAR ERRO
========================================================= */

function limparErroCampo(campo) {

    const erro =
        campo.parentElement.querySelector(
            '.mensagem-erro'
        );


    if (erro) {

        erro.textContent = '';

    }

}


/* =========================================================
   VALIDAR ENDEREÇO
========================================================= */

function validarEndereco(item) {

    let valido = true;


    item.querySelectorAll(
        '.mensagem-erro'
    ).forEach(function (erro) {

        erro.textContent = '';

    });


    const camposObrigatorios =
        item.querySelectorAll(
            'input[required], select[required]'
        );


    camposObrigatorios.forEach(function (campo) {

        if (
            campo.value.trim() === ''
        ) {

            adicionarErroCartao(
                campo,
                'Preencha este campo.'
            );

            valido = false;

        }

    });


    /* CEP */

    const cep =
        item.querySelector(
            'input[name="cep"]'
        );


    if (
        cep &&
        cep.value.replace(/\D/g, '').length !== 8
    ) {

        adicionarErroCartao(
            cep,
            'Digite um CEP válido.'
        );

        valido = false;

    }


    return valido;

}


/* =========================================================
   VALIDAR TELEFONE
========================================================= */

function validarTelefone() {

    const tipo =
        document.getElementById(
            'tipoTelefone'
        ).value;


    const valor =
        document.getElementById(
            'telefone'
        ).value.replace(/\D/g, '');


    if (tipo === 'celular') {

        return valor.length === 11;

    }


    if (tipo === 'fixo') {

        return valor.length === 10;

    }


    return false;

}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   CADASTRAR CLIENTE
========================================================= */

function cadastrarCliente() {

    let valido = true;


    /* =====================================================
       LIMPAR ERROS
    ====================================================== */

    document.querySelectorAll(
        '.mensagem-erro'
    ).forEach(function (erro) {

        erro.textContent = '';

    });


    /* =====================================================
       NOME
    ====================================================== */

    const nome =
        document.getElementById('nome');


    if (!nome.value.trim()) {

        document.getElementById(
            'erroNome'
        ).textContent =
            'Digite o nome do cliente.';

        valido = false;

    }


    /* =====================================================
       CPF
    ====================================================== */

    const cpf =
        document.getElementById('cpf');


    if (!cpf.value.trim()) {

        document.getElementById(
            'erroCpf'
        ).textContent =
            'Digite o CPF.';

        valido = false;

    } else if (
        !validarCPF(cpf.value)
    ) {

        document.getElementById(
            'erroCpf'
        ).textContent =
            'Digite um CPF válido.';

        valido = false;

    }


    /* =====================================================
       TIPO TELEFONE
    ====================================================== */

    const tipo =
        document.getElementById(
            'tipoTelefone'
        );


    if (!tipo.value) {

        document.getElementById(
            'erroTipoTelefone'
        ).textContent =
            'Selecione o tipo de telefone.';

        valido = false;

    }


    /* =====================================================
       TELEFONE
    ====================================================== */

    if (
        !document.getElementById(
            'telefone'
        ).value.trim()
    ) {

        document.getElementById(
            'erroTelefone'
        ).textContent =
            'Digite o telefone.';

        valido = false;

    } else if (
        !validarTelefone()
    ) {

        document.getElementById(
            'erroTelefone'
        ).textContent =
            tipo.value === 'fixo'
                ? 'Digite um telefone fixo válido.'
                : 'Digite um celular válido.';

        valido = false;

    }


    /* =====================================================
       GÊNERO
    ====================================================== */

    const genero =
        document.getElementById(
            'genero'
        );


    if (!genero.value) {

        document.getElementById(
            'erroGenero'
        ).textContent =
            'Selecione o gênero.';

        valido = false;

    }


    /* =====================================================
       DATA NASCIMENTO
    ====================================================== */

    const nascimento =
        document.getElementById(
            'dataNascimento'
        );


    if (!nascimento.value) {

        document.getElementById(
            'erroDataNascimento'
        ).textContent =
            'Informe a data de nascimento.';

        valido = false;

    } else {

        const data =
            new Date(
                nascimento.value +
                'T00:00:00'
            );

        const hoje =
            new Date();

        if (data > hoje) {

            document.getElementById(
                'erroDataNascimento'
            ).textContent =
                'A data de nascimento não pode ser futura.';

            valido = false;

        }

    }


    /* =====================================================
       E-MAIL
    ====================================================== */

    const email =
        document.getElementById(
            'email'
        );


    if (!email.value.trim()) {

        document.getElementById(
            'erroEmail'
        ).textContent =
            'Digite o e-mail.';

        valido = false;

    } else if (
        !validarEmail(email.value)
    ) {

        document.getElementById(
            'erroEmail'
        ).textContent =
            'Digite um e-mail válido.';

        valido = false;

    }


    /* =====================================================
       SENHA
    ====================================================== */

    const senha =
        document.getElementById(
            'senha'
        ).value;

    const confirmarSenha =
        document.getElementById(
            'confirmarSenha'
        ).value;


    const erroSenha =
        document.getElementById(
            'erroSenha'
        );

    const erroConfirmar =
        document.getElementById(
            'erroConfirmarSenha'
        );


    if (!senha) {

        erroSenha.textContent =
            'Digite uma senha.';

        valido = false;

    } else if (
        senha.length < 8
    ) {

        erroSenha.textContent =
            'A senha deve ter pelo menos 8 caracteres.';

        valido = false;

    } else if (
        !/[A-Z]/.test(senha)
    ) {

        erroSenha.textContent =
            'A senha deve ter pelo menos uma letra maiúscula.';

        valido = false;

    } else if (
        !/[a-z]/.test(senha)
    ) {

        erroSenha.textContent =
            'A senha deve ter pelo menos uma letra minúscula.';

        valido = false;

    } else if (
        !/[^A-Za-z0-9]/.test(senha)
    ) {

        erroSenha.textContent =
            'A senha deve ter pelo menos um caractere especial.';

        valido = false;

    }


    if (!confirmarSenha) {

        erroConfirmar.textContent =
            'Confirme a senha.';

        valido = false;

    } else if (
        senha !== confirmarSenha
    ) {

        erroConfirmar.textContent =
            'As senhas não coincidem.';

        valido = false;

    }


    /* =====================================================
       ENDEREÇOS
    ====================================================== */

    const enderecos =
        document.querySelectorAll(
            '.endereco-item'
        );


    if (enderecos.length === 0) {

        mostrarToast(
            'Adicione pelo menos um endereço.',
            'erro'
        );

        return;

    }


    enderecos.forEach(function (endereco) {

        if (
            !validarEndereco(endereco)
        ) {

            valido = false;

        }

    });


    /* =====================================================
       CARTÕES
    ====================================================== */

    const cartoes =
        document.querySelectorAll(
            '.cartao-item'
        );


    if (cartoes.length === 0) {

        mostrarToast(
            'Adicione pelo menos um cartão.',
            'erro'
        );

        return;

    }


    cartoes.forEach(function (cartao) {

        if (
            !validarCartao(cartao)
        ) {

            valido = false;

        }

    });


    /* =====================================================
       SE EXISTIR ERRO
    ====================================================== */

    if (!valido) {

        mostrarToast(
            'Verifique os campos destacados.',
            'erro'
        );

        return;

    }


    /* =====================================================
       SUCESSO
    ====================================================== */

    mostrarToast(
        'Cliente cadastrado com sucesso!',
        'sucesso'
    );


    /*
       Aqui futuramente você pode enviar o formulário
       para o Spring Boot usando fetch ou deixar o
       submit tradicional.
    */

    // form.submit();

}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
    mensagem,
    tipo = 'sucesso'
) {

    const toast =
        document.getElementById('toast');

    const toastMensagem =
        document.getElementById(
            'toastMensagem'
        );

    const icone =
        toast.querySelector(
            '.toast-icone'
        );


    toastMensagem.textContent =
        mensagem;


    toast.classList.remove(
        'toast-erro',
        'toast-sucesso'
    );


    if (tipo === 'erro') {

        toast.classList.add(
            'toast-erro'
        );

        icone.className =
            'toast-icone fa-solid fa-circle-exclamation';

    } else {

        toast.classList.add(
            'toast-sucesso'
        );

        icone.className =
            'toast-icone fa-solid fa-check';

    }


    toast.classList.add('ativo');


    setTimeout(function () {

        toast.classList.remove(
            'ativo'
        );

    }, 3000);

}