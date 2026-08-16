document.addEventListener('DOMContentLoaded', () => {
    const btnFiltro = document.getElementById('btnfiltrar');
    const painelFiltro = document.getElementById('painelFiltro');
    const btnLimpar = document.getElementById('btnLimparFiltro');

    // Abre e fecha o painel de filtros
    btnFiltro.addEventListener('click', () => {
        painelFiltro.classList.toggle('hidden');
    });

    // Limpa todos os campos do filtro
    btnLimpar.addEventListener('click', () => {
        painelFiltro.reset();
    });
});