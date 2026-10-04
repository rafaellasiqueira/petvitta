const formFiltro = document.getElementById("formFiltro");

const filtros = formFiltro.querySelectorAll(
    'input[type="checkbox"], input[type="radio"]'
);

filtros.forEach(function (filtro) {
    filtro.addEventListener("change", function () {
        formFiltro.submit();
    });
});

const camposPreco = formFiltro.querySelectorAll(
    'input[type="number"]'
);

camposPreco.forEach(function (campo) {
    campo.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            formFiltro.submit();
        }
    });
});