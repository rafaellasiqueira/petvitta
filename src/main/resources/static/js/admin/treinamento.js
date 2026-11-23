document.getElementById("btnTreinar").addEventListener("click", function () {
    const mensagem = document.getElementById("mensagem");
    const resultado = document.getElementById("resultado");

    resultado.classList.remove("ativo");

    fetch("/admin/api/treinamento/treinar", {
        method: "POST"
    })
        .then(async response => {

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.json();
        })
        .then(data => {

            document.getElementById("versao").innerText = data.id;
            document.getElementById("compras").innerText = data.qtdCompras;
            document.getElementById("feedbacks").innerText = data.qtdFeedbacks;
            document.getElementById("recomendacoes").innerText = data.qtdRecomendacoes;

            resultado.classList.add("ativo");

        })
        .catch(erro => {

            mensagem.innerText = "Erro ao treinar: " + erro.message;

        });

});
