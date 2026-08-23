const modal = document.getElementById('modalAuditoria');
const btnFechar = document.getElementById('btnFecharModal');
const botoesOlho = document.querySelectorAll('.btn-detalhes');

// Modal de detalhes
botoesOlho.forEach(botao => {

    botao.addEventListener('click', function() {

        document.getElementById('modalData').innerText = botao.dataset.data;
        document.getElementById('modalHora').innerText = botao.dataset.hora;
        document.getElementById('modalUsuario').innerText = botao.dataset.usuario;
        document.getElementById('modalOperacao').innerText = botao.dataset.operacao;
        document.getElementById('modalCampo').innerText = botao.dataset.campo;
        document.getElementById('modalAlteracao').innerText = botao.dataset.alteracao;


        modal.classList.add('active');
    });
});

btnFechar.addEventListener('click', function() {
    modal.classList.remove('active');
});