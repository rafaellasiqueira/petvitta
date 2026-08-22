document.addEventListener('DOMContentLoaded', () => {

    let enderecoSelecionadoId = null;
    let contadorCartaoNovo = 0;
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    // ===================== AUXILIARES =====================

    function parseMoeda(valor) {
        if (valor === null || valor === undefined || valor === '') return 0;
        if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0;
        let texto = String(valor).trim().replace(/[^\d,.-]/g, '');
        if (texto.includes(',')) texto = texto.replace(/\./g, '').replace(',', '.');
        const numero = parseFloat(texto);
        return Number.isFinite(numero) ? numero : 0;
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatarReal(valor) {
        return `R$ ${formatarMoeda(valor)}`;
    }

    function mostrarMensagem(mensagem) {
        const toast = document.getElementById('toast');
        if (!toast) { alert(mensagem); return; }
        toast.querySelector('span:last-child').textContent = mensagem;
        toast.classList.add('ativo');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('ativo'), 3000);
    }

    // Erro simples: um alert de uma linha só. Usado só onde não existe campo de erro na tela.
    function mostrarErro(mensagem) {
        alert(mensagem);
    }

    // Erro do CEP: escreve embaixo do campo, não usa alert.
    function mostrarErroCEP(mensagem) {
        const erro = document.getElementById('mensagemErroCEP');
        if (erro) erro.textContent = mensagem;
    }

    function limparErroCEP() {
        mostrarErroCEP('');
    }

    // ===================== RESUMO DA COMPRA =====================

    function lerValorResumo(nome) {
        const linhas = document.querySelectorAll('.linha-resumo');
        for (const linha of linhas) {
            const titulo = linha.querySelector('h3:first-child');
            if (titulo && titulo.textContent.trim().toLowerCase() === nome) {
                return parseMoeda(linha.querySelector('h3:last-child')?.textContent);
            }
        }
        return 0;
    }

    const resumoCompra = {
        get subtotal() { return lerValorResumo('subtotal'); },
        get frete() { return lerValorResumo('frete'); },
        get total() { return Number((this.subtotal + this.frete).toFixed(2)); }
    };

    const elementoDesconto = document.querySelector('.cupom-resumo h3:last-child');
    const elementoTotal = document.querySelector('.linha-total h3:last-child');

    // ===================== MODAIS DE ENDEREÇO =====================

    const modalListar = document.getElementById('modalAlterarEndereco');
    const modalForm = document.getElementById('modalAdicionarEditarEndereco');
    const btnAlterarEndereco = document.getElementById('btnAlterarEndereco');
    const btnFecharListar = document.getElementById('btnFecharModalAlterarEndereco');
    const btnFecharForm = document.getElementById('btnFecharModalEndereco');
    const btnAdicionar = document.getElementById('btnAdicionarEndereco');
    const btnCancelarForm = document.getElementById('btnCancelarEndereco');
    const btnConfirmarEndereco = document.getElementById('btnConfirmarEndereco');
    const btnsEditar = document.querySelectorAll('.editar-endereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloModal = document.getElementById('tituloModalEndereco');

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

    // ===================== VIA CEP =====================

    let buscandoCep = false;

    function formatarCEP(valor) {
        let numeros = String(valor || '').replace(/\D/g, '').substring(0, 8);
        if (numeros.length > 5) numeros = numeros.substring(0, 5) + '-' + numeros.substring(5);
        return numeros;
    }

    function limparCamposViaCEP() {
        if (logradouro) logradouro.value = '';
        if (bairro) bairro.value = '';
        if (cidade) cidade.value = '';
        if (estado) estado.value = '';
    }

    async function buscarCEP() {
        if (!cep) return;
        const cepNumeros = cep.value.replace(/\D/g, '');
        if (cepNumeros.length !== 8 || buscandoCep) return;

        buscandoCep = true;
        limparErroCEP();
        limparCamposViaCEP();

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
            if (!resposta.ok) throw new Error('Falha na consulta.');
            const dados = await resposta.json();

            if (dados.erro) {
                mostrarErroCEP('CEP não encontrado.');
                return;
            }

            if (logradouro) logradouro.value = dados.logradouro || '';
            if (bairro) bairro.value = dados.bairro || '';
            if (cidade) cidade.value = dados.localidade || '';
            if (estado) estado.value = dados.uf || '';
            if (pais) pais.value = 'Brasil';

        } catch (erro) {
            mostrarErroCEP('Não foi possível consultar o CEP.');
        } finally {
            buscandoCep = false;
        }
    }

    if (cep) {
        cep.addEventListener('input', () => {
            cep.value = formatarCEP(cep.value);
            limparErroCEP();
            if (cep.value.replace(/\D/g, '').length < 8) limparCamposViaCEP();
            if (cep.value.replace(/\D/g, '').length === 8) buscarCEP();
        });

        cep.addEventListener('blur', () => {
            const qtd = cep.value.replace(/\D/g, '').length;
            if (qtd > 0 && qtd !== 8) mostrarErroCEP('CEP deve ter 8 números.');
        });
    }

    // ===================== FORMULÁRIO DE ENDEREÇO =====================

    function limparFormularioEndereco() {
        if (!formEndereco) return;
        formEndereco.reset();
        limparErroCEP();
        if (pais) pais.value = 'Brasil';
        if (salvarPerfil) salvarPerfil.checked = false;
    }

    function fecharModalFormEndereco() {
        modalForm?.classList.remove('active');
        modalListar?.classList.add('active');
    }

    if (btnAlterarEndereco && modalListar) {
        btnAlterarEndereco.addEventListener('click', (e) => {
            e.preventDefault();
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
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const d = botao.dataset;
            limparErroCEP();
            if (nomeIdentificacao) nomeIdentificacao.value = d.nome || '';
            if (tipoEndereco) tipoEndereco.value = d.tipoEndereco || '';
            if (tipoResidencia) tipoResidencia.value = d.tipoResidencia || '';
            if (tipoLogradouro) tipoLogradouro.value = d.tipoLogradouro || '';
            if (cep) cep.value = formatarCEP(d.cep || '');
            if (logradouro) logradouro.value = d.logradouro || '';
            if (bairro) bairro.value = d.bairro || '';
            if (numero) numero.value = d.numero || '';
            if (estado) estado.value = d.estado || '';
            if (cidade) cidade.value = d.cidade || '';
            if (pais) pais.value = d.pais || 'Brasil';
            if (observacoes) observacoes.value = d.observacoes || '';
            if (salvarPerfil) salvarPerfil.checked = false;
            if (campoSalvarPerfil) campoSalvarPerfil.style.display = 'none';
            if (tituloModal) tituloModal.textContent = 'Editar endereço';
            const btnSalvar = document.getElementById('btnSalvarEndereco');
            if (btnSalvar) btnSalvar.textContent = 'Salvar';
            modalListar?.classList.remove('active');
            modalForm?.classList.add('active');
        });
    });

    if (btnFecharListar) btnFecharListar.addEventListener('click', () => modalListar?.classList.remove('active'));
    if (btnFecharForm) btnFecharForm.addEventListener('click', fecharModalFormEndereco);
    if (btnCancelarForm) btnCancelarForm.addEventListener('click', fecharModalFormEndereco);

    function validarEndereco() {
        const cepNumeros = cep?.value.replace(/\D/g, '') || '';
        if (!nomeIdentificacao?.value.trim()) return 'Informe o nome de identificação.';
        if (!tipoEndereco?.value) return 'Selecione o tipo de endereço.';
        if (!tipoResidencia?.value) return 'Selecione o tipo de residência.';
        if (!tipoLogradouro?.value) return 'Selecione o tipo de logradouro.';
        if (cepNumeros.length !== 8) return 'Informe um CEP válido.';
        if (!logradouro?.value.trim()) return 'Informe o logradouro.';
        if (!bairro?.value.trim()) return 'Informe o bairro.';
        if (!numero?.value.trim()) return 'Informe o número.';
        if (!estado?.value) return 'Informe o estado.';
        if (!cidade?.value.trim()) return 'Informe a cidade.';
        if (!pais?.value.trim()) return 'Informe o país.';
        return null;
    }

    if (formEndereco) {
        formEndereco.addEventListener('submit', (e) => {
            e.preventDefault();
            const erro = validarEndereco();
            if (erro) { mostrarErro(erro); return; }
            if (buscandoCep) { mostrarErro('Aguarde a consulta do CEP terminar.'); return; }
            mostrarMensagem('Endereço salvo com sucesso!');
            modalForm?.classList.remove('active');
            modalListar?.classList.add('active');
        });
    }

    if (btnConfirmarEndereco && modalListar) {
        btnConfirmarEndereco.addEventListener('click', () => {
            const radio = modalListar.querySelector('input[name="endereco"]:checked');
            if (!radio) { mostrarErro('Selecione um endereço.'); return; }

            const item = radio.closest('.modalEndereco');
            const botaoEditar = item?.querySelector('.editar-endereco');
            if (!botaoEditar) { mostrarErro('Não foi possível obter os dados do endereço.'); return; }

            const d = botaoEditar.dataset;
            enderecoSelecionadoId = d.id || d.nome;

            const nomeEl = document.getElementById('enderecoNome');
            const tipoEl = document.getElementById('enderecoTipo');
            const logradouroEl = document.getElementById('enderecoLogradouro');
            const cepEl = document.getElementById('enderecoCep');

            if (nomeEl) nomeEl.textContent = d.nome || '';
            if (tipoEl) tipoEl.textContent = d.tipoResidencia || '';
            if (logradouroEl) logradouroEl.textContent = `${d.logradouro || ''}, ${d.numero || ''} - ${d.bairro || ''}, ${d.cidade || ''} - ${d.estado || ''}`;
            if (cepEl) cepEl.textContent = `CEP: ${d.cep || ''}, ${d.pais || 'Brasil'}.`;

            modalListar.classList.remove('active');
        });
    }

    // ===================== MODAL DE CUPONS =====================

    const modalCupons = document.getElementById('modalCupons');
    const btnMeusCupons = document.getElementById('btnMeusCupons');
    const btnFecharModalCupom = document.getElementById('btnFecharModalCupom');

    if (btnMeusCupons && modalCupons) {
        btnMeusCupons.addEventListener('click', (e) => { e.preventDefault(); modalCupons.classList.add('active'); });
    }
    if (btnFecharModalCupom && modalCupons) {
        btnFecharModalCupom.addEventListener('click', () => modalCupons.classList.remove('active'));
    }
    if (modalCupons) {
        modalCupons.addEventListener('click', (e) => { if (e.target === modalCupons) modalCupons.classList.remove('active'); });
    }

    // ===================== CUPONS =====================

    const cupons = document.querySelectorAll('.checkbox-cupom');
    const cuponsSelecionadosContainer = document.getElementById('cuponsSelecionados');

    function obterCuponsSelecionados() {
        return Array.from(cupons).filter(c => c.checked);
    }

    function calcularTotalCupons() {
        return Number(obterCuponsSelecionados().reduce((t, c) => t + parseMoeda(c.dataset.valor), 0).toFixed(2));
    }

    // Quantos cupons (do maior pro menor) são realmente necessários pra cobrir a compra.
    function cuponsNecessarios(selecionados, totalPedido) {
        const ordenados = [...selecionados].sort((a, b) => parseMoeda(b.dataset.valor) - parseMoeda(a.dataset.valor));
        let acumulado = 0, necessarios = 0;
        for (const cupom of ordenados) {
            acumulado += parseMoeda(cupom.dataset.valor);
            necessarios++;
            if (acumulado >= totalPedido) break;
        }
        return necessarios;
    }

    function atualizarCuponsSelecionados() {
        if (!cuponsSelecionadosContainer) return;
        cuponsSelecionadosContainer.innerHTML = '';

        obterCuponsSelecionados().forEach(cupom => {
            const codigo = cupom.dataset.codigo || '';
            const valor = parseMoeda(cupom.dataset.valor);

            const elemento = document.createElement('div');
            elemento.classList.add('cupom-selecionado');
            elemento.innerHTML = `<span>${codigo} (${formatarReal(valor)})</span><button type="button" class="remover-cupom" data-codigo="${codigo}"><i class="fa-solid fa-xmark"></i></button>`;
            cuponsSelecionadosContainer.appendChild(elemento);
        });

        document.querySelectorAll('.remover-cupom').forEach(botao => {
            botao.addEventListener('click', () => {
                cupons.forEach(c => { if (c.dataset.codigo === botao.dataset.codigo) c.checked = false; });
                atualizarCuponsSelecionados();
                atualizarResumoValores();
                validarCartoesEmTempoReal();
            });
        });
    }

    cupons.forEach(cupom => {
        cupom.addEventListener('change', () => {

            // Regra: só 1 cupom promocional. Desmarca o anterior direto, sem alert.
            if (cupom.checked && cupom.dataset.tipo === 'promocional') {
                cupons.forEach(outro => {
                    if (outro !== cupom && outro.dataset.tipo === 'promocional' && outro.checked) outro.checked = false;
                });
            }

            // Regra: não deixa usar mais cupons do que o necessário pra cobrir a compra.
            if (cupom.checked) {
                const selecionados = obterCuponsSelecionados();
                const necessarios = cuponsNecessarios(selecionados, resumoCompra.total);

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

    function atualizarResumoValores() {
        const totalPedido = resumoCompra.total;
        const totalCupons = calcularTotalCupons();
        const descontoAplicado = Math.min(totalCupons, totalPedido);
        const valorRestante = Math.max(0, totalPedido - totalCupons);

        if (elementoDesconto) elementoDesconto.textContent = `-${formatarReal(descontoAplicado)}`;
        if (elementoTotal) elementoTotal.textContent = formatarReal(valorRestante);
        atualizarValoresMaximosCartoes();
    }

    // ===================== MODAL DE CARTÃO =====================

    const modalCartao = document.getElementById('modalCadastrarCartao');
    const btnAbrirCartao = document.getElementById('btnAbrirCartao');
    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    const listaCartoesContainer = document.querySelector('.titulo-com-link')?.parentElement;

    if (btnAbrirCartao && modalCartao) {
        btnAbrirCartao.addEventListener('click', (e) => { e.preventDefault(); modalCartao.classList.add('active'); });
    }
    if (btnFecharCartao && modalCartao) btnFecharCartao.addEventListener('click', () => modalCartao.classList.remove('active'));
    if (btnCancelarCartao && modalCartao) btnCancelarCartao.addEventListener('click', () => modalCartao.classList.remove('active'));
    if (modalCartao) {
        modalCartao.addEventListener('click', (e) => { if (e.target === modalCartao) modalCartao.classList.remove('active'); });
    }

    function aplicarMascaraReal(input) {
        let valor = input.value.replace(/\D/g, '');
        if (!valor) { input.value = ''; return; }
        valor = valor.replace(/^0+(?=\d)/, '');
        input.value = formatarReal(parseInt(valor, 10) / 100);
    }

    function obterValorInputCartao(input) {
        return input && input.value ? parseMoeda(input.value) : 0;
    }

    function configurarInputValorCartao(input) {
        input.type = 'text';
        input.inputMode = 'numeric';
        input.autocomplete = 'off';
        input.removeAttribute('min');
        input.removeAttribute('step');

        input.addEventListener('input', () => { aplicarMascaraReal(input); validarCartoesEmTempoReal(); });
        input.addEventListener('blur', () => {
            if (input.value) input.value = formatarReal(obterValorInputCartao(input));
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

    function validarValidadeCartao(valor) {
        if (!/^\d{2}\/\d{2}$/.test(valor)) return false;
        const [mesStr, anoStr] = valor.split('/');
        const mes = parseInt(mesStr, 10);
        const ano = parseInt(anoStr, 10);
        if (mes < 1 || mes > 12) return false;

        const agora = new Date();
        const anoAtual = agora.getFullYear() % 100;
        const mesAtual = agora.getMonth() + 1;
        if (ano < anoAtual) return false;
        if (ano === anoAtual && mes < mesAtual) return false;
        return true;
    }

    const formCartao = document.getElementById('formCartao');

    if (formCartao) {
        formCartao.addEventListener('submit', (e) => {
            e.preventDefault();

            const numeroInput = document.getElementById('numeroCartao');
            const nomeInput = document.getElementById('nomeCartao');
            const bandeiraInput = document.getElementById('bandeiraCartao');
            const validadeInput = document.getElementById('validadeCartao');
            const cvvInput = document.getElementById('cvvCartao');

            const numeroDigitado = (numeroInput?.value || '').replace(/\D/g, '');

            if (numeroDigitado.length !== 16) { mostrarErro('Informe um número de cartão com 16 dígitos.'); return; }
            if (!nomeInput?.value.trim()) { mostrarErro('Informe o nome impresso no cartão.'); return; }
            if (!bandeiraInput?.value) { mostrarErro('Selecione a bandeira do cartão.'); return; }
            if (!validarValidadeCartao(validadeInput?.value || '')) { mostrarErro('Informe uma validade de cartão válida.'); return; }
            if (!/^\d{3,4}$/.test(cvvInput?.value || '')) { mostrarErro('Informe um CVV válido.'); return; }

            const ultimosDigitos = numeroDigitado.slice(-4);
            contadorCartaoNovo++;
            const idUnico = `novoCartao${contadorCartaoNovo}`;
            const bandeiraTexto = bandeiraInput.selectedOptions?.[0]?.textContent || 'Cartão';

            const container = document.createElement('div');
            container.className = 'cartao-container';
            container.innerHTML = `
                <label class="cartao">
                    <input type="checkbox" name="cartao" value="${bandeiraInput.value}" class="checkbox-cartao">
                    <div class="dados-cartao">
                        <h3>${bandeiraTexto}</h3>
                        <span>**** **** **** ${ultimosDigitos}</span>
                        <span>${nomeInput.value}</span>
                        <span>Vencimento: ${validadeInput.value}</span>
                    </div>
                </label>
                <div class="campo-valor-cartao">
                    <label for="${idUnico}">Valor a pagar com este cartão</label>
                    <div class="input-valor">
                        <span>R$</span>
                        <input type="text" id="${idUnico}" name="${idUnico}" inputmode="numeric" autocomplete="off" placeholder="Digite o valor">
                    </div>
                </div>`;

            listaCartoesContainer?.appendChild(container);
            configurarCartaoContainer(container);
            formCartao.reset();
            modalCartao?.classList.remove('active');
            mostrarMensagem('Cartão cadastrado com sucesso!');
        });
    }

    const numeroCartao = document.getElementById('numeroCartao');
    const cvvCartao = document.getElementById('cvvCartao');
    const validadeCartao = document.getElementById('validadeCartao');

    if (numeroCartao) {
        numeroCartao.addEventListener('input', () => {
            let v = numeroCartao.value.replace(/\D/g, '').substring(0, 16);
            numeroCartao.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }

    if (cvvCartao) {
        cvvCartao.addEventListener('input', () => { cvvCartao.value = cvvCartao.value.replace(/\D/g, '').substring(0, 4); });
    }

    if (validadeCartao) {
        validadeCartao.addEventListener('input', () => {
            let v = validadeCartao.value.replace(/\D/g, '').substring(0, 4);
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            validadeCartao.value = v;
        });
        validadeCartao.addEventListener('blur', () => {
            if (validadeCartao.value && !validarValidadeCartao(validadeCartao.value)) mostrarErro('Validade do cartão inválida ou vencida.');
        });
    }

    // ===================== VALOR MÁXIMO DOS CARTÕES =====================

    function calcularValorMaximoCartoes() {
        return Math.max(0, resumoCompra.total - calcularTotalCupons());
    }

    function atualizarValoresMaximosCartoes() {
        const maximo = calcularValorMaximoCartoes();
        document.querySelectorAll('.input-valor input').forEach(input => {
            const checkbox = input.closest('.cartao-container')?.querySelector('.checkbox-cartao');
            if (checkbox?.checked) input.title = `Valor máximo: ${formatarReal(maximo)}`;
        });
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

    // ===================== VALIDAR CARTÕES EM TEMPO REAL =====================

    function validarCartoesEmTempoReal() {
        const totalPedido = resumoCompra.total;
        const totalCupons = calcularTotalCupons();
        const valorRestante = Math.max(0, totalPedido - totalCupons);
        const cartoesMarcados = Array.from(document.querySelectorAll('.checkbox-cartao:checked'));

        let valorTotalCartoes = 0;
        let temErro = false;

        document.querySelectorAll('.mensagem-erro-cartao').forEach(m => m.remove());

        cartoesMarcados.forEach(cartao => {
            const container = cartao.closest('.cartao-container');
            const input = container?.querySelector('.input-valor input');
            if (!input) return;

            const valor = obterValorInputCartao(input);
            valorTotalCartoes += valor;

            if (valor <= 0) {
                mostrarErroNoCartao(container, 'Informe o valor deste cartão.');
                temErro = true;
                return;
            }

            if (valor > valorRestante) {
                mostrarErroNoCartao(container, `Valor máximo: ${formatarReal(valorRestante)}.`);
                temErro = true;
                return;
            }

            // Mínimo de R$ 10 por cartão, exceto se cupom + cartão juntos e o restante for menor que R$ 10.
            if (valor < 10 && (totalCupons === 0 || valorRestante >= 10)) {
                mostrarErroNoCartao(container, 'O valor mínimo por cartão é R$ 10,00.');
                temErro = true;
            }
        });

        if (valorTotalCartoes > valorRestante) {
            const excesso = valorTotalCartoes - valorRestante;
            const ultimo = cartoesMarcados[cartoesMarcados.length - 1];
            const container = ultimo?.closest('.cartao-container');
            if (container) mostrarErroNoCartao(container, `Cartões ultrapassam o restante em ${formatarReal(excesso)}.`);
            temErro = true;
        }

        const valorPago = Math.min(totalCupons, totalPedido) + valorTotalCartoes;
        const faltaPagar = Math.max(0, totalPedido - valorPago);

        const aviso = document.getElementById('avisoPagamentoIncompleto');
        if (aviso) {
            aviso.style.display = faltaPagar > 0 ? 'block' : 'none';
            aviso.textContent = faltaPagar > 0 ? `Ainda falta pagar ${formatarReal(faltaPagar)}.` : '';
        }

        atualizarEstadoBotaoFinalizar(temErro, faltaPagar);
        return { valorTotalCartoes, valorRestante, faltaPagar, temErro };
    }

    function atualizarEstadoBotaoFinalizar(temErro, faltaPagar) {
        if (!btnFinalizarCompra) return;
        const existeCartao = document.querySelectorAll('.checkbox-cartao:checked').length > 0;
        btnFinalizarCompra.disabled = existeCartao && (temErro || faltaPagar > 0);
    }

    // ===================== VALIDAÇÃO FINAL =====================

    function validarRegrasDeNegocio() {
        const totalPedido = resumoCompra.total;
        const cuponsSelecionados = obterCuponsSelecionados();
        const totalCupons = calcularTotalCupons();
        const valorCuponsUtilizado = Math.min(totalCupons, totalPedido);

        const promocionais = cuponsSelecionados.filter(c => c.dataset.tipo === 'promocional');
        if (promocionais.length > 1) { mostrarErro('Apenas um cupom promocional pode ser utilizado.'); return false; }

        if (cuponsSelecionados.length > 0) {
            const necessarios = cuponsNecessarios(cuponsSelecionados, totalPedido);
            if (necessarios < cuponsSelecionados.length) { mostrarErro('Existem cupons desnecessários selecionados.'); return false; }
        }

        const valorRestante = Math.max(0, totalPedido - totalCupons);
        const cartoesMarcados = Array.from(document.querySelectorAll('.checkbox-cartao:checked'));
        let valorTotalCartoes = 0;

        for (const cartao of cartoesMarcados) {
            const container = cartao.closest('.cartao-container');
            const input = container?.querySelector('.input-valor input');
            const valor = obterValorInputCartao(input);
            valorTotalCartoes += valor;

            if (valor <= 0) { mostrarErro('Informe o valor de todos os cartões selecionados.'); return false; }
            if (valor > valorRestante) { mostrarErro(`Um cartão não pode passar de ${formatarReal(valorRestante)}.`); return false; }
            if (valor < 10 && (totalCupons <= 0 || valorRestante >= 10)) { mostrarErro('O valor mínimo por cartão é R$ 10,00.'); return false; }
        }

        if (valorTotalCartoes > valorRestante) { mostrarErro('O valor dos cartões passa do valor restante.'); return false; }

        const valorPago = valorCuponsUtilizado + valorTotalCartoes;
        if (valorPago < totalPedido) { mostrarErro(`Ainda faltam ${formatarReal(totalPedido - valorPago)}.`); return false; }

        if (totalCupons > totalPedido) mostrarMensagem(`Será gerado um cupom de troca de ${formatarReal(totalCupons - totalPedido)}.`);

        return true;
    }

    function montarPayloadCheckout() {
        const cuponsSelecionados = obterCuponsSelecionados().map(c => c.dataset.codigo);
        const cartoes = Array.from(document.querySelectorAll('.checkbox-cartao:checked')).map(checkbox => {
            const input = checkbox.closest('.cartao-container')?.querySelector('.input-valor input');
            return { identificador: checkbox.value, valor: obterValorInputCartao(input) };
        });
        return { enderecoId: enderecoSelecionadoId, cupons: cuponsSelecionados, cartoes };
    }

    // ===================== FINALIZAR COMPRA =====================

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', () => {
            if (!validarRegrasDeNegocio()) return;
            if (!enderecoSelecionadoId) { mostrarErro('Selecione um endereço para continuar.'); return; }

            const payload = montarPayloadCheckout();
            console.log('Payload do checkout:', payload);

            // TODO (BACKEND): enviar payload para POST /cliente/checkout/finalizar
            // e validar tudo de novo no servidor antes de confirmar o pedido.

            const toast = document.getElementById('toast');
            if (toast) {
                toast.querySelector('span:last-child').textContent = 'Pedido feito com sucesso!';
                toast.classList.add('ativo');
                setTimeout(() => { window.location.href = '/cliente/pedido'; }, 2000);
            } else {
                window.location.href = '/cliente/pedido';
            }
        });
    }

    // ===================== INICIALIZAÇÃO =====================

    atualizarCuponsSelecionados();
    atualizarResumoValores();
    atualizarValoresMaximosCartoes();
    validarCartoesEmTempoReal();

});