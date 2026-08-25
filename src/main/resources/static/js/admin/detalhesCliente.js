document.addEventListener('DOMContentLoaded', function () {

    // Dados do cliente
    const dadosSalvos = localStorage.getItem('clienteParaDetalhar');
    const cliente = JSON.parse(dadosSalvos);

    // Campos do cliente
    const nome = document.getElementById('detalheNome');
    const ranking = document.getElementById('detalheRanking');
    const cpf = document.getElementById('detalheCpf');
    const email = document.getElementById('detalheEmail');
    const genero = document.getElementById('detalheGenero');
    const nascimento = document.getElementById('detalheNascimento');
    const telefone = document.getElementById('detalheTelefone');

    // Campos do endereço
    const nomeIdentificacao = document.getElementById('detalheNomeIdentificacao');
    const tipoEndereco = document.getElementById('detalheTipoEndereco');
    const tipoResidencia = document.getElementById('detalheTipoResidencia');
    const tipoLogradouro = document.getElementById('detalheTipoLogradouro');
    const cep = document.getElementById('detalheCep');
    const logradouro = document.getElementById('detalheLogradouro');
    const bairro = document.getElementById('detalheBairro');
    const numero = document.getElementById('detalheNumero');
    const estado = document.getElementById('detalheEstado');
    const cidade = document.getElementById('detalheCidade');
    const pais = document.getElementById('detalhePais');
    const observacoes = document.getElementById('detalheObservacoes');


    // Preencher dados pessoais
    nome.textContent = cliente.nome;
    ranking.textContent = cliente.ranking + ' pts';
    cpf.textContent = cliente.cpf;
    email.textContent = cliente.email;
    genero.textContent = cliente.genero;
    nascimento.textContent = cliente.dataNascimento;
    telefone.textContent = cliente.telefone;


    // Preencher endereço
    nomeIdentificacao.textContent = cliente.nomeIdentificacao;
    tipoEndereco.textContent = cliente.tipoEndereco;
    tipoResidencia.textContent = cliente.tipoResidencia;
    tipoLogradouro.textContent = cliente.tipoLogradouro;
    cep.textContent = cliente.cep;
    logradouro.textContent = cliente.logradouro;
    bairro.textContent = cliente.bairro;
    numero.textContent = cliente.numero;
    estado.textContent = cliente.estado;
    cidade.textContent = cliente.cidade;
    pais.textContent = cliente.pais;
    observacoes.textContent = cliente.observacoes;


    // Modal do pedido
    const modal = document.getElementById('modalDetalhesPedido');
    const btnFechar = document.getElementById('btnFecharModalPedido');
    const botoesDetalhes = document.querySelectorAll('.btn-ver-pedido');

    const pedidoId = document.getElementById('modalPedidoId');
    const pedidoData = document.getElementById('modalPedidoData');
    const pedidoStatus = document.getElementById('modalPedidoStatus');
    const pedidoPagamento = document.getElementById('modalPedidoPagamento');
    const pedidoItens = document.getElementById('modalPedidoItens');
    const pedidoValor = document.getElementById('modalPedidoValor');


    // Abrir modal de detalhes
    botoesDetalhes.forEach(botao => {
        botao.addEventListener('click', function () {

            pedidoId.textContent = botao.dataset.pedido;
            pedidoData.textContent = botao.dataset.data;
            pedidoStatus.textContent = botao.dataset.status;
            pedidoPagamento.textContent = botao.dataset.pagamento;
            pedidoItens.textContent = botao.dataset.itens;
            pedidoValor.textContent = botao.dataset.valor;

            modal.classList.add('active');
        });
    });


    // Fechar pelo X
    btnFechar.addEventListener('click', function () {
        modal.classList.remove('active');
    });

});