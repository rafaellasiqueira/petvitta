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
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagemErro = document.getElementById("erroDadosAcesso");

    if (email.value === "admin@petvittaclub.com" && senha.value === "@Admin123") {
        event.preventDefault();
        window.location.href = "/admin/dashboard";
    } else {
        event.preventDefault();
        mensagemErro.textContent = "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
        mensagemErro.hidden = false;
    }

});

