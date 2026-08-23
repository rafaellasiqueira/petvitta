document.addEventListener('DOMContentLoaded', function() {
    // Toast
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        const texto = document.getElementById('toastMensagem');
        if (!toast || !texto) return;
        texto.textContent = mensagem;
        toast.classList.add('ativo');
        setTimeout(() => toast.classList.remove('ativo'), 2000);
    }

    // Senha
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

    // CPF
    document.getElementById('cpf').addEventListener('input', function () {
            let valor = this.value.replace(/\D/g, '').slice(0, 11);

            if (valor.length > 9) {
                valor = valor.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    '$1.$2.$3-$4'
                );
            } else if (valor.length > 6) {
                valor = valor.replace(
                    /(\d{3})(\d{3})(\d{1,3})/,
                    '$1.$2.$3'
                );
            } else if (valor.length > 3) {
                valor = valor.replace(
                    /(\d{3})(\d{1,3})/,
                    '$1.$2'
                );
            }

            this.value = valor;
    });

    // Telefone
    telefone.addEventListener('input', function() {
        let valor = this.value.replace(/\D/g, '');
        const tipo = tipoTelefone.value;

        if (tipo === 'fixo') {
            valor = valor.slice(0, 10);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        } else {
            valor = valor.slice(0, 11);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{5})(\d{0,4})/,
                    '($1) $2-$3'
                );
            }
        }

        this.value = valor;
    });

    // Mudar placeholder do telefone
    tipoTelefone.addEventListener('change', function() {
        if (this.value === 'fixo') {
            telefone.placeholder = '(00) 0000-0000';
        } else {
            telefone.placeholder = '(00) 00000-0000';
        }
    });

    // Dados pessoais
    const formDados = document.querySelector('.form-dados-pessoais');
    formDados.addEventListener('submit', function(e) {
        e.preventDefault();
        let valido = true;

        document.querySelectorAll('.mensagem-erro').forEach(e => e.textContent = '');
            if (!document.getElementById('nome').value.trim()) {
                document.getElementById('erroNome').textContent = 'Digite seu nome.';
                valido = false;
            }
            if (!cpf.value.trim()) {
                document.getElementById('erroCpf').textContent = 'Digite seu CPF.';
                valido = false;
            }
            if (!telefone.value.trim()) {
                document.getElementById('erroTelefone').textContent = 'Digite seu telefone.';
                valido = false;
            }
            if (!document.getElementById('dataNascimento').value) {
                document.getElementById('erroDataNascimento').textContent = 'Informe sua data de nascimento.';
                valido = false;
            }
            if (valido) mostrarToast('Dados pessoais salvos com sucesso!');
    });

    // Senha
    const formSenha = document.querySelector('.form-alterar-senha');

    formSenha.addEventListener('submit', function(e) {
        e.preventDefault();

        const atual = document.getElementById('senhaAtual');
        const nova = document.getElementById('novaSenha');
        const confirmar = document.getElementById('confirmarSenha');
        document.querySelectorAll('.form-alterar-senha .mensagem-erro').forEach(e => e.textContent = '');

        let valido = true;

        if (!atual.value) {
            document.getElementById('erroSenhaAtual').textContent = 'Digite sua senha atual.';
            valido = false;
        }

        if (nova.value.length < 8) {
            document.getElementById('erroNovaSenha').textContent = 'A senha deve ter pelo menos 8 caracteres.';
            valido = false;

        } else if (!/[A-Z]/.test(senha)) {
                erroSenha.textContent =
                    'A senha deve ter pelo menos uma letra maiúscula.';

                valido = false;

        } else if (!/[a-z]/.test(senha)) {
            erroSenha.textContent =
                'A senha deve ter pelo menos uma letra minúscula.';

            valido = false;

        } else if (!/[^A-Za-z0-9]/.test(senha)) {
            erroSenha.textContent =
                'A senha deve ter pelo menos um caractere especial.';

            valido = false;
        }

        if (!confirmar.value) {
            document.getElementById('erroConfirmarSenha').textContent = 'Confirme a nova senha.';
            valido = false;

        } else if (nova.value !== confirmar.value) {
            document.getElementById('erroConfirmarSenha').textContent = 'As senhas não coincidem.';
            valido = false;
        }

        if (valido) {
            mostrarToast('Senha alterada com sucesso!');
            formSenha.reset();
        }
    });

    // Endereço
    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');

   // Adicionar endereço
    btnAdicionarEndereco.addEventListener('click', function() {
        formEndereco.reset();
        tituloEndereco.textContent = 'Adicionar endereço';
        document.getElementById('pais').value = 'Brasil';

        modalEndereco.classList.add('active');
    });

    // Fechar modal
    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');

    btnbtnFecharEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });

    btnCancelarEndereco.addEventListener('click', function () {
        modalEndereco.classList.remove('active');
    });

    // Editar endereço
    document.querySelectorAll('.editar-endereco').forEach(botao => {
        botao.addEventListener('click', function(e) {

            tituloEndereco.textContent = 'Editar endereço';
            document.getElementById('nomeIdentificacao').value = this.dataset.nome || '';
            document.getElementById('tipoEndereco').value = this.dataset.tipoEndereco || '';
            document.getElementById('tipoResidencia').value = this.dataset.tipoResidencia || '';
            document.getElementById('tipoLogradouro').value = this.dataset.tipoLogradouro || '';
            document.getElementById('cep').value = this.dataset.cep || '';
            document.getElementById('logradouro').value = this.dataset.logradouro || '';
            document.getElementById('bairro').value = this.dataset.bairro || '';
            document.getElementById('numero').value = this.dataset.numero || '';
            document.getElementById('estado').value = this.dataset.estado || '';
            document.getElementById('cidade').value = this.dataset.cidade || '';
            document.getElementById('pais').value = this.dataset.pais || 'Brasil';
            document.getElementById('observacoes').value = this.dataset.observacoes || '';

            modalEndereco.classList.remove('active');
        });
    });

    // Salvar endereço
    formEndereco.addEventListener('submit', function(e) {
        event.preventDefault();
        mostrarToast('Endereço salvo com sucesso!');
        modalEndereco.classList.remove('active');
    });


    // Cartão
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');

    const btnAdicionarCartao = document.querySelector('.btn-adicionar-cartao');

    btnAdicionarCartao.addEventListener('click', function() {
        formCartao.reset();
        document.getElementById('tituloModalCartao').textContent = 'Cadastrar cartão';

        modalCartao.classList.add('active');
    });

    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');

    if (numeroCartao) {
        numero.addEventListener('input', function () {
                    let valor = this.value.replace(/\D/g, '').slice(0, 16);

                    if (valor.length > 12) {
                        valor = valor.replace(
                            /(\d{4})(\d{4})(\d{4})(\d{1,4})/,
                            '$1 $2 $3 $4'
                        );
                    } else if (valor.length > 8) {
                        valor = valor.replace(
                            /(\d{4})(\d{4})(\d{1,4})/,
                            '$1 $2 $3'
                        );
                    } else if (valor.length > 4) {
                        valor = valor.replace(
                            /(\d{4})(\d{1,4})/,
                            '$1 $2'
                        );
                    }

                    this.value = valor;
        });
    }

    // CVV
    if (cvv) {
            cvv.addEventListener('input', function () {
                this.value =this.value
                        .replace(/\D/g, '')
                        .slice(0, 4);
            });
    }

    // Validade
    if (validade) {
            validade.addEventListener('input', function () {
                let valor = this.value.replace(/\D/g, '').slice(0, 4);

                if (valor.length > 2) {
                    valor = valor.replace(
                        /(\d{2})(\d{1,2})/,
                        '$1/$2'
                    );
                }

                this.value = valor;
            });
    }

    // Editar cartão
    document.querySelectorAll('.editar-cartao').forEach(botao => {

        botao.addEventListener('click', function(e) {
            e.preventDefault();

            document.getElementById('tituloModalCartao').textContent = 'Editar cartão';
            document.getElementById('numeroCartao').value = '';
            document.getElementById('nomeCartao').value = this.dataset.nome || '';
            document.getElementById('bandeiraCartao').value = this.dataset.bandeira || '';
            document.getElementById('cvvCartao').value = this.dataset.cvv || '';
            document.getElementById('validadeCartao').value = this.dataset.validade || '';

            modalCartao.classList.add('active');
        });
    });

    // Salvar cartão
    if (formCartao) {
        formCartao.addEventListener('submit', function(e) {

            const numero = numeroCartao.value.replace(/\D/g, '');

            if (numero.length !== 16) {
                mostrarToast('Digite o número completo do cartão.');
                return;
            }

            const partes = validade.value.split('/');
            if (partes.length !== 2 || parseInt(partes[0]) < 1 || parseInt(partes[0]) > 12) {
                mostrarToast('Digite uma validade válida.');
                return;
            }

            mostrarToast('Cartão salvo com sucesso!');

            modalCartao.classList.remove('active');
        });
    }

    // Exclusão
    const modalExclusao = document.getElementById('modalConfirmarExclusao');
    const tituloExclusao = document.getElementById('tituloModalExclusao');
    const mensagemExclusao = document.getElementById('mensagemModalExclusao');


    // Fechar modal
    const btnFecharExclusao = document.getElementById('btnFecharModalExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');

    btnFecharExclusao.addEventListener('click', function () {
      modalEndereco.classList.remove('active');
    });

    btnbtnCancelarExclusao.addEventListener('click', function () {
          modalEndereco.classList.remove('active');
    });

    document.querySelectorAll('.excluir-endereco').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            tituloExclusao.textContent = 'Excluir endereço';
            mensagemExclusao.textContent = `Deseja excluir o endereço "${this.dataset.nome}"?`;

            modalExclusao.classList.add('active');
        });
    });

    document.querySelectorAll('.excluir-cartao').forEach(botao => {

        botao.addEventListener('click', function(e) {
            e.preventDefault();

            tituloExclusao.textContent = 'Excluir cartão';

            mensagemExclusao.textContent = `Deseja excluir o cartão "${this.dataset.nome}"?`;

            modalExclusao.classList.add('active');
        });
    });

    // Confirmar exclusão
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    btnConfirmarExclusao.addEventListener('click', function() {
        fecharExclusao();
        mostrarToast('Item excluído com sucesso!');
    });
});