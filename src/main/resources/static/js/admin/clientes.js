document.addEventListener('DOMContentLoaded', () => {

    // Filtro
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

    // Máscaras
    // Máscara CPF
    document.getElementById('filtroCpf').addEventListener('input', function() {
        let filtroCpf = this.value.replace(/\D/g, '');
        filtroCpf = filtroCpf.substring(0, 11);
        filtroCpf = filtroCpf.replace(/(\d{3})(\d)/, '$1.$2');
        filtroCpf = filtroCpf.replace(/(\d{3})(\d)/, '$1.$2');
        filtroCpf = filtroCpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = filtroCpf;
    });

    // Máscara telefone
    document.getElementById('filtroTelefone').addEventListener('input', function() {
        let telefone = this.value.replace(/\D/g, '');
        telefone = telefone.substring(0, 11);
        if (telefone.length > 2) {
            telefone = telefone.replace(
                /(\d{2})(\d{5})(\d{0,4})/,
                '($1) $2-$3'
            );
        }
        this.value = telefone;
    });

    // Modais
    const modalInativar = document.getElementById('modalInativarCliente');
    const modalAtivar = document.getElementById('modalAtivarCliente');
    const formInativar = document.getElementById('formInativarCliente');
    const formAtivar = document.getElementById('formAtivarCliente');
    let botaoClicado;


    // ATIVAR E INATIVAR CLIENTE
    document.querySelectorAll('.btn-inativar, .btn-ativar').forEach(botao => {
        botao.addEventListener('click', () => {
            botaoClicado = botao;

            if (botao.classList.contains('btn-inativar')) {
                modalInativar.classList.add('active');
            } else {
                modalAtivar.classList.add('active');
            }

        });

    });


    // CONFIRMAR INATIVAÇÃO

    formInativar.addEventListener('submit', (event) => {

        event.preventDefault();

        const linha = botaoClicado.closest('tr');

        linha.classList.add('inativo');

        botaoClicado.textContent = 'Ativar';

        botaoClicado.classList.remove('btn-inativar');
        botaoClicado.classList.add('btn-ativar');

        modalInativar.classList.remove('active');

        formInativar.reset();
    });


    // BOTÕES QUE JÁ COMEÇAM COMO ATIVAR
    document.querySelectorAll('.btn-ativar').forEach(botao => {
        botao.addEventListener('click', () => {
            botaoClicado = botao;
            modalAtivar.classList.add('active');
        });

    });

    // CONFIRMAR ATIVAÇÃO

    formAtivar.addEventListener('submit', (event) => {

        event.preventDefault();

        const linha = botaoClicado.closest('tr');

        linha.classList.remove('inativo');

        botaoClicado.textContent = 'Inativar';

        botaoClicado.classList.remove('btn-ativar');
        botaoClicado.classList.add('btn-inativar');

        modalAtivar.classList.remove('active');

        formAtivar.reset();
    });


    // FECHAR MODAL INATIVAR
    document.getElementById('btnFecharModalInativar').addEventListener('click', () => {
        modalInativar.classList.remove('active');
        formInativar.reset();
    });

    document.getElementById('btnCancelarInativar').addEventListener('click', () => {
        modalInativar.classList.remove('active');
        formInativar.reset();
    });

    // FECHAR MODAL ATIVAR
    document.getElementById('btnFecharModalAtivar').addEventListener('click', () => {
        modalAtivar.classList.remove('active');
        formAtivar.reset();
    });

    document.getElementById('btnCancelarAtivar').addEventListener('click', () => {
        modalAtivar.classList.remove('active');
        formAtivar.reset();
    });

    // Editar cliente
    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', () => {
            const cliente = {
                codigo: botao.dataset.codigo,
                nome: botao.dataset.nome,
                cpf: botao.dataset.cpf,
                email: botao.dataset.email,
                telefone: '(11) 98765-4321',
                tipoTelefone: 'celular',
                dataNascimento: '1995-05-20',
                genero: 'feminino'
            };
            localStorage.setItem('clienteParaEditar', JSON.stringify(cliente));
            window.location.href = '/admin/cadastrarCliente?editar=true';
        });
    });

    // Ver detalhes
    document.querySelectorAll('.btn-detalhes').forEach(icone => {

        icone.addEventListener('click', () => {

            const cliente = {
                codigo: icone.dataset.codigo,
                nome: icone.dataset.nome,
                cpf: icone.dataset.cpf,
                email: icone.dataset.email,
                genero: icone.dataset.genero,
                ranking: icone.dataset.ranking,
                dataNascimento: icone.dataset.nascimento,
                telefone: icone.dataset.telefone,

                // Endereço
                nomeIdentificacao: icone.dataset.nomeIdentificacao,
                tipoEndereco: icone.dataset.tipoEndereco,
                tipoResidencia: icone.dataset.tipoResidencia,
                tipoLogradouro: icone.dataset.tipoLogradouro,
                cep: icone.dataset.cep,
                logradouro: icone.dataset.logradouro,
                bairro: icone.dataset.bairro,
                numero: icone.dataset.numero,
                estado: icone.dataset.estado,
                cidade: icone.dataset.cidade,
                pais: icone.dataset.pais,
                observacoes: icone.dataset.observacoes
            };

            localStorage.setItem(
                'clienteParaDetalhar',
                JSON.stringify(cliente)
            );

            window.location.href = '/admin/detalhesCliente';
        });

    });
});