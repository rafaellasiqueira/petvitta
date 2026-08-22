document.addEventListener('DOMContentLoaded', () => {

    // Dados do cliente
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

        // Endereço
        nomeIdentificacao: 'Minha casa',
        tipoEndereco: 'Cobrança e entrega',
        tipoResidencia: 'Apartamento',
        tipoLogradouro: 'Avenida',
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        numero: '1578',
        estado: 'São Paulo',
        cidade: 'São Paulo',
        pais: 'Brasil',
        observacoes: 'Entregar na portaria'
    };

    const cliente = dadosSalvos
        ? JSON.parse(dadosSalvos)
        : clienteFallback;


    // Função para preencher os campos
    function preencher(id, valor) {
        document.getElementById(id).textContent = valor || '-';
    }


    // Dados pessoais
    preencher('detalheNome', cliente.nome);
    preencher('detalheRanking', cliente.ranking);
    preencher('detalheCpf', cliente.cpf);
    preencher('detalheEmail', cliente.email);
    preencher('detalheGenero', cliente.genero);
    preencher('detalheNascimento', cliente.dataNascimento);
    preencher('detalheTelefone', cliente.telefone);


    // Dados do endereço
    preencher('detalheNomeIdentificacao', cliente.nomeIdentificacao);
    preencher('detalheTipoEndereco', cliente.tipoEndereco);
    preencher('detalheTipoResidencia', cliente.tipoResidencia);
    preencher('detalheTipoLogradouro', cliente.tipoLogradouro);
    preencher('detalheCep', cliente.cep);
    preencher('detalheLogradouro', cliente.logradouro);
    preencher('detalheBairro', cliente.bairro);
    preencher('detalheNumero', cliente.numero);
    preencher('detalheEstado', cliente.estado);
    preencher('detalheCidade', cliente.cidade);
    preencher('detalhePais', cliente.pais);
    preencher('detalheObservacoes', cliente.observacoes);


    // Modal do pedido
    const modalPedido = document.getElementById('modalDetalhesPedido');
    const btnFechar = document.getElementById('btnFecharModalPedido');


    // Abrir modal
    document.querySelectorAll('.btn-ver-pedido').forEach(botao => {

        botao.addEventListener('click', () => {

            preencher('modalPedidoId', botao.dataset.pedido);
            preencher('modalPedidoData', botao.dataset.data);
            preencher('modalPedidoStatus', botao.dataset.status);
            preencher('modalPedidoPagamento', botao.dataset.pagamento);
            preencher('modalPedidoItens', botao.dataset.itens);
            preencher('modalPedidoValor', botao.dataset.valor);

            modalPedido.classList.add('active');
        });

    });


    // Fechar modal
    btnFechar.addEventListener('click', () => {
        modalPedido.classList.remove('active');
    });

});