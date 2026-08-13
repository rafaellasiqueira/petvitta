function mostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("icone-senha");

    if (senha.type === "password") {
        senha.type = "text";
        icone.src = "../../../static/images/eye.svg";
        icone.alt = "Ocultar senha";
    } else {
        senha.type = "password";
        icone.src = "../../../static/images/eye-off.svg";
        icone.alt = "Mostrar senha";
    }
}
