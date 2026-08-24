function mostrarSenha() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("icone-olho");

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

    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagemErro = document.getElementById("erroDadosAcesso");

    if (email.value === "felipe@gmail.com" && senha.value === "@Felipe123") {
        event.preventDefault();
        window.location.href = "/cliente/produtos";
    } else {
        event.preventDefault();
        mensagemErro.textContent = "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
        mensagemErro.hidden = false;
    }

});