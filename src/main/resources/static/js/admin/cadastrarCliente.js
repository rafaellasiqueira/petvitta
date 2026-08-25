document.addEventListener('DOMContentLoaded', () => {

    // Editar
    const params = new URLSearchParams(window.location.search);
    const editar = params.get('editar'); /* FIca true se achar */
    if (editar === 'true') {

        // Pega os dados do cliente
        const dados = localStorage.getItem('clienteParaEditar');
        const cliente = JSON.parse(dados); /* transforma de novo o dado em objeto em javascript */

        // Muda o título e o botão
        document.getElementById('tituloPagina').textContent = 'Editar cliente';
        document.getElementById('btnSalvarCliente').textContent = 'Salvar alterações';

        // Coloca os dados nos campos
        document.getElementById('codigoCliente').value = cliente.codigo;
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('cpf').value = cliente.cpf;
        document.getElementById('tipoTelefone').value = cliente.tipoTelefone;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('genero').value = cliente.genero;
        document.getElementById('dataNascimento').value = cliente.dataNascimento;
        document.getElementById('email').value = cliente.email;

        // Senha não é obrigatória ao editar
        document.getElementById('senha').removeAttribute('required');
        document.getElementById('confirmarSenha').removeAttribute('required');
    }

    // Mostrar e ocutar senha
    document.querySelectorAll('.btn-mostrar-senha').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const senha = document.getElementById(botao.dataset.input);
            const icone = botao.querySelector('i');

            if (senha.type === "password") {
                senha.type = "text";
                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");

            } else {
                senha.type = "password";
                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");
            }
        });
    });

    // Máscaras
    // Máscara CPF
    document.getElementById('cpf').addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '').slice(0, 11); /* Remove oq nao e numero e limita a 11 caracteres */

        if (valor.length > 9) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (valor.length > 6) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (valor.length > 3) {
            valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }

        this.value = valor;
    });

    // Máscara telefone
    document.getElementById('telefone').addEventListener('input', function() {
        let telefone = this.value.replace(/\D/g, '');
        const tipo = document.getElementById('tipoTelefone').value;

        if (tipo === 'fixo') {
            telefone = telefone.slice(0, 10);
            if (telefone.length > 2) {
                telefone = telefone.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }

        } else {
            telefone = telefone.slice(0, 11);
            if (telefone.length > 2) {
                telefone = telefone.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        }

        this.value = telefone;
    });

    // Mudar placeholder do telefone
    document.getElementById('tipoTelefone').addEventListener('change', function() {
        const telefone = document.getElementById('telefone');

        if (this.value === 'fixo') {
            telefone.placeholder = '(00) 0000-0000';
        } else {
            telefone.placeholder = '(00) 00000-0000';
        }
    });

    // Validar data de nascimento enquanto digita
    const dataNascimento = document.getElementById('dataNascimento');
    const erroDataNascimento = document.getElementById('erroDataNascimento');

    dataNascimento.addEventListener('input', function() {
        erroDataNascimento.textContent = '';

        if (this.value === '') {
            return;
        }

        const data = new Date(this.value + 'T00:00:00');
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        if (data > hoje) {
            erroDataNascimento.textContent = 'A data de nascimento não pode ser futura.';
        }
    });

    // Validar senha enquanto digita
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmarSenha = document.getElementById('erroConfirmarSenha');

    senha.addEventListener('input', function() {
        erroSenha.textContent = '';

        if (this.value === '') {
            return;
        }

        if (this.value.length < 8) {
            erroSenha.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        } else if (!/[A-Z]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos uma letra maiúscula.';
        } else if (!/[a-z]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos uma letra minúscula.';
        } else if (!/[^A-Za-z0-9]/.test(this.value)) {
            erroSenha.textContent = 'A senha deve ter pelo menos um caractere especial.';
        }

        if (confirmarSenha.value !== '') {
            if (confirmarSenha.value !== this.value) {
                erroConfirmarSenha.textContent = 'As senhas não coincidem.';
            } else {
                erroConfirmarSenha.textContent = '';
            }
        }
    });

    confirmarSenha.addEventListener('input', function() {
        erroConfirmarSenha.textContent = '';

        if (this.value === '') {
            return;
        }

        if (this.value !== senha.value) {
            erroConfirmarSenha.textContent = 'As senhas não coincidem.';
        }
    });

    document.getElementById('formCadastroCliente').addEventListener('submit', function(event) {
        event.preventDefault();
        cadastrarCliente();
    });
});

// Cadastrar cliente
function cadastrarCliente() {
    const params = new URLSearchParams(window.location.search);
    const editar = params.get('editar') === 'true';

    // Limpa as mensagens
    document.querySelectorAll('.mensagem-erro').forEach(function(erro) {
        erro.textContent = '';
    });


        // Mostra o toast
        const toast = document.getElementById('toast');
        const toastMensagem = document.getElementById('toastMensagem');

        if (editar) {
            toastMensagem.textContent = 'Cliente alterado com sucesso!';
        } else {
            toastMensagem.textContent = 'Cliente cadastrado com sucesso!';
        }

        toast.classList.add('ativo');

        // Vai para a página de clientes
        setTimeout(function() {
            window.location.href = '/admin/clientes';
        }, 2000);
}