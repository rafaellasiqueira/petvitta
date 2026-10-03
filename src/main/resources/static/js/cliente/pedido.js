document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-ver-mais-produtos').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const produtos = this.parentElement.querySelectorAll('.produto-escondido');
            const aberto = this.classList.toggle('aberto');

            produtos.forEach(function (produto) {
                if (aberto) {
                    produto.style.display = 'flex';
                } else {
                    produto.style.display = 'none';
                }
            });

            if (aberto) {
                this.innerHTML = 'Ver menos';
            } else {
                this.innerHTML = 'Ver mais';
            }
        });
    });
});