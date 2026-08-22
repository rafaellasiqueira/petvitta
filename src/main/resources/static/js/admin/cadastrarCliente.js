document.addEventListener('DOMContentLoaded', () => {

    // Editar
    const params = new URLSearchParams(window.location.search);
    const editar = params.get('editar');
    if (editar === 'true') {

        // Pega os dados do cliente
        const dados = localStorage.getItem('clienteParaEditar');
        const cliente = JSON.parse(dados);

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
    document.getElementById('cpf').addEventListener('input', function() {
        let cpf = this.value.replace(/\D/g, '');
        cpf = cpf.substring(0, 11);
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = cpf;
    });

    // Máscara telefone
    document.getElementById('telefone').addEventListener('input', function() {

        let telefone = this.value.replace(/\D/g, '');
        const tipo = document.getElementById('tipoTelefone').value;

        if (tipo === 'fixo') {

            // Fixo: (00) 0000-0000
            telefone = telefone.substring(0, 10);

            if (telefone.length > 2) {
                telefone = telefone.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }

        } else {

            // Celular: (00) 00000-0000
            telefone = telefone.substring(0, 11);

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
});

// Cadastrar cliente
function cadastrarCliente() {
    const params = new URLSearchParams(window.location.search);
    const editar = params.get('editar') === 'true';

    let valido = true;

    // Limpa as mensagens
    document.querySelectorAll('.mensagem-erro').forEach(function(erro) {
        erro.textContent = '';
    });

    // Nome
    if (document.getElementById('nome').value.trim() === '') {
        document.getElementById('erroNome').textContent =
            'Digite o nome do cliente.';
        valido = false;
    }

    // CPF
    if (document.getElementById('cpf').value.trim() === '') {
        document.getElementById('erroCpf').textContent =
            'Digite o CPF.';
        valido = false;
    }

    // Tipo telefone
    if (document.getElementById('tipoTelefone').value === '') {
        document.getElementById('erroTipoTelefone').textContent =
            'Selecione o tipo de telefone.';
        valido = false;
    }

    // Telefone
    if (document.getElementById('telefone').value.trim() === '') {
        document.getElementById('erroTelefone').textContent =
            'Digite o telefone.';
        valido = false;
    }

    // Gênero
    if (document.getElementById('genero').value === '') {
        document.getElementById('erroGenero').textContent =
            'Selecione o gênero.';
        valido = false;
    }


    // Data de nascimento
    if (document.getElementById('dataNascimento').value === '') {
        document.getElementById('erroDataNascimento').textContent =
            'Informe a data de nascimento.';
        valido = false;
    }

    // E-mail
    if (document.getElementById('email').value.trim() === '') {
        document.getElementById('erroEmail').textContent =
            'Digite o e-mail.';
        valido = false;
    }

    // Senha
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    const erroSenha = document.getElementById('erroSenha');
    const erroConfirmar = document.getElementById('erroConfirmarSenha');

    if (editar && senha === '' && confirmarSenha === '') {

    } else {

        // Senha vazia
        if (senha === '') {
            erroSenha.textContent =
                'Digite uma senha.';
            valido = false;
        }

        // Menos de 8 caracteres
        else if (senha.length < 8) {
            erroSenha.textContent =
                'A senha deve ter pelo menos 8 caracteres.';
            valido = false;
        }

        // Sem letra maiúscula
        else if (!/[A-Z]/.test(senha)) {
            erroSenha.textContent =
                'A senha deve ter pelo menos uma letra maiúscula.';
            valido = false;
        }

        // Sem letra minúscula
        else if (!/[a-z]/.test(senha)) {
            erroSenha.textContent =
                'A senha deve ter pelo menos uma letra minúscula.';
            valido = false;
        }

        // Sem caractere especial
        else if (!/[^A-Za-z0-9]/.test(senha)) {
            erroSenha.textContent =
                'A senha deve ter pelo menos um caractere especial.';
            valido = false;
        }

        // Confirmar senha
        if (confirmarSenha === '') {
            erroConfirmar.textContent =
                'Confirme a senha.';
            valido = false;
        }

        // Senhas diferentes
        else if (senha !== confirmarSenha) {
            erroConfirmar.textContent =
                'As senhas não coincidem.';
            valido = false;
        }
    }

        // Se tiver algum erro, não continua
        if (!valido) {
            return;
        }

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