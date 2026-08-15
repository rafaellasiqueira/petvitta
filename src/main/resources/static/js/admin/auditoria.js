const modal = document.getElementById('modalAuditoria');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');

// Modal de detalhes
// Looping para encontrar todos os botoes dentro d botoesOlho
botoesOlho.forEach(botao => {
    // Quando achar o botao que foi clicado
    botao.addEventListener('click', function() {
        // Preenche as informações direto pelo ID
        document.getElementById('modalData').innerText = botao.dataset.data;
        document.getElementById('modalHora').innerText = botao.dataset.hora;
        document.getElementById('modalUsuario').innerText = botao.dataset.usuario;
        document.getElementById('modalOperacao').innerText = botao.dataset.operacao;
        document.getElementById('modalCampo').innerText = botao.dataset.campo;
        document.getElementById('modalAlteracao').innerText = botao.dataset.alteracao;

        // Abre o modal
        modal.classList.add('active');
    });
});

// Fecha o modal
btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});