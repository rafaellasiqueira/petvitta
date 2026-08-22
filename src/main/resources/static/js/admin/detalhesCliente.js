document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // DADOS DO CLIENTE
    //
    // OBS (BACKEND): aqui é só front. Numa versão real, o
    // controller deveria devolver esses dados no GET
    // /admin/detalhesCliente?codigo=CL-001 consultando o banco,
    // em vez de ler do localStorage preenchido pela listagem.
    // O fallback abaixo existe só para a tela não ficar vazia
    // caso alguém acesse direto pela URL, sem vir da listagem.
    // =========================================================

    const dadosSalvos = localStorage.getItem('clienteParaDetalhar');

    const clienteFallback = {
        codigo: 'CL-001',
        nome: 'Letícia Gomes de Souza',
        ranking: '0',
        cpf: '123.456.789-00',
        email: 'leticia@gmail.com',
        genero: 'Feminino',
        dataNascimento: '20/05/1995',
        telefone: '(11) 98765-4321',
        logradouro: 'Avenida Paulista',
        numero: '1578',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        pais: 'Brasil'
    };

    const cliente = dadosSalvos ? JSON.parse(dadosSalvos) : clienteFallback;

    const preencher = (id, valor) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor || '-';
    };

    preencher('detalheNome', cliente.nome);
    preencher('detalheRanking', cliente.ranking ?? '0');
    preencher('detalheCpf', cliente.cpf);
    preencher('detalheEmail', cliente.email);
    preencher('detalheGenero', cliente.genero);
    preencher('detalheNascimento', cliente.dataNascimento);
    preencher('detalheTelefone', cliente.telefone);

    preencher(
        'detalheEndereco',
        `${cliente.logradouro || ''}, ${cliente.numero || ''} - ${cliente.bairro || ''}, ${cliente.cidade || ''} - ${cliente.estado || ''}`
    );

    preencher('detalheCep', `CEP: ${cliente.cep || ''}, ${cliente.pais || ''}`);


    // =========================================================
    // MODAL DE DETALHES DO PEDIDO
    //
    // OBS (BACKEND): a lista de transações aqui é fixa no HTML.
    // Numa versão real, viria de uma consulta tipo
    // GET /admin/clientes/{codigo}/pedidos.
    // =========================================================

    const modalPedido = document.getElementById('modalDetalhesPedido');
    const btnFecharModalPedido = document.getElementById('btnFecharModalPedido');

    document.querySelectorAll('.btn-ver-pedido').forEach((botao) => {

        botao.addEventListener('click', () => {

            const dados = botao.dataset;

            preencher('modalPedidoId', dados.pedido);
            preencher('modalPedidoData', dados.data);
            preencher('modalPedidoStatus', dados.status);
            preencher('modalPedidoPagamento', dados.pagamento);
            preencher('modalPedidoItens', dados.itens);
            preencher('modalPedidoValor', dados.valor);

            modalPedido?.classList.add('active');
        });
    });

    if (btnFecharModalPedido && modalPedido) {
        btnFecharModalPedido.addEventListener('click', () => modalPedido.classList.remove('active'));
    }

    if (modalPedido) {
        modalPedido.addEventListener('click', (event) => {
            if (event.target === modalPedido) modalPedido.classList.remove('active');
        });
    }

});