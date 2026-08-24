
document.addEventListener('DOMContentLoaded', function () {
    // Endereço
    const modalAlterarEndereco = document.getElementById('modalAlterarEndereco');
    const btnAlterarEndereco = document.getElementById('btnAlterarEndereco');
    const btnFecharModalAlterarEndereco = document.getElementById('btnFecharModalAlterarEndereco');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
    const btnConfirmarEndereco = document.getElementById('btnConfirmarEndereco');

    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');
    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');
    const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');

    const nomeIdentificacao = document.getElementById('nomeIdentificacao');
    const tipoEndereco = document.getElementById('tipoEndereco');
    const tipoResidencia = document.getElementById('tipoResidencia');
    const tipoLogradouro = document.getElementById('tipoLogradouro');
    const cep = document.getElementById('cep');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const numeroEndereco = document.getElementById('numero');
    const estado = document.getElementById('estado');
    const cidade = document.getElementById('cidade');
    const pais = document.getElementById('pais');
    const observacoes = document.getElementById('observacoes');

    // Toast
    function mostrarToast(mensagem, tipo) {
        const toast = document.getElementById('toast');
        const icone = toast.querySelector('.toast-icone');
        const texto = document.getElementById('toastMensagem');

        texto.textContent = mensagem;

        toast.classList.remove('atencao', 'certo', 'ativo');
        toast.classList.add(tipo);

        if (tipo === 'atencao') {
            icone.className = 'toast-icone fa-solid fa-triangle-exclamation';
        } else {
            icone.className = 'toast-icone fa-solid fa-check';
        }

        toast.classList.add('ativo');

        setTimeout(function () {
            toast.classList.remove('ativo');
        }, 2500);
    }

    // Abrir modal de endereços
    btnAlterarEndereco.addEventListener('click', function (e) {
        modalAlterarEndereco.classList.add('active');
    });

    // Fechar modal de endereços
    btnFecharModalAlterarEndereco.addEventListener('click', function () {
        modalAlterarEndereco.classList.remove('active');
    });

    // Adicionar endereço
    btnAdicionarEndereco.addEventListener('click', function () {
        formEndereco.reset();

        tituloEndereco.textContent = 'Adicionar endereço';
        btnSalvarEndereco.textContent = 'Adicionar';

        pais.value = 'Brasil';
        campoSalvarPerfil.style.display = '';

        modalAlterarEndereco.classList.remove('active');
        modalEndereco.classList.add('active');
    });

    // Editar endereço
    document.querySelectorAll('.editar-endereco').forEach(function (botao) {
        botao.addEventListener('click', function (e) {
            e.preventDefault();

            tituloEndereco.textContent = 'Editar endereço';
            btnSalvarEndereco.textContent = 'Salvar';

            nomeIdentificacao.value = this.dataset.nome;
            tipoEndereco.value = this.dataset.tipoEndereco;
            tipoResidencia.value = this.dataset.tipoResidencia;
            tipoLogradouro.value = this.dataset.tipoLogradouro;
            cep.value = this.dataset.cep;
            logradouro.value = this.dataset.logradouro;
            bairro.value = this.dataset.bairro;
            numeroEndereco.value = this.dataset.numero;
            estado.value = this.dataset.estado;
            cidade.value = this.dataset.cidade;
            pais.value = this.dataset.pais;
            observacoes.value = this.dataset.observacoes;

            campoSalvarPerfil.style.display = 'none';

            modalAlterarEndereco.classList.remove('active');
            modalEndereco.classList.add('active');
        });
    });

    // Fechar modal de endereço
    btnFecharEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
        modalAlterarEndereco.classList.add('active');
    });

    // Cancelar endereço
    btnCancelarEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
        modalAlterarEndereco.classList.add('active');
    });

    // Salvar endereço
    formEndereco.addEventListener('submit', function (e) {
        e.preventDefault();

        mostrarToast('Endereço salvo com sucesso!', 'certo');

        modalEndereco.classList.remove('active');
        modalAlterarEndereco.classList.add('active');
    });


    // Confirmar endereço
    btnConfirmarEndereco.addEventListener('click', function () {
        const enderecoSelecionado = document.querySelector('input[name="endereco"]:checked');

        if (!enderecoSelecionado) {
            mostrarToast('Selecione um endereço.', 'atencao');
            return;
        }
        modalAlterarEndereco.classList.remove('active');

        mostrarToast('Endereço selecionado com sucesso!', 'certo');
    });

    // CEP
    cep.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        this.value = valor;
    });

    // Número
    numeroEndereco.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });


    // Cupons
    const modalCupons = document.getElementById('modalCupons');
    const btnAbrirModalCupom = document.getElementById('btnMeusCupons');
    const btnFecharModalCupom = document.getElementById('btnFecharModalCupom');
    const checkboxesCupom = document.querySelectorAll('.checkbox-cupom');
    const cuponsSelecionados = document.getElementById('cuponsSelecionados');

    btnAbrirModalCupom.addEventListener('click', function (e) {
        e.preventDefault();
        modalCupons.classList.add('active');
    });

    btnFecharModalCupom.addEventListener('click', function () {
        modalCupons.classList.remove('active');
    });

    checkboxesCupom.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const codigo = this.dataset.codigo;

            if (!this.checked) {
                const cupom = cuponsSelecionados.querySelector('[data-codigo="' + codigo + '"]');
                cupom.remove();

                atualizarResumoPagamento();
                return;
            }

            if (this.dataset.tipo === 'promocional') {
                const promocionaisSelecionados = document.querySelectorAll(
                    '.checkbox-cupom[data-tipo="promocional"]:checked'
                );

                if (promocionaisSelecionados.length > 1) {
                    this.checked = false;
                    mostrarToast('Apenas um cupom promocional pode ser utilizado por compra.', 'atencao');
                    return;
                }
            }

            const cupom = document.createElement('div');
            cupom.classList.add('cupom-selecionado');
            cupom.dataset.codigo = codigo;

            cupom.innerHTML =
                '<span>' + codigo + '</span>' +
                '<button type="button" class="remover-cupom">×</button>';

            cuponsSelecionados.appendChild(cupom);

            cupom.querySelector('.remover-cupom').addEventListener('click', function () {
                checkbox.checked = false;
                cupom.remove();
                atualizarResumoPagamento();
            });

            atualizarResumoPagamento();
        });
    });

    // Cartão
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');
    const btnAdicionarCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    const numeroCartao = document.getElementById('numeroCartao');
    const cvv = document.getElementById('cvvCartao');
    const validade = document.getElementById('validadeCartao');
    const mensagemErroNumero = document.getElementById('mensagemErroNumero');
    const mensagemErroValidade = document.getElementById('mensagemErroValidade');

    // Abrir cartão
    btnAdicionarCartao.addEventListener('click', function (e) {
        e.preventDefault();
        formCartao.reset();

        mensagemErroNumero.textContent = '';
        mensagemErroValidade.textContent = '';

        modalCartao.classList.add('active');
    });

    // Fechar cartão
    btnFecharCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    btnCancelarCartao.addEventListener('click', function () {
        modalCartao.classList.remove('active');
    });

    document.getElementById('nomeCartao').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });

    // Número do cartão
    numeroCartao.addEventListener('input', function () {
        let numero = this.value.replace(/\D/g, '');
        numero = numero.slice(0, 16);
        numero = numero.replace(/(\d{4})(?=\d)/g, '$1 ');

        this.value = numero;
    });

    // CVV
    cvv.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

    // Validade
    validade.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 4);

        if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }

        this.value = valor;
    });

    // Validar cartão
    formCartao.addEventListener('submit', function (e) {
        e.preventDefault();
        mensagemErroNumero.textContent = '';
        mensagemErroValidade.textContent = '';
        const numero = numeroCartao.value.replace(/\D/g, '');
        const validade = validade.value;

        if (numero.length !== 16) {
            mensagemErroNumero.textContent = 'Digite o número completo do cartão.';
            return;
        }

        if (validade.length === 5) {
            const partes = validade.split('/');
            const mes = parseInt(partes[0]);
            const ano = parseInt('20' + partes[1]);

            if (mes < 1 || mes > 12) {
                mensagemErroValidade.textContent = 'Digite uma validade válida.';
                return;
            }

            const dataValidade = new Date(ano, mes - 1, 1);
            const hoje = new Date();

            hoje.setHours(0, 0, 0, 0);

            if (dataValidade < hoje) {
                mensagemErroValidade.textContent = 'Cartão vencido.';
                return;
            }
        } else {
            mensagemErroValidade.textContent = 'Digite uma validade válida.';
            return;
        }

        modalCartao.classList.remove('active');
        mostrarToast('Cartão cadastrado com sucesso!', 'certo');
    });


    // Pagamento
    const cartoes = document.querySelectorAll('.cartao-container');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    const subtotalElemento = document.getElementById('subtotal');
    const freteElemento = document.getElementById('frete');
    const descontoElemento = document.getElementById('desconto');
    const totalElemento = document.getElementById('total');

    function converterMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function pegarValor(texto) {
        return parseFloat(
            texto
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim()
        ) || 0;
    }

    const subtotal = pegarValor(subtotalElemento.textContent);
    const frete = pegarValor(freteElemento.textContent);
    const totalCompra = subtotal + frete;

    totalElemento.textContent = 'R$ ' + converterMoeda(totalCompra);

    // Mostrar/ocultar valor do cartão
    cartoes.forEach(function (cartao) {
        const checkbox = cartao.querySelector('.checkbox-cartao');
        const campo = cartao.querySelector('.campo-valor-cartao');
        const input = campo.querySelector('input');

        campo.style.display = 'none';

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                campo.style.display = 'block';
            } else {
                campo.style.display = 'none';
                input.value = '';
            }
        });
    });

    // Atualizar resumo
    function atualizarResumoPagamento() {
        let totalCupons = 0;

        document.querySelectorAll('.checkbox-cupom:checked').forEach(function (cupom) {
            const valor = parseFloat(cupom.dataset.valor) || 0;
            totalCupons += valor;
        });

        let desconto = totalCupons;

        if (desconto > totalCompra) {
            desconto = totalCompra;
        }

        const totalFinal = totalCompra - desconto;

        descontoElemento.textContent = '-R$ ' + converterMoeda(desconto);

        totalElemento.textContent = 'R$ ' + converterMoeda(totalFinal);

        return {
            totalCupons: totalCupons,
            desconto: desconto,
            totalFinal: totalFinal
        };
    }

    atualizarResumoPagamento();

    // Finalizar compra
    btnFinalizarCompra.addEventListener('click', function () {
        const pagamento = atualizarResumoPagamento();

        const totalCupons = pagamento.totalCupons;
        const valorRestante = pagamento.totalFinal;

        let quantidadeCartoes = 0;
        let totalCartoes = 0;
        let valorCartaoInvalido = false;
        let cartaoMenorQue10 = false;

        // Verificar cartões
        cartoes.forEach(function (cartao) {
            const checkbox = cartao.querySelector('.checkbox-cartao');

            if (!checkbox.checked) {
                return;
            }

            quantidadeCartoes++;

            const input = cartao.querySelector('input[type="number"]');
            const valor = parseFloat(input.value);

            if (isNaN(valor) || valor <= 0) {
                valorCartaoInvalido = true;
                return;
            }

            totalCartoes += valor;

            if (valorRestante >= 10 && valor < 10) {
                cartaoMenorQue10 = true;
            }
        });

        // Compra já paga pelos cupons
        if (valorRestante <= 0) {
            if (quantidadeCartoes > 0) {
                mostrarToast('Remova os cartões, pois os cupons já cobrem o valor da compra.', 'atencao');
                return;
            }

            let mensagem = 'Compra realizada com sucesso!';

            if (totalCupons > totalCompra) {
                const valorTroca = totalCupons - totalCompra;

                mensagem +=
                    ' Foi gerado um cupom de troca de R$ ' +
                    converterMoeda(valorTroca) +
                    '.';
            }

            mostrarToast(mensagem, 'certo');

            setTimeout(function () {
                window.location.href = '/cliente/pedidos';
            }, 2500);

            return;
        }

        // Precisa de cartão
        if (quantidadeCartoes === 0) {
            mostrarToast('Selecione um cartão para completar o pagamento.', 'atencao');
            return;
        }

        // Todos os cartões precisam ter valor
        if (valorCartaoInvalido) {
            mostrarToast('Digite o valor de todos os cartões selecionados.', 'atencao');
            return;
        }

        // Cartões não podem ultrapassar o restante
        if (totalCartoes > valorRestante) {
            mostrarToast('O valor dos cartões é maior que o valor restante.', 'atencao');
            return;
        }

        // Cartões precisam completar o pagamento
        if (totalCartoes < valorRestante) {
            mostrarToast('O valor dos cartões não completa o pagamento.', 'atencao');
            return;
        }

        // Mínimo de R$ 10 por cartão
        if (cartaoMenorQue10) {
            mostrarToast('Cada cartão deve ter no mínimo R$ 10,00.', 'atencao');
            return;
        }

        // Compra paga
        let mensagem = 'Compra realizada com sucesso!';

        if (totalCupons > totalCompra) {
            const valorTroca = totalCupons - totalCompra;

            mensagem +=
                ' Foi gerado um cupom de troca de R$ ' +
                converterMoeda(valorTroca) +
                '.';
        }

        mostrarToast(mensagem, 'certo');

        setTimeout(function () {
            window.location.href = '/cliente/pedido';
        }, 2500);
    });

});

