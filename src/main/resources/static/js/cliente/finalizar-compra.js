document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // FUNÇÕES AUXILIARES
    // =========================================================

    function parseMoeda(valor) {

        if (valor === null || valor === undefined || valor === '') {
            return 0;
        }

        if (typeof valor === 'number') {
            return valor;
        }

        let texto = String(valor).trim();

        texto = texto.replace(/[^\d,.-]/g, '');

        if (texto.includes(',')) {
            texto = texto.replace(/\./g, '');
            texto = texto.replace(',', '.');
        }

        const numero = parseFloat(texto);

        return Number.isFinite(numero) ? numero : 0;
    }


    function formatarMoeda(valor) {

        return Number(valor || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    function formatarReal(valor) {

        return `R$ ${formatarMoeda(valor)}`;
    }


    // =========================================================
    // RESUMO DA COMPRA
    // =========================================================

    const resumoCompra = {

        get subtotal() {

            const linhas = document.querySelectorAll('.linha-resumo');

            for (const linha of linhas) {

                const titulo = linha.querySelector('h3:first-child');

                if (titulo && titulo.textContent.trim().toLowerCase() === 'subtotal') {

                    const valor = linha.querySelector('h3:last-child');
                    return parseMoeda(valor?.textContent);
                }
            }

            return 0;
        },


        get frete() {

            const linhas = document.querySelectorAll('.linha-resumo');

            for (const linha of linhas) {

                const titulo = linha.querySelector('h3:first-child');

                if (titulo && titulo.textContent.trim().toLowerCase() === 'frete') {

                    const valor = linha.querySelector('h3:last-child');
                    return parseMoeda(valor?.textContent);
                }
            }

            return 0;
        },


        get total() {
            return this.subtotal + this.frete;
        }
    };


    const elementoDesconto = document.querySelector('.cupom-resumo h3:last-child');
    const elementoTotal = document.querySelector('.linha-total h3:last-child');


    // =========================================================
    // TOAST
    // =========================================================

    const toast = document.getElementById('toast');

    function mostrarMensagem(mensagem) {

        if (!toast) {
            alert(mensagem);
            return;
        }

        const texto = toast.querySelector('span:last-child');

        if (texto) {
            texto.textContent = mensagem;
        }

        toast.classList.add('ativo');

        clearTimeout(toast._timeout);

        toast._timeout = setTimeout(() => {
            toast.classList.remove('ativo');
        }, 3000);
    }


    function mostrarErro(mensagem) {
        alert(mensagem);
    }


    // =========================================================
    // MODAIS DE ENDEREÇO
    // =========================================================

    const modalListar = document.getElementById('modalAlterarEndereco');
    const modalForm = document.getElementById('modalAdicionarEditarEndereco');
    const btnAlterarEndereco = document.getElementById('btnAlterarEndereco');
    const btnFecharListar = document.getElementById('btnFecharModalAlterarEndereco');
    const btnFecharForm = document.getElementById('btnFecharModalEndereco');
    const btnAdicionar = document.getElementById('btnAdicionarEndereco');
    const btnCancelarForm = document.getElementById('btnCancelarEndereco');
    const btnsEditar = document.querySelectorAll('.editar-endereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloModal = document.getElementById('tituloModalEndereco');

    // NOVO: botão de confirmar endereço selecionado
    const btnConfirmarEndereco = document.getElementById('btnConfirmarEndereco');

    // NOVO: guarda o id do endereço selecionado para enviar ao backend depois
    let enderecoSelecionadoId = null;

    const nomeIdentificacao = document.getElementById('nomeIdentificacao');
    const tipoEndereco = document.getElementById('tipoEndereco');
    const tipoResidencia = document.getElementById('tipoResidencia');
    const tipoLogradouro = document.getElementById('tipoLogradouro');
    const cep = document.getElementById('cep');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const numero = document.getElementById('numero');
    const estado = document.getElementById('estado');
    const cidade = document.getElementById('cidade');
    const pais = document.getElementById('pais');
    const observacoes = document.getElementById('observacoes');
    const salvarPerfil = document.getElementById('salvarPerfil');
    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');


    function limparFormularioEndereco() {

        if (!formEndereco) return;

        formEndereco.reset();

        if (nomeIdentificacao) nomeIdentificacao.value = '';
        if (tipoEndereco) tipoEndereco.value = '';
        if (tipoResidencia) tipoResidencia.value = '';
        if (tipoLogradouro) tipoLogradouro.value = '';
        if (cep) cep.value = '';
        if (logradouro) logradouro.value = '';
        if (bairro) bairro.value = '';
        if (numero) numero.value = '';
        if (estado) estado.value = '';
        if (cidade) cidade.value = '';
        if (pais) pais.value = 'Brasil';
        if (observacoes) observacoes.value = '';
        if (salvarPerfil) salvarPerfil.checked = false;
    }


    function fecharModalFormEndereco() {

        if (modalForm) modalForm.classList.remove('active');
        if (modalListar) modalListar.classList.add('active');
    }


    if (btnAlterarEndereco && modalListar) {

        btnAlterarEndereco.addEventListener('click', (event) => {
            event.preventDefault();
            modalListar.classList.add('active');
        });
    }


    if (btnAdicionar && modalForm && modalListar) {

        btnAdicionar.addEventListener('click', () => {

            limparFormularioEndereco();

            if (tituloModal) tituloModal.textContent = 'Adicionar endereço';
            if (campoSalvarPerfil) campoSalvarPerfil.style.display = 'flex';

            const btnSalvar = document.getElementById('btnSalvarEndereco');
            if (btnSalvar) btnSalvar.textContent = 'Adicionar';

            modalListar.classList.remove('active');
            modalForm.classList.add('active');
        });
    }


    btnsEditar.forEach(botao => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();

            const dados = botao.dataset;

            if (nomeIdentificacao) nomeIdentificacao.value = dados.nome || '';
            if (tipoEndereco) tipoEndereco.value = dados.tipoEndereco || '';
            if (tipoResidencia) tipoResidencia.value = dados.tipoResidencia || '';
            if (tipoLogradouro) tipoLogradouro.value = dados.tipoLogradouro || '';
            if (cep) cep.value = dados.cep || '';
            if (logradouro) logradouro.value = dados.logradouro || '';
            if (bairro) bairro.value = dados.bairro || '';
            if (numero) numero.value = dados.numero || '';
            if (estado) estado.value = dados.estado || '';
            if (cidade) cidade.value = dados.cidade || '';
            if (pais) pais.value = dados.pais || 'Brasil';
            if (observacoes) observacoes.value = dados.observacoes || '';
            if (salvarPerfil) salvarPerfil.checked = false;
            if (campoSalvarPerfil) campoSalvarPerfil.style.display = 'none';
            if (tituloModal) tituloModal.textContent = 'Editar endereço';

            const btnSalvar = document.getElementById('btnSalvarEndereco');
            if (btnSalvar) btnSalvar.textContent = 'Salvar';

            if (modalListar) modalListar.classList.remove('active');
            if (modalForm) modalForm.classList.add('active');
        });
    });


    if (btnFecharListar) {
        btnFecharListar.addEventListener('click', () => modalListar?.classList.remove('active'));
    }

    if (btnFecharForm) {
        btnFecharForm.addEventListener('click', fecharModalFormEndereco);
    }

    if (btnCancelarForm) {
        btnCancelarForm.addEventListener('click', fecharModalFormEndereco);
    }


    // =========================================================
    // NOVO: CONFIRMAR ENDEREÇO SELECIONADO
    //
    // Lê o radio marcado dentro do modal de listagem, pega os
    // data-* do botão "editar-endereco" do mesmo item (é onde
    // já temos todos os dados) e atualiza o card de resumo.
    //
    // IMPORTANTE: para isso funcionar, adicione os ids abaixo
    // no HTML dentro da <div class="endereco"> (ver instruções
    // que te mandei no chat):
    //   #enderecoNome, #enderecoTipo, #enderecoLogradouro, #enderecoCep
    // =========================================================

    if (btnConfirmarEndereco && modalListar) {

        btnConfirmarEndereco.addEventListener('click', () => {

            const radioSelecionado =
                modalListar.querySelector('input[name="endereco"]:checked');

            if (!radioSelecionado) {
                mostrarErro('Selecione um endereço.');
                return;
            }

            const label = radioSelecionado.closest('.modalEndereco');
            const botaoEditar = label?.querySelector('.editar-endereco');

            if (!botaoEditar) {
                modalListar.classList.remove('active');
                return;
            }

            const dados = botaoEditar.dataset;

            // Guarda para enviar ao backend no momento de finalizar
            enderecoSelecionadoId = dados.nome;

            const nomeEl = document.getElementById('enderecoNome');
            const tipoEl = document.getElementById('enderecoTipo');
            const logradouroEl = document.getElementById('enderecoLogradouro');
            const cepEl = document.getElementById('enderecoCep');

            if (nomeEl) nomeEl.textContent = dados.nome || '';
            if (tipoEl) tipoEl.textContent = dados.tipoResidencia || '';

            if (logradouroEl) {
                logradouroEl.textContent =
                    `${dados.logradouro}, ${dados.numero} - ${dados.bairro}, ${dados.cidade} - ${dados.estado}`;
            }

            if (cepEl) {
                cepEl.textContent = `CEP: ${dados.cep}, ${dados.pais}.`;
            }

            modalListar.classList.remove('active');
        });
    }


    // =========================================================
    // MODAL DE CUPONS
    // =========================================================

    const modalCupons = document.getElementById('modalCupons');
    const btnMeusCupons = document.getElementById('btnMeusCupons');
    const btnFecharModalCupom = document.getElementById('btnFecharModalCupom');

    if (btnMeusCupons && modalCupons) {
        btnMeusCupons.addEventListener('click', (event) => {
            event.preventDefault();
            modalCupons.classList.add('active');
        });
    }

    if (btnFecharModalCupom && modalCupons) {
        btnFecharModalCupom.addEventListener('click', () => modalCupons.classList.remove('active'));
    }

    if (modalCupons) {
        modalCupons.addEventListener('click', (event) => {
            if (event.target === modalCupons) modalCupons.classList.remove('active');
        });
    }


    // =========================================================
    // CUPONS
    // =========================================================

    const cupons = document.querySelectorAll('.checkbox-cupom');
    const cuponsSelecionadosContainer = document.getElementById('cuponsSelecionados');


    function calcularTotalCupons() {

        let total = 0;

        cupons.forEach(cupom => {
            if (!cupom.checked) return;
            total += parseMoeda(cupom.dataset.valor);
        });

        return Number(total.toFixed(2));
    }


    function obterCuponsSelecionados() {
        return Array.from(cupons).filter(cupom => cupom.checked);
    }


    function atualizarResumoValores() {

        const totalPedido = resumoCompra.total;
        const totalCupons = calcularTotalCupons();

        const descontoAplicado = Math.min(totalCupons, totalPedido);
        const valorRestante = Math.max(0, totalPedido - totalCupons);

        if (elementoDesconto) elementoDesconto.textContent = `-${formatarReal(descontoAplicado)}`;
        if (elementoTotal) elementoTotal.textContent = formatarReal(valorRestante);

        atualizarValoresMaximosCartoes();
    }


    function atualizarCuponsSelecionados() {

        if (!cuponsSelecionadosContainer) return;

        cuponsSelecionadosContainer.innerHTML = '';

        cupons.forEach(cupom => {

            if (!cupom.checked) return;

            const codigo = cupom.dataset.codigo;
            const valor = parseMoeda(cupom.dataset.valor);

            const elemento = document.createElement('div');
            elemento.classList.add('cupom-selecionado');

            elemento.innerHTML = `
                <span>${codigo} (${formatarReal(valor)})</span>
                <button type="button" class="remover-cupom" data-codigo="${codigo}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            cuponsSelecionadosContainer.appendChild(elemento);
        });

        document.querySelectorAll('.remover-cupom').forEach(botao => {

            botao.addEventListener('click', () => {

                const codigo = botao.dataset.codigo;

                cupons.forEach(cupom => {
                    if (cupom.dataset.codigo === codigo) cupom.checked = false;
                });

                atualizarCuponsSelecionados();
                atualizarResumoValores();
                validarCartoesEmTempoReal();
            });
        });
    }


    cupons.forEach(cupom => {

        cupom.addEventListener('change', () => {

            // Um único cupom promocional
            if (cupom.dataset.tipo === 'promocional' && cupom.checked) {

                cupons.forEach(outro => {
                    if (outro !== cupom && outro.dataset.tipo === 'promocional' && outro.checked) {
                        outro.checked = false;
                    }
                });
            }

            // Cupom desnecessário (seleção ótima)
            if (cupom.checked) {

                const selecionados = obterCuponsSelecionados();
                const totalPedido = resumoCompra.total;

                const ordenados = [...selecionados].sort(
                    (a, b) => parseMoeda(b.dataset.valor) - parseMoeda(a.dataset.valor)
                );

                let acumulado = 0;
                let necessarios = 0;

                for (const item of ordenados) {
                    acumulado += parseMoeda(item.dataset.valor);
                    necessarios++;
                    if (acumulado >= totalPedido) break;
                }

                if (necessarios < selecionados.length) {
                    cupom.checked = false;
                    mostrarErro('Esse cupom não é necessário para esta compra.');
                }
            }

            atualizarCuponsSelecionados();
            atualizarResumoValores();
            validarCartoesEmTempoReal();
        });
    });


    // =========================================================
    // MODAL DE CARTÃO
    // =========================================================

    const modalCartao = document.getElementById('modalCadastrarCartao');
    const btnAbrirCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');

    // NOVO: container onde os cartões ficam listados (para inserir um novo)
    const listaCartoesContainer = document.querySelector('.titulo-com-link')?.parentElement;

    if (btnAbrirCartao && modalCartao) {
        btnAbrirCartao.addEventListener('click', (event) => {
            event.preventDefault();
            modalCartao.classList.add('active');
        });
    }

    if (btnFecharCartao && modalCartao) {
        btnFecharCartao.addEventListener('click', () => modalCartao.classList.remove('active'));
    }

    if (btnCancelarCartao && modalCartao) {
        btnCancelarCartao.addEventListener('click', () => modalCartao.classList.remove('active'));
    }

    if (modalCartao) {
        modalCartao.addEventListener('click', (event) => {
            if (event.target === modalCartao) modalCartao.classList.remove('active');
        });
    }


    // =========================================================
    // CONFIGURAÇÃO DE UM CARTÃO (checkbox + input de valor)
    //
    // Extraído para função porque agora precisa rodar tanto
    // nos cartões que já vêm do servidor quanto no cartão novo
    // criado dinamicamente após o cadastro no modal.
    // =========================================================

    function configurarInputValorCartao(input) {

        input.type = 'text';
        input.inputMode = 'numeric';
        input.autocomplete = 'off';
        input.removeAttribute('min');
        input.removeAttribute('step');

        input.addEventListener('input', () => {
            aplicarMascaraReal(input);
            validarCartoesEmTempoReal();
        });

        input.addEventListener('blur', () => {

            if (input.value) {
                const valor = obterValorInputCartao(input);
                input.value = formatarReal(valor);
            }

            validarCartoesEmTempoReal();
        });
    }


    function configurarCheckboxCartao(checkbox) {

        checkbox.addEventListener('change', function () {

            const container = this.closest('.cartao-container');
            if (!container) return;

            const inputValor = container.querySelector('.input-valor input');

            if (this.checked) {
                container.classList.add('selecionado');
            } else {
                container.classList.remove('selecionado');
                if (inputValor) inputValor.value = '';
            }

            atualizarValoresMaximosCartoes();
            validarCartoesEmTempoReal();
        });
    }


    function configurarCartaoContainer(container) {

        const checkbox = container.querySelector('.checkbox-cartao');
        const input = container.querySelector('.input-valor input');

        if (checkbox) configurarCheckboxCartao(checkbox);
        if (input) configurarInputValorCartao(input);
    }


    document.querySelectorAll('.cartao-container').forEach(configurarCartaoContainer);


    // =========================================================
    // NOVO: CADASTRAR CARTÃO -> ADICIONAR NA LISTA DE PAGAMENTO
    //
    // Aqui só criamos o cartão na tela (front). O cadastro real
    // (persistir no banco, validar número/bandeira, etc.) tem
    // que ser feito no backend — ver aviso no final do chat.
    // =========================================================

    const formCartao = document.getElementById('formCartao');

    let contadorCartaoNovo = 0;

    if (formCartao) {

        formCartao.addEventListener('submit', (event) => {

            event.preventDefault();

            const numeroCartaoInput = document.getElementById('numeroCartao');
            const nomeCartaoInput = document.getElementById('nomeCartao');
            const bandeiraCartaoInput = document.getElementById('bandeiraCartao');
            const validadeCartaoInput = document.getElementById('validadeCartao');

            const numeroDigitado = (numeroCartaoInput?.value || '').replace(/\s/g, '');
            const ultimosDigitos = numeroDigitado.slice(-4) || '0000';

            contadorCartaoNovo++;
            const idUnico = `novoCartao${contadorCartaoNovo}`;

            const container = document.createElement('div');
            container.className = 'cartao-container';

            container.innerHTML = `
                <label class="cartao">
                    <input type="checkbox" name="cartao" value="${bandeiraCartaoInput?.value || 'cartao'}" class="checkbox-cartao">
                    <div class="dados-cartao">
                        <h3>${bandeiraCartaoInput?.selectedOptions?.[0]?.textContent || 'Cartão'}</h3>
                        <span>**** **** **** ${ultimosDigitos}</span>
                        <span>${nomeCartaoInput?.value || ''}</span>
                        <span>Vencimento: ${validadeCartaoInput?.value || ''}</span>
                    </div>
                </label>
                <div class="campo-valor-cartao">
                    <label for="${idUnico}">Valor a pagar com este cartão</label>
                    <div class="input-valor">
                        <span>R$</span>
                        <input type="number" id="${idUnico}" name="${idUnico}" min="10" step="0.01" placeholder="Digite o valor">
                    </div>
                </div>
            `;

            // Insere o novo cartão logo antes do aviso de valor mínimo,
            // ou no fim do card "Pagamento" caso não encontre a referência.
            const avisoValorMinimo = document.querySelector('.card .aviso');
            if (listaCartoesContainer) {
                listaCartoesContainer.appendChild(container);
            }

            configurarCartaoContainer(container);

            formCartao.reset();
            modalCartao?.classList.remove('active');
            mostrarMensagem('Cartão cadastrado com sucesso!');
        });
    }


    // =========================================================
    // MÁSCARA DE REAL
    // =========================================================

    function aplicarMascaraReal(input) {

        let valor = input.value.replace(/\D/g, '');

        if (!valor) {
            input.value = '';
            return;
        }

        valor = valor.replace(/^0+(?=\d)/, '');

        const numero = parseInt(valor, 10) / 100;

        input.value = formatarReal(numero);
    }


    function obterValorInputCartao(input) {

        if (!input || !input.value) return 0;
        return parseMoeda(input.value);
    }


    // =========================================================
    // VALOR MÁXIMO / MÍNIMO DOS CARTÕES
    // =========================================================

    function calcularValorMaximoCartoes() {

        const totalPedido = resumoCompra.total;
        const totalCupons = calcularTotalCupons();

        return Math.max(0, totalPedido - totalCupons);
    }


    function atualizarValoresMaximosCartoes() {

        const maximo = calcularValorMaximoCartoes();

        document.querySelectorAll('.input-valor input').forEach(input => {

            const container = input.closest('.cartao-container');
            const checkbox = container?.querySelector('.checkbox-cartao');

            if (!checkbox || !checkbox.checked) return;

            input.title = `Valor máximo: ${formatarReal(maximo)}`;
        });
    }


    // =========================================================
    // VALIDAR CARTÕES EM TEMPO REAL
    // =========================================================

    function validarCartoesEmTempoReal() {

        const totalPedido = resumoCompra.total;
        const totalCupons = calcularTotalCupons();
        const valorRestante = Math.max(0, totalPedido - totalCupons);

        const cartoesMarcados = Array.from(document.querySelectorAll('.checkbox-cartao:checked'));

        let valorTotalCartoes = 0;
        let temErro = false;

        document.querySelectorAll('.mensagem-erro-cartao').forEach(mensagem => mensagem.remove());

        cartoesMarcados.forEach(cartao => {

            const container = cartao.closest('.cartao-container');
            if (!container) return;

            const input = container.querySelector('.input-valor input');
            if (!input) return;

            const valor = obterValorInputCartao(input);
            valorTotalCartoes += valor;

            if (valor > valorRestante) {
                mostrarErroNoCartao(container, `O valor máximo permitido neste cartão é ${formatarReal(valorRestante)}.`);
                temErro = true;
                return;
            }

            if (valor > 0 && valor < 10) {

                if (totalCupons === 0) {
                    mostrarErroNoCartao(container, 'O valor mínimo por cartão é R$ 10,00.');
                    temErro = true;
                    return;
                }

                if (valorRestante >= 10) {
                    mostrarErroNoCartao(container, 'O valor mínimo por cartão é R$ 10,00.');
                    temErro = true;
                    return;
                }
                // restante < 10 -> permitido
            }
        });

        if (valorTotalCartoes > valorRestante) {

            const excesso = valorTotalCartoes - valorRestante;
            const ultimo = cartoesMarcados[cartoesMarcados.length - 1];

            if (ultimo) {
                const container = ultimo.closest('.cartao-container');
                if (container) {
                    mostrarErroNoCartao(container, `Os cartões ultrapassam o valor restante em ${formatarReal(excesso)}.`);
                    temErro = true;
                }
            }
        }

        const valorPago = Math.min(totalCupons, totalPedido) + valorTotalCartoes;
        const faltaPagar = Math.max(0, totalPedido - valorPago);

        const avisoPagamento = document.getElementById('avisoPagamentoIncompleto');

        if (avisoPagamento) {

            if (faltaPagar > 0) {
                avisoPagamento.textContent = `Ainda falta pagar ${formatarReal(faltaPagar)}.`;
                avisoPagamento.style.display = 'block';
            } else {
                avisoPagamento.style.display = 'none';
            }
        }

        // NOVO: desabilita o botão de finalizar enquanto houver erro
        // ou pagamento incompleto, em vez de deixar o usuário clicar
        // e só descobrir com o alert().
        atualizarEstadoBotaoFinalizar(temErro || faltaPagar > 0);

        return { valorTotalCartoes, valorRestante, faltaPagar };
    }


    function mostrarErroNoCartao(container, mensagem) {

        if (!container) return;

        let elemento = container.querySelector('.mensagem-erro-cartao');

        if (!elemento) {
            elemento = document.createElement('span');
            elemento.classList.add('mensagem-erro-cartao');
            container.appendChild(elemento);
        }

        elemento.textContent = mensagem;
    }


    // =========================================================
    // NOVO: HABILITAR/DESABILITAR BOTÃO FINALIZAR
    // =========================================================

    function atualizarEstadoBotaoFinalizar(temErro) {

        if (!btnFinalizarCompra) return;

        // Só desabilita se já existe alguma tentativa de pagamento
        // (senão o botão ficaria sempre desabilitado no carregamento
        // inicial da página, antes do usuário mexer em nada).
        const existeAlgumCartaoMarcado =
            document.querySelectorAll('.checkbox-cartao:checked').length > 0;

        btnFinalizarCompra.disabled = temErro && existeAlgumCartaoMarcado;
    }


    // =========================================================
    // VALIDAR TODAS AS REGRAS (validação final ao clicar)
    // =========================================================

    function validarRegrasDeNegocio() {

        const erros = [];

        const totalPedido = resumoCompra.total;
        const cuponsSelecionados = obterCuponsSelecionados();
        const totalCupons = calcularTotalCupons();
        const valorCuponsUtilizado = Math.min(totalCupons, totalPedido);

        const promocionais = cuponsSelecionados.filter(cupom => cupom.dataset.tipo === 'promocional');

        if (promocionais.length > 1) {
            erros.push('Apenas um cupom promocional pode ser utilizado por compra.');
        }

        if (cuponsSelecionados.length > 1) {

            const ordenados = [...cuponsSelecionados].sort(
                (a, b) => parseMoeda(b.dataset.valor) - parseMoeda(a.dataset.valor)
            );

            let acumulado = 0;
            let necessarios = 0;

            for (const cupom of ordenados) {
                acumulado += parseMoeda(cupom.dataset.valor);
                necessarios++;
                if (acumulado >= totalPedido) break;
            }

            if (necessarios < cuponsSelecionados.length) {
                erros.push('Existem cupons selecionados que não são necessários para esta compra.');
            }
        }

        const valorRestante = Math.max(0, totalPedido - totalCupons);

        const cartoesMarcados = Array.from(document.querySelectorAll('.checkbox-cartao:checked'));
        let valorTotalCartoes = 0;

        cartoesMarcados.forEach(cartao => {

            const container = cartao.closest('.cartao-container');
            const input = container?.querySelector('.input-valor input');
            const valor = obterValorInputCartao(input);

            valorTotalCartoes += valor;

            if (valor <= 0) {
                erros.push('Informe o valor de todos os cartões selecionados.');
                return;
            }

            if (valor < 10) {

                if (totalCupons <= 0) {
                    erros.push('O valor mínimo por cartão é R$ 10,00.');
                    return;
                }

                if (valorRestante >= 10) {
                    erros.push('O valor mínimo por cartão é R$ 10,00.');
                    return;
                }
            }
        });

        if (valorTotalCartoes > valorRestante) {
            erros.push(
                `O valor dos cartões (${formatarReal(valorTotalCartoes)}) ` +
                `não pode ser maior que o valor restante (${formatarReal(valorRestante)}).`
            );
        }

        const valorPago = valorCuponsUtilizado + valorTotalCartoes;

        if (valorPago < totalPedido) {
            const falta = totalPedido - valorPago;
            erros.push(`O pagamento está incompleto. Ainda faltam ${formatarReal(falta)}.`);
        }

        const errosUnicos = [...new Set(erros)];

        if (errosUnicos.length > 0) {
            mostrarErro(errosUnicos.join('\n\n'));
            return false;
        }

        if (totalCupons > totalPedido) {
            const valorCupomTroca = totalCupons - totalPedido;
            mostrarMensagem(`Será gerado um cupom de troca de ${formatarReal(valorCupomTroca)}.`);
        }

        return true;
    }


    // =========================================================
    // NOVO: MONTAR PAYLOAD PARA O BACKEND
    //
    // O front só empacota o que o usuário escolheu. Quem decide
    // se está tudo válido "de verdade" (endereço existe, cupom
    // não expirou, cartão passa na operadora) é o Spring.
    // =========================================================

    function montarPayloadCheckout() {

        const cuponsSelecionados = obterCuponsSelecionados()
            .map(cupom => cupom.dataset.codigo);

        const cartoes = Array.from(document.querySelectorAll('.checkbox-cartao:checked'))
            .map(checkbox => {

                const container = checkbox.closest('.cartao-container');
                const input = container?.querySelector('.input-valor input');

                return {
                    identificador: checkbox.value,
                    valor: obterValorInputCartao(input)
                };
            });

        return {
            enderecoId: enderecoSelecionadoId,
            cupons: cuponsSelecionados,
            cartoes
        };
    }


    // =========================================================
    // FINALIZAR COMPRA
    // =========================================================

    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    if (btnFinalizarCompra) {

        btnFinalizarCompra.addEventListener('click', () => {

            if (!validarRegrasDeNegocio()) return;

            const payload = montarPayloadCheckout();

            // TODO (BACKEND): substituir por uma chamada real, ex:
            //
            // fetch('/cliente/checkout/finalizar', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // })
            //     .then(resp => { if (!resp.ok) throw new Error('Falha no pagamento'); return resp.json(); })
            //     .then(() => { window.location.href = '/cliente/pedido'; })
            //     .catch(() => mostrarErro('Não foi possível concluir o pagamento. Tente novamente.'));
            //
            // É no controller que a operadora de cartão (simulada) e a
            // validade real dos cupons devem ser checadas antes de
            // persistir o pedido.
            console.log('Payload que precisa ir para o backend:', payload);

            if (toast) {

                const texto = toast.querySelector('span:last-child');
                if (texto) texto.textContent = 'Pedido feito com sucesso!';

                toast.classList.add('ativo');

                setTimeout(() => {
                    window.location.href = '/cliente/pedido';
                }, 2000);

            } else {
                window.location.href = '/cliente/pedido';
            }
        });
    }


    // =========================================================
    // MÁSCARAS DE ENDEREÇO E CARTÃO CADASTRADO
    // =========================================================

    if (cep) {

        cep.addEventListener('input', () => {

            let valor = cep.value.replace(/\D/g, '');
            valor = valor.substring(0, 8);

            if (valor.length > 5) {
                valor = valor.substring(0, 5) + '-' + valor.substring(5);
            }

            cep.value = valor;
        });
    }

    const numeroCartao = document.getElementById('numeroCartao');
    const cvvCartao = document.getElementById('cvvCartao');
    const validadeCartao = document.getElementById('validadeCartao');

    if (numeroCartao) {

        numeroCartao.addEventListener('input', () => {

            let valor = numeroCartao.value.replace(/\D/g, '');
            valor = valor.substring(0, 16);
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');

            numeroCartao.value = valor;
        });
    }

    if (cvvCartao) {

        cvvCartao.addEventListener('input', () => {
            cvvCartao.value = cvvCartao.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    if (validadeCartao) {

        validadeCartao.addEventListener('input', () => {

            let valor = validadeCartao.value.replace(/\D/g, '');
            valor = valor.substring(0, 4);

            if (valor.length > 2) {
                valor = valor.substring(0, 2) + '/' + valor.substring(2);
            }

            validadeCartao.value = valor;
        });
    }


    // =========================================================
    // INICIALIZAÇÃO
    // =========================================================

    atualizarCuponsSelecionados();
    atualizarResumoValores();
    atualizarValoresMaximosCartoes();
    validarCartoesEmTempoReal();

});