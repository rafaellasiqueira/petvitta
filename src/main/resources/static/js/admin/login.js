function mostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("icone-senha");

    if (senha.type === "password") {
        senha.type = "text";
        icone.classList.remove("fa-eye");
        icone.classList.add("fa-eye-slash");
    } else {
        senha.type = "password";
        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");
    }
}

document.getElementById("btnEntrar").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/admin/dashboard";
});