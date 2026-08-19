// Toast
function adicionarCarrinho() {
    const toast = document.getElementById("toast");

    toast.classList.add("ativo"); // Adiciona a classe CSS que o elementoe está ativo

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 2000);
}

// Quantidade
const inputQtd = document.querySelector('.seletor-quantidade input');
const [btnMenos, btnMais] = document.querySelectorAll('.seletor-quantidade .btn-qtd');

btnMais.onclick = () => inputQtd.value++;
btnMenos.onclick = () => inputQtd.value > 1 && inputQtd.value--;

// Mudar o tamanho
const botoes = document.querySelectorAll('.tamanho-opcao');

botoes.forEach(btn => {
    btn.onclick = () => {
        botoes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});