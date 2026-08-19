function adicionarCarrinho() {
    const toast = document.getElementById("toast");

    toast.classList.add("ativo");

    setTimeout(function() {
        toast.classList.remove("ativo");
    }, 3000);
}