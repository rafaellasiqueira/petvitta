function marcarNotificacaoVista() {
    localStorage.setItem("notificacaoVista", "true");
}

window.addEventListener("DOMContentLoaded", function () {

    const bolinha = document.getElementById("bolinha-notificacao");

    if (!bolinha) {
        return;
    }

    const notificacaoNova =
        bolinha.dataset.notificacao === "true";

    const notificacaoVista =
        localStorage.getItem("notificacaoVista") === "true";

    if (!notificacaoNova || notificacaoVista) {
        bolinha.classList.add("oculto");
    }

});