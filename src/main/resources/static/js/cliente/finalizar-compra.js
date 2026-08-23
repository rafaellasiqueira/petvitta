
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

    let enderecoEmEdicao = null;

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
    if (btnAlterarEndereco) {
        btnAlterarEndereco.addEventListener('click', function (e) {
            e.preventDefault();
            modalAlterarEndereco.classList.add('active');
        });
    }

    // Fechar modal de endereços
    if (btnFecharModalAlterarEndereco) {
        btnFecharModalAlterarEndereco.addEventListener('click', function () {
            modalAlterarEndereco.classList.remove('active');
        });
    }

    // Adicionar endereço
    if (btnAdicionarEndereco) {
        btnAdicionarEndereco.addEventListener('click', function () {
            formEndereco.reset();

            tituloEndereco.textContent = 'Adicionar endereço';
            btnSalvarEndereco.textContent = 'Adicionar';

            pais.value = 'Brasil';
            campoSalvarPerfil.style.display = '';

            enderecoEmEdicao = null;

            modalAlterarEndereco.classList.remove('active');
            modalEndereco.classList.add('active');
        });
    }

    // Editar endereço
    document.querySelectorAll('.editar-endereco').forEach(function (botao) {
        botao.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            enderecoEmEdicao = this.closest('.modalEndereco');

            tituloEndereco.textContent = 'Editar endereço';
            btnSalvarEndereco.textContent = 'Salvar';

            nomeIdentificacao.value = this.dataset.nome || '';
            tipoEndereco.value = this.dataset.tipoEndereco || '';
            tipoResidencia.value = this.dataset.tipoResidencia || '';
            tipoLogradouro.value = this.dataset.tipoLogradouro || '';
            cep.value = this.dataset.cep || '';
            logradouro.value = this.dataset.logradouro || '';
            bairro.value = this.dataset.bairro || '';
            numeroEndereco.value = this.dataset.numero || '';
            estado.value = this.dataset.estado || '';
            cidade.value = this.dataset.cidade || '';
            pais.value = this.dataset.pais || 'Brasil';
            observacoes.value = this.dataset.observacoes || '';

            campoSalvarPerfil.style.display = 'none';

            modalAlterarEndereco.classList.remove('active');
            modalEndereco.classList.add('active');
        });
    });

    // Fechar modal de endereço
    if (btnFecharEndereco) {
        btnFecharEndereco.addEventListener('click', function () {
            modalEndereco.classList.remove('active');
            modalAlterarEndereco.classList.add('active');
        });
    }

    // Cancelar endereço
    if (btnCancelarEndereco) {
        btnCancelarEndereco.addEventListener('click', function () {
            modalEndereco.classList.remove('active');
            modalAlterarEndereco.classList.add('active');
        });
    }

    // Salvar endereço
    if (formEndereco) {
        formEndereco.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!formEndereco.checkValidity()) {
                formEndereco.reportValidity();
                return;
            }

            if (enderecoEmEdicao) {
                const dados = enderecoEmEdicao.querySelector('.dados-endereco');

                if (dados) {
                    const nome = dados.querySelector('h3');
                    const residencia = dados.querySelector('.tipo-residencia');
                    const logradouroElemento = dados.querySelector('.logradouro');
                    const numero = dados.querySelector('.numero');
                    const bairroElemento = dados.querySelector('.bairro');
                    const cidadeElemento = dados.querySelector('.cidade');
                    const estadoElemento = dados.querySelector('.estado');
                    const cepElemento = dados.querySelector('.cep');

                    if (nome) nome.textContent = nomeIdentificacao.value;
                    if (residencia) residencia.textContent = tipoResidencia.options[tipoResidencia.selectedIndex].text;
                    if (logradouroElemento) logradouroElemento.textContent = logradouro.value;
                    if (numero) numero.textContent = numeroEndereco.value;
                    if (bairroElemento) bairroElemento.textContent = bairro.value;
                    if (cidadeElemento) cidadeElemento.textContent = cidade.value;
                    if (estadoElemento) estadoElemento.textContent = estado.options[estado.selectedIndex].text;
                    if (cepElemento) cepElemento.textContent = cep.value;
                }

                const radio = enderecoEmEdicao.querySelector('input[type="radio"]');

                if (radio) {
                    radio.checked = true;
                }

                mostrarToast('Endereço alterado com sucesso!', 'certo');
            } else {
                mostrarToast('Endereço adicionado com sucesso!', 'certo');
            }

            modalEndereco.classList.remove('active');
            modalAlterarEndereco.classList.add('active');
        });
    }

    // Confirmar endereço
    if (btnConfirmarEndereco) {
        btnConfirmarEndereco.addEventListener('click', function () {
            const enderecoSelecionado = document.querySelector('input[name="endereco"]:checked');

            if (!enderecoSelecionado) {
                mostrarToast('Selecione um endereço.', 'atencao');
                return;
            }

            const endereco = enderecoSelecionado.closest('.modalEndereco');

            if (!endereco) {
                return;
            }

            const dados = endereco.querySelector('.dados-endereco');

            if (!dados) {
                return;
            }

            const nome = dados.querySelector('h3');
            const residencia = dados.querySelector('.tipo-residencia');
            const logradouroElemento = dados.querySelector('.logradouro');
            const numero = dados.querySelector('.numero');
            const bairroElemento = dados.querySelector('.bairro');
            const cidadeElemento = dados.querySelector('.cidade');
            const estadoElemento = dados.querySelector('.estado');
            const cepElemento = dados.querySelector('.cep');

            const enderecoNome = document.getElementById('enderecoNome');
            const enderecoTipo = document.getElementById('enderecoTipo');
            const enderecoLogradouro = document.getElementById('enderecoLogradouro');
            const enderecoCep = document.getElementById('enderecoCep');

            if (enderecoNome && nome) {
                enderecoNome.textContent = nome.textContent;
            }

            if (enderecoTipo && residencia) {
                enderecoTipo.textContent = residencia.textContent;
            }

            if (enderecoLogradouro) {
                enderecoLogradouro.textContent =
                    (logradouroElemento ? logradouroElemento.textContent : '') +
                    ', ' +
                    (numero ? numero.textContent : '') +
                    ' - ' +
                    (bairroElemento ? bairroElemento.textContent : '') +
                    ', ' +
                    (cidadeElemento ? cidadeElemento.textContent : '') +
                    ' - ' +
                    (estadoElemento ? estadoElemento.textContent : '');
            }

            if (enderecoCep && cepElemento) {
                enderecoCep.textContent = 'CEP: ' + cepElemento.textContent + ', Brasil.';
            }

            modalAlterarEndereco.classList.remove('active');

            mostrarToast('Endereço selecionado com sucesso!', 'certo');
        });
    }

    // CEP
    if (cep) {
        cep.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 8);

            if (valor.length > 5) {
                valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
            }

            this.value = valor;
        });

        cep.addEventListener('keypress', function (e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    // Número
    if (numeroEndereco) {
        numeroEndereco.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });

        numeroEndereco.addEventListener('keypress', function (e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    // Cupons
    const modalCupons = document.getElementById('modalCupons');
    const btnAbrirModalCupom = document.getElementById('btnMeusCupons');
    const btnFecharModalCupom = document.getElementById('btnFecharModalCupom');
    const checkboxesCupom = document.querySelectorAll('.checkbox-cupom');
    const cuponsSelecionados = document.getElementById('cuponsSelecionados');

    if (btnAbrirModalCupom) {
        btnAbrirModalCupom.addEventListener('click', function (e) {
            e.preventDefault();
            modalCupons.classList.add('active');
        });
    }

    if (btnFecharModalCupom) {
        btnFecharModalCupom.addEventListener('click', function () {
            modalCupons.classList.remove('active');
        });
    }

    checkboxesCupom.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const codigo = this.dataset.codigo;

            if (!this.checked) {
                const cupom = cuponsSelecionados.querySelector('[data-codigo="' + codigo + '"]');

                if (cupom) {
                    cupom.remove();
                }

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

            const cupomExistente = cuponsSelecionados.querySelector(
                '[data-codigo="' + codigo + '"]'
            );

            if (cupomExistente) {
                return;
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
    if (btnAdicionarCartao) {
        btnAdicionarCartao.addEventListener('click', function (e) {
            e.preventDefault();

            formCartao.reset();

            mensagemErroNumero.textContent = '';
            mensagemErroValidade.textContent = '';

            modalCartao.classList.add('active');
        });
    }

    // Fechar cartão
    if (btnFecharCartao) {
        btnFecharCartao.addEventListener('click', function () {
            modalCartao.classList.remove('active');
        });
    }

    if (btnCancelarCartao) {
        btnCancelarCartao.addEventListener('click', function () {
            modalCartao.classList.remove('active');
        });
    }

    // Número do cartão
    if (numeroCartao) {
        numeroCartao.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 16);

            if (valor.length > 12) {
                valor = valor.replace(/(\d{4})(\d{4})(\d{4})(\d{1,4})/, '$1 $2 $3 $4');
            } else if (valor.length > 8) {
                valor = valor.replace(/(\d{4})(\d{4})(\d{1,4})/, '$1 $2 $3');
            } else if (valor.length > 4) {
                valor = valor.replace(/(\d{4})(\d{1,4})/, '$1 $2');
            }

            this.value = valor;
        });
    }

    // CVV
    if (cvv) {
        cvv.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    // Validade
    if (validade) {
        validade.addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 4);

            if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
            }

            this.value = valor;
        });
    }

    // Validar cartão
    if (formCartao) {
        formCartao.addEventListener('submit', function (e) {
            e.preventDefault();

            mensagemErroNumero.textContent = '';
            mensagemErroValidade.textContent = '';

            const numero = numeroCartao.value.replace(/\D/g, '');
            const valorValidade = validade.value;
            const partes = valorValidade.split('/');

            const mes = parseInt(partes[0], 10);
            const ano = parseInt(partes[1], 10);

            const dataAtual = new Date();
            const anoAtual = dataAtual.getFullYear() % 100;
            const mesAtual = dataAtual.getMonth() + 1;

            if (numero.length !== 16) {
                mensagemErroNumero.textContent = 'Digite o número completo do cartão.';
                return;
            }

            if (
                partes.length !== 2 ||
                partes[0].length !== 2 ||
                partes[1].length !== 2 ||
                isNaN(mes) ||
                isNaN(ano) ||
                mes < 1 ||
                mes > 12
            ) {
                mensagemErroValidade.textContent = 'Digite uma validade válida.';
                return;
            }

            if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
                mensagemErroValidade.textContent = 'O cartão está vencido.';
                return;
            }

            if (cvv.value.length < 3 || cvv.value.length > 4) {
                mostrarToast('Digite um CVV válido.', 'atencao');
                return;
            }

            if (!formCartao.checkValidity()) {
                formCartao.reportValidity();
                return;
            }

            modalCartao.classList.remove('active');

            mostrarToast('Cartão cadastrado com sucesso!', 'certo');
        });
    }

    // Pagamento
    const cartoes = document.querySelectorAll('.cartao-container');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    const subtotalElemento = document.querySelector('.linha-resumo:nth-child(1) h3:last-child');
    const freteElemento = document.querySelector('.linha-resumo:nth-child(2) h3:last-child');
    const descontoElemento = document.querySelector('.cupom-resumo h3:last-child');
    const totalElemento = document.querySelector('.linha-total h3:last-child');

    function converterMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function pegarValor(texto) {
        if (!texto) {
            return 0;
        }

        return parseFloat(
            texto
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
                .replace(/[^\d.-]/g, '')
        ) || 0;
    }

    const subtotal = pegarValor(subtotalElemento ? subtotalElemento.textContent : '55,00');
    const frete = pegarValor(freteElemento ? freteElemento.textContent : '10,00');
    const totalCompra = subtotal + frete;

    if (totalElemento) {
        totalElemento.textContent = 'R$ ' + converterMoeda(totalCompra);
    }

    // Mostrar/ocultar valor do cartão
    cartoes.forEach(function (cartao) {
        const checkbox = cartao.querySelector('.checkbox-cartao');
        const campo = cartao.querySelector('.campo-valor-cartao');
        const input = campo ? campo.querySelector('input') : null;

        if (!checkbox || !campo || !input) {
            return;
        }

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

        const desconto = Math.min(totalCupons, totalCompra);
        const totalFinal = totalCompra - desconto;

        if (descontoElemento) {
            descontoElemento.textContent = '-R$ ' + converterMoeda(desconto);
        }

        if (totalElemento) {
            totalElemento.textContent = 'R$ ' + converterMoeda(totalFinal);
        }

        return {
            totalCupons: totalCupons,
            desconto: desconto,
            totalFinal: totalFinal
        };
    }

    atualizarResumoPagamento();

    // Finalizar compra
    if (btnFinalizarCompra) {
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

                if (!checkbox || !checkbox.checked) {
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
    }
});

