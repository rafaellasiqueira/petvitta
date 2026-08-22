document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // ELEMENTOS DOS FILTROS
    // =========================================================

    const btnFiltro = document.getElementById('btnfiltrar');
    const painelFiltro = document.getElementById('painelFiltro');
    const btnLimpar = document.getElementById('btnLimparFiltro');


    if (btnFiltro && painelFiltro) {

        btnFiltro.addEventListener('click', () => {
            painelFiltro.classList.toggle('hidden');
        });
    }


    if (btnLimpar && painelFiltro) {

        btnLimpar.addEventListener('click', () => {
            painelFiltro.reset();
        });
    }


    // =========================================================
    // BUSCA POR NOME
    // =========================================================

    const inputPesquisa = document.getElementById('inputPesquisa');
    const linhasTabela = document.querySelectorAll('tbody tr');


    if (inputPesquisa) {

        inputPesquisa.addEventListener('input', () => {

            const texto = inputPesquisa.value.toLowerCase().trim();

            linhasTabela.forEach((linha) => {

                const nome = linha.children[1]?.textContent.toLowerCase().trim();

                linha.style.display = (nome && nome.includes(texto)) ? '' : 'none';
            });
        });
    }


    // =========================================================
    // PAGINAÇÃO VISUAL
    // =========================================================

    const paginas = document.querySelectorAll('.paginacao-item');

    paginas.forEach((pagina) => {

        pagina.addEventListener('click', () => {
            paginas.forEach((item) => item.classList.remove('active'));
            pagina.classList.add('active');
        });
    });


    // =========================================================
    // INATIVAR / ATIVAR CLIENTE
    // =========================================================

    const modalInativar = document.getElementById('modalInativarCliente');
    const modalAtivar = document.getElementById('modalAtivarCliente');

    const formInativar = document.getElementById('formInativarCliente');
    const formAtivar = document.getElementById('formAtivarCliente');

    const btnFecharModalInativar =
        document.getElementById('btnFecharModalInativar');

    const btnCancelarInativar =
        document.getElementById('btnCancelarInativar');

    const btnFecharModalAtivar =
        document.getElementById('btnFecharModalAtivar');

    const btnCancelarAtivar =
        document.getElementById('btnCancelarAtivar');


    // Guarda o botão que foi clicado
    let botaoAlvo = null;


    // =========================================================
    // FECHAR MODAIS
    // =========================================================

    function fecharModalInativar() {

        if (modalInativar) {
            modalInativar.classList.remove('active');
        }

        if (formInativar) {
            formInativar.reset();
        }

        botaoAlvo = null;
    }


    function fecharModalAtivar() {

        if (modalAtivar) {
            modalAtivar.classList.remove('active');
        }

        if (formAtivar) {
            formAtivar.reset();
        }

        botaoAlvo = null;
    }


    // =========================================================
    // CONFIGURAR BOTÕES DE STATUS
    // =========================================================

    function configurarBotoesStatus() {

        // ---------------------------------------------------------
        // BOTÃO INATIVAR
        // ---------------------------------------------------------

        document.querySelectorAll('.btn-inativar').forEach((botao) => {

            // Evita adicionar o evento duas vezes
            if (botao.dataset.configurado === 'true') {
                return;
            }

            botao.dataset.configurado = 'true';

            botao.addEventListener('click', (event) => {

                event.preventDefault();
                event.stopPropagation();

                botaoAlvo = botao;

                // Garante que o outro modal esteja fechado
                modalAtivar?.classList.remove('active');

                // Abre SOMENTE o modal de inativar
                modalInativar?.classList.add('active');
            });
        });


        // ---------------------------------------------------------
        // BOTÃO ATIVAR
        // ---------------------------------------------------------

        document.querySelectorAll('.btn-ativar').forEach((botao) => {

            // Evita adicionar o evento duas vezes
            if (botao.dataset.configurado === 'true') {
                return;
            }

            botao.dataset.configurado = 'true';

            botao.addEventListener('click', (event) => {

                event.preventDefault();
                event.stopPropagation();

                botaoAlvo = botao;

                // Garante que o outro modal esteja fechado
                modalInativar?.classList.remove('active');

                // Abre SOMENTE o modal de ativar
                modalAtivar?.classList.add('active');
            });
        });
    }


    // Executa na abertura da página
    configurarBotoesStatus();


    // =========================================================
    // CONFIRMAR INATIVAÇÃO
    // =========================================================

    if (formInativar) {

        formInativar.addEventListener('submit', (event) => {

            event.preventDefault();

            if (!botaoAlvo) {
                fecharModalInativar();
                return;
            }

            const linha = botaoAlvo.closest('tr');

            if (linha) {

                // Marca a linha como inativa
                linha.classList.add('inativo');

                // Troca o botão
                botaoAlvo.textContent = 'Ativar';

                botaoAlvo.classList.remove('btn-inativar');
                botaoAlvo.classList.add('btn-ativar');

                // Permite adicionar o novo evento
                delete botaoAlvo.dataset.configurado;
            }

            fecharModalInativar();

            // Configura novamente o botão que virou "Ativar"
            configurarBotoesStatus();
        });
    }


    // =========================================================
    // CONFIRMAR ATIVAÇÃO
    // =========================================================

    if (formAtivar) {

        formAtivar.addEventListener('submit', (event) => {

            event.preventDefault();

            if (!botaoAlvo) {
                fecharModalAtivar();
                return;
            }

            const linha = botaoAlvo.closest('tr');

            if (linha) {

                // Remove o estado inativo
                linha.classList.remove('inativo');

                // Troca o botão
                botaoAlvo.textContent = 'Inativar';

                botaoAlvo.classList.remove('btn-ativar');
                botaoAlvo.classList.add('btn-inativar');

                // Permite adicionar o novo evento
                delete botaoAlvo.dataset.configurado;
            }

            fecharModalAtivar();

            // Configura novamente o botão que virou "Inativar"
            configurarBotoesStatus();
        });
    }


    // =========================================================
    // BOTÕES DE FECHAR
    // =========================================================

    btnFecharModalInativar?.addEventListener(
        'click',
        fecharModalInativar
    );

    btnCancelarInativar?.addEventListener(
        'click',
        fecharModalInativar
    );

    btnFecharModalAtivar?.addEventListener(
        'click',
        fecharModalAtivar
    );

    btnCancelarAtivar?.addEventListener(
        'click',
        fecharModalAtivar
    );


    // =========================================================
    // FECHAR CLICANDO FORA DO MODAL
    // =========================================================

    modalInativar?.addEventListener('click', (event) => {

        if (event.target === modalInativar) {
            fecharModalInativar();
        }
    });


    modalAtivar?.addEventListener('click', (event) => {

        if (event.target === modalAtivar) {
            fecharModalAtivar();
        }
    });


    // =========================================================
    // EDITAR CLIENTE
    // =========================================================

    document.querySelectorAll('.btn-editar').forEach((botao) => {

        botao.addEventListener('click', () => {

            const cliente = {
                codigo: botao.dataset.codigo || '',
                nome: botao.dataset.nome || '',
                cpf: botao.dataset.cpf || '',
                email: botao.dataset.email || '',

                telefone: '(11) 98765-4321',
                tipoTelefone: 'celular',
                dataNascimento: '1995-05-20',
                genero: 'feminino',

                nomeIdentificacao: 'Casa',
                tipoEndereco: 'cobranca-entrega',
                tipoResidencia: 'casa',
                tipoLogradouro: 'avenida',
                cep: '01310-100',
                logradouro: 'Avenida Paulista',
                bairro: 'Bela Vista',
                numero: '1578',
                estado: 'SP',
                cidade: 'São Paulo',
                pais: 'Brasil',
                observacoes: 'Endereço principal do cliente.'
            };

            localStorage.setItem(
                'clienteParaEditar',
                JSON.stringify(cliente)
            );

            window.location.href = '/admin/cadastrarCliente?editar=true';
        });
    });


    // =========================================================
    // NOVO: VER DETALHES DO CLIENTE
    // =========================================================

    document.querySelectorAll('.btn-detalhes').forEach((icone) => {

        icone.addEventListener('click', () => {

            const dados = icone.dataset;

            const cliente = {
                codigo: dados.codigo || '',
                nome: dados.nome || '',
                cpf: dados.cpf || '',
                email: dados.email || '',
                genero: dados.genero || '',
                ranking: dados.ranking || '0',
                dataNascimento: dados.nascimento || '',
                telefone: dados.telefone || '',
                logradouro: dados.logradouro || '',
                numero: dados.numero || '',
                bairro: dados.bairro || '',
                cidade: dados.cidade || '',
                estado: dados.estado || '',
                cep: dados.cep || '',
                pais: dados.pais || ''
            };

            localStorage.setItem('clienteParaDetalhar', JSON.stringify(cliente));

            window.location.href = '/admin/detalhesCliente';
        });
    });

});