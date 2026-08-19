document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // MODAIS DE ENDEREÇO
    // =====================================================

    const modalListar =
        document.getElementById('modalAlterarEndereco');

    const modalForm =
        document.getElementById('modalAdicionarEditarEndereco');


    // =====================================================
    // BOTÕES DE ENDEREÇO
    // =====================================================

    const btnAlterarEndereco =
        document.getElementById('btnAlterarEndereco');

    const btnFecharListar =
        document.getElementById('btnFecharModalAlterarEndereco');

    const btnFecharForm =
        document.getElementById('btnFecharModalEndereco');

    const btnAdicionar =
        document.getElementById('btnAdicionarEndereco');

    const btnCancelarForm =
        document.getElementById('btnCancelarEndereco');

    const btnsEditar =
        document.querySelectorAll('.editar-endereco');


    // =====================================================
    // CAMPOS DE ENDEREÇO
    // =====================================================

    const formEndereco =
        document.getElementById('formEndereco');

    const tituloModal =
        document.getElementById('tituloModalEndereco');

    const nomeIdentificacao =
        document.getElementById('nomeIdentificacao');

    const tipoEndereco =
        document.getElementById('tipoEndereco');

    const tipoResidencia =
        document.getElementById('tipoResidencia');

    const tipoLogradouro =
        document.getElementById('tipoLogradouro');

    const cep =
        document.getElementById('cep');

    const logradouro =
        document.getElementById('logradouro');

    const bairro =
        document.getElementById('bairro');

    const numero =
        document.getElementById('numero');

    const estado =
        document.getElementById('estado');

    const cidade =
        document.getElementById('cidade');

    const pais =
        document.getElementById('pais');

    const observacoes =
        document.getElementById('observacoes');

    const salvarPerfil =
        document.getElementById('salvarPerfil');

    const campoSalvarPerfil =
        document.getElementById('campoSalvarPerfil');


    // =====================================================
    // LIMPAR FORMULÁRIO DE ENDEREÇO
    // =====================================================

    function limparFormulario() {

        if (!formEndereco) return;

        formEndereco.reset();

        nomeIdentificacao.value = '';

        tipoEndereco.value = '';
        tipoResidencia.value = '';
        tipoLogradouro.value = '';

        cep.value = '';
        logradouro.value = '';
        bairro.value = '';
        numero.value = '';

        estado.value = '';
        cidade.value = '';

        pais.value = 'Brasil';

        observacoes.value = '';

        salvarPerfil.checked = false;
    }


    // =====================================================
    // ABRIR FORMULÁRIO DE ENDEREÇO
    // =====================================================

    function abrirModalForm(titulo) {

        tituloModal.textContent = titulo;

        modalListar.classList.remove('active');

        modalForm.classList.add('active');
    }


    // =====================================================
    // FECHAR FORMULÁRIO DE ENDEREÇO
    // =====================================================

    function fecharModalForm() {

        modalForm.classList.remove('active');

        modalListar.classList.add('active');
    }


    // =====================================================
    // ALTERAR ENDEREÇO
    // =====================================================

    if (btnAlterarEndereco) {

        btnAlterarEndereco.addEventListener('click', (e) => {

            e.preventDefault();

            modalListar.classList.add('active');

        });

    }


    // =====================================================
    // ADICIONAR ENDEREÇO
    // =====================================================

    if (btnAdicionar) {

        btnAdicionar.addEventListener('click', () => {

            limparFormulario();

            tituloModal.textContent = 'Adicionar endereço';

            campoSalvarPerfil.style.display = 'flex';

            document.getElementById('btnSalvarEndereco').textContent =
                'Adicionar';

            modalListar.classList.remove('active');

            modalForm.classList.add('active');

        });

    }


    // =====================================================
    // EDITAR ENDEREÇO
    // =====================================================

    btnsEditar.forEach(btn => {

        btn.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();

            const dados = btn.dataset;


            nomeIdentificacao.value =
                dados.nome || '';

            tipoEndereco.value =
                dados.tipoEndereco || '';

            tipoResidencia.value =
                dados.tipoResidencia || '';

            tipoLogradouro.value =
                dados.tipoLogradouro || '';

            cep.value =
                dados.cep || '';

            logradouro.value =
                dados.logradouro || '';

            bairro.value =
                dados.bairro || '';

            numero.value =
                dados.numero || '';

            estado.value =
                dados.estado || '';

            cidade.value =
                dados.cidade || '';

            pais.value =
                dados.pais || 'Brasil';

            observacoes.value =
                dados.observacoes || '';


            // Checkbox
            salvarPerfil.checked = false;

            campoSalvarPerfil.style.display = 'none';


            // Título
            tituloModal.textContent =
                'Editar endereço';


            // Botão
            document.getElementById('btnSalvarEndereco').textContent =
                'Salvar';


            // Abre modal
            modalListar.classList.remove('active');

            modalForm.classList.add('active');

        });

    });


    // =====================================================
    // FECHAR LISTA DE ENDEREÇOS
    // =====================================================

    if (btnFecharListar) {

        btnFecharListar.addEventListener('click', () => {

            modalListar.classList.remove('active');

        });

    }


    // =====================================================
    // FECHAR FORMULÁRIO DE ENDEREÇO
    // =====================================================

    if (btnFecharForm) {

        btnFecharForm.addEventListener(
            'click',
            fecharModalForm
        );

    }


    // =====================================================
    // CANCELAR ENDEREÇO
    // =====================================================

    if (btnCancelarForm) {

        btnCancelarForm.addEventListener(
            'click',
            fecharModalForm
        );

    }


    // =====================================================
    // MODAL DE CUPONS
    // =====================================================

    const modalCupons =
        document.getElementById('modalCupons');

    const btnMeusCupons =
        document.getElementById('btnMeusCupons');

    const btnFecharModalCupom =
        document.getElementById('btnFecharModalCupom');


    // Abrir cupons
    if (btnMeusCupons && modalCupons) {

        btnMeusCupons.addEventListener('click', (e) => {

            e.preventDefault();

            modalCupons.classList.add('active');

        });

    }


    // Fechar cupons
    if (btnFecharModalCupom && modalCupons) {

        btnFecharModalCupom.addEventListener('click', () => {

            modalCupons.classList.remove('active');

        });

    }


    // =====================================================
    // SELEÇÃO DE CUPONS
    // =====================================================

    const cupons =
        document.querySelectorAll('.checkbox-cupom');

    const cuponsSelecionados =
        document.getElementById('cuponsSelecionados');


    function atualizarCuponsSelecionados() {

        // Limpa a área
        cuponsSelecionados.innerHTML = '';

        // Procura os cupons marcados
        cupons.forEach(cupom => {

            if (cupom.checked) {

                // Pega o código do cupom
                const codigo =
                    cupom.dataset.codigo;

                // Cria o elemento
                const cupomSelecionado =
                    document.createElement('div');

                cupomSelecionado.classList.add(
                    'cupom-selecionado'
                );

                cupomSelecionado.innerHTML = `
                    <span>${codigo}</span>

                    <button type="button"
                            class="remover-cupom"
                            data-codigo="${codigo}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;

                cuponsSelecionados.appendChild(
                    cupomSelecionado
                );

            }

        });

        // Botões para remover cupom
        const botoesRemover =
            document.querySelectorAll('.remover-cupom');

        botoesRemover.forEach(botao => {

            botao.addEventListener('click', () => {

                const codigo =
                    botao.dataset.codigo;

                // Procura o checkbox correspondente
                cupons.forEach(cupom => {

                    if (cupom.dataset.codigo === codigo) {

                        cupom.checked = false;

                    }

                });

                atualizarCuponsSelecionados();

            });

        });

    }


    // =====================================================
    // QUANDO UM CUPOM FOR SELECIONADO
    // =====================================================

    cupons.forEach(cupom => {

        cupom.addEventListener('change', () => {

            // Se for promocional
            if (
                cupom.dataset.tipo === 'promocional' &&
                cupom.checked
            ) {

                // Desmarca outros promocionais
                cupons.forEach(outroCupom => {

                    if (
                        outroCupom !== cupom &&
                        outroCupom.dataset.tipo === 'promocional'
                    ) {

                        outroCupom.checked = false;

                    }

                });

            }

            // Atualiza os cupons exibidos
            atualizarCuponsSelecionados();

        });

    });


    // =====================================================
    // MODAL DE CARTÃO
    // =====================================================

    const modalCartao =
        document.getElementById('modalCadastrarCartao');

    const btnAbrirCartao =
        document.getElementById('btnAbrirCartao');

    const btnFecharCartao =
        document.getElementById('btnFecharModalCartao');

    const btnCancelarCartao =
        document.getElementById('btnCancelarCartao');


    // =====================================================
    // ABRIR MODAL DE CARTÃO
    // =====================================================

    if (btnAbrirCartao && modalCartao) {

        btnAbrirCartao.addEventListener('click', (e) => {

            e.preventDefault();

            modalCartao.classList.add('active');

        });

    }


    // =====================================================
    // FECHAR MODAL DE CARTÃO PELO X
    // =====================================================

    if (btnFecharCartao && modalCartao) {

        btnFecharCartao.addEventListener('click', () => {

            modalCartao.classList.remove('active');

        });

    }


    // =====================================================
    // FECHAR MODAL DE CARTÃO PELO CANCELAR
    // =====================================================

    if (btnCancelarCartao && modalCartao) {

        btnCancelarCartao.addEventListener('click', () => {

            modalCartao.classList.remove('active');

        });

    }


    // =====================================================
    // FECHAR MODAL DE CARTÃO CLICANDO FORA
    // =====================================================

    if (modalCartao) {

        modalCartao.addEventListener('click', (event) => {

            if (event.target === modalCartao) {

                modalCartao.classList.remove('active');

            }

        });

    }

    const checkboxesCartao = document.querySelectorAll('.checkbox-cartao');

    checkboxesCartao.forEach(checkbox => {

        checkbox.addEventListener('change', function () {

            const container = this.closest('.cartao-container');

            if (this.checked) {
                container.classList.add('selecionado');
            } else {
                container.classList.remove('selecionado');

                const inputValor = container.querySelector('.input-valor input');

                if (inputValor) {
                    inputValor.value = '';
                }
            }

        });

    });

});

// =====================================================
// FINALIZAR COMPRA
// =====================================================

const btnFinalizarCompra =
    document.getElementById('btnFinalizarCompra');

const toast =
    document.getElementById('toast');


if (btnFinalizarCompra && toast) {

    btnFinalizarCompra.addEventListener('click', () => {

        // Mostra o toast
        toast.classList.add('ativo');

        // Aguarda o toast aparecer
        setTimeout(() => {

            // Redireciona para a página de pedidos
            window.location.href = '/cliente/pedido';

        }, 2000);

    });

}