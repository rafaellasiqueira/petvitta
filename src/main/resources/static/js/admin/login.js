function mostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("icone-senha");

    if (senha.type === "password") {
        senha.type = "text";
        icone.src = "/icons/eye.svg";
        icone.alt = "Ocultar senha";
    } else {
        senha.type = "password";
        icone.src = "/icons/eye-off.svg";
        icone.alt = "Mostrar senha";
    }
}

document.getElementById("btnEntrar").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/admin/dashboard";
});