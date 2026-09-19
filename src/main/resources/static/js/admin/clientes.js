document.addEventListener('DOMContentLoaded', () => {

    // Toast
    const toast = document.getElementById('toast');

    if (toast) {
        toast.classList.add('ativo');

        setTimeout(() => {
            toast.classList.remove('ativo');
        }, 6000);
    }

//Filtro
const btnFiltro = document.getElementById('btnfiltrar');
const painelFiltro = document.getElementById('painelFiltro');

btnFiltro.addEventListener('click', () => {
    painelFiltro.hidden = !painelFiltro.hidden;
});

// Máscaras
// Máscara CPF
document.getElementById('filtroCpf').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11); /* Remove oq nao e numero e limita a 11 caracteres */

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.value = valor;
});

// Máscara telefone
document.getElementById('filtroTelefone').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length >  2) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
    }

    this.value = valor;
});

    // Modais Ativar e Inativar
    const modalInativar = document.getElementById('modalInativarCliente');
    const modalAtivar = document.getElementById('modalAtivarCliente');
    const formInativar = document.getElementById('formInativarCliente');
    const formAtivar = document.getElementById('formAtivarCliente');

    // Abrir modal de inativação
        document.querySelectorAll('.btn-inativar').forEach(function (botao) {
            botao.addEventListener('click', function () {

                const id = this.dataset.id;

                formInativar.action = `/admin/clientes/${id}/inativar`;

                modalInativar.classList.add('active');
            });
        });


    // Abrir modal de ativação
        document.querySelectorAll('.btn-ativar').forEach(function (botao) {
            botao.addEventListener('click', function () {

                const id = this.dataset.id;

                formAtivar.action = `/admin/clientes/${id}/ativar`;

                modalAtivar.classList.add('active');
            });
        });

    // Fechal modal inativar
    document.getElementById('btnFecharModalInativar').addEventListener('click', () => {
        modalInativar.classList.remove('active');
        formInativar.reset();
    });

    document.getElementById('btnCancelarInativar').addEventListener('click', () => {
        modalInativar.classList.remove('active');
        formInativar.reset();
    });

    // Fechar modal ativar
    document.getElementById('btnFecharModalAtivar').addEventListener('click', () => {
        modalAtivar.classList.remove('active');
        formAtivar.reset();
    });

    document.getElementById('btnCancelarAtivar').addEventListener('click', () => {
        modalAtivar.classList.remove('active');
        formAtivar.reset();
    });

});