document.addEventListener('DOMContentLoaded', function() {

    // Toast
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        const texto = document.getElementById('toastMensagem');

        if (!toast || !texto) return;

        texto.textContent = mensagem;
        toast.classList.add('ativo');

        setTimeout(() => {
            toast.classList.remove('ativo');
        }, 2000);
    }

    // Senha
    document.querySelectorAll('.btn-mostrar-senha').forEach(function(botao) {
        botao.addEventListener('click', function() {
            const senha = document.getElementById(botao.dataset.input);
            const icone = botao.querySelector('i');

            if (!senha || !icone) return;

            if (senha.type === 'password') {
                senha.type = 'text';
                icone.classList.remove('fa-eye');
                icone.classList.add('fa-eye-slash');
            } else {
                senha.type = 'password';
                icone.classList.remove('fa-eye-slash');
                icone.classList.add('fa-eye');
            }
        });
    });

    // Dados pessoais
    const formDados = document.querySelector('.form-dados-pessoais');
    const cpf = document.getElementById('cpf');
    const telefone = document.getElementById('telefone');
    const tipoTelefone = document.getElementById('tipoTelefone');
    const dataNascimento = document.getElementById('dataNascimento');

    if (cpf) {
        cpf.addEventListener('input', function() {
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
    }

    if (telefone && tipoTelefone) {
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

        tipoTelefone.addEventListener('change', function() {
            telefone.placeholder = this.value === 'fixo'
                ? '(00) 0000-0000'
                : '(00) 00000-0000';
        });
    }

    if (formDados) {
        formDados.addEventListener('submit', function(e) {
            e.preventDefault();

            let valido = true;

            document.querySelectorAll('.mensagem-erro').forEach(function(erro) {
                erro.textContent = '';
            });

            if (!document.getElementById('nome').value.trim()) {
                document.getElementById('erroNome').textContent =
                    'Digite seu nome.';
                valido = false;
            }

            if (!cpf || !cpf.value.trim()) {
                document.getElementById('erroCpf').textContent =
                    'Digite seu CPF.';
                valido = false;
            }

            if (!telefone || !telefone.value.trim()) {
                document.getElementById('erroTelefone').textContent =
                    'Digite seu telefone.';
                valido = false;
            }

            if (!dataNascimento || !dataNascimento.value) {
                document.getElementById('erroDataNascimento').textContent =
                    'Informe sua data de nascimento.';
                valido = false;
            } else {
                const dataInformada = new Date(
                    dataNascimento.value + 'T00:00:00'
                );

                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);

                if (dataInformada > hoje) {
                    document.getElementById('erroDataNascimento').textContent =
                        'A data de nascimento não pode ser posterior à data de hoje.';
                    valido = false;
                }
            }

            if (valido) {
                mostrarToast('Dados pessoais salvos com sucesso!');
            }
        });
    }

    // Alterar senha
    const formSenha = document.querySelector('.form-alterar-senha');

    if (formSenha) {
        formSenha.addEventListener('submit', function(e) {
            e.preventDefault();

            const atual = document.getElementById('senhaAtual');
            const nova = document.getElementById('novaSenha');
            const confirmar = document.getElementById('confirmarSenha');

            document.querySelectorAll(
                '.form-alterar-senha .mensagem-erro'
            ).forEach(function(erro) {
                erro.textContent = '';
            });

            let valido = true;

            if (!atual.value) {
                document.getElementById('erroSenhaAtual').textContent =
                    'Digite sua senha atual.';
                valido = false;
            }

            if (!nova.value) {
                document.getElementById('erroNovaSenha').textContent =
                    'Digite uma nova senha.';
                valido = false;
            } else if (nova.value.length < 8) {
                document.getElementById('erroNovaSenha').textContent =
                    'A senha deve ter pelo menos 8 caracteres.';
                valido = false;
            } else if (!/[A-Z]/.test(nova.value)) {
                document.getElementById('erroNovaSenha').textContent =
                    'A senha deve ter pelo menos uma letra maiúscula.';
                valido = false;
            } else if (!/[a-z]/.test(nova.value)) {
                document.getElementById('erroNovaSenha').textContent =
                    'A senha deve ter pelo menos uma letra minúscula.';
                valido = false;
            } else if (!/[^A-Za-z0-9]/.test(nova.value)) {
                document.getElementById('erroNovaSenha').textContent =
                    'A senha deve ter pelo menos um caractere especial.';
                valido = false;
            }

            if (!confirmar.value) {
                document.getElementById('erroConfirmarSenha').textContent =
                    'Confirme a nova senha.';
                valido = false;
            } else if (nova.value !== confirmar.value) {
                document.getElementById('erroConfirmarSenha').textContent =
                    'As senhas não coincidem.';
                valido = false;
            }

            if (valido) {
                mostrarToast('Senha alterada com sucesso!');
                formSenha.reset();
            }
        });
    }

    // Endereço
    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');
    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
    const campoSalvarPerfil = document.getElementById('campoSalvarPerfil');

    if (campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }

    // Endereço
    const cep = document.getElementById('cep');
    const numeroEndereco = document.getElementById('numero');

    if (cep) {
        cep.addEventListener('input', function() {
            let valor = this.value
                .replace(/\D/g, '')
                .slice(0, 8);

            if (valor.length > 5) {
                valor = valor.replace(
                    /(\d{5})(\d)/,
                    '$1-$2'
                );
            }

            this.value = valor;
        });

        cep.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    if (numeroEndereco) {
        numeroEndereco.addEventListener('input', function() {
            this.value = this.value
                .replace(/\D/g, '');
        });

        numeroEndereco.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    if (btnAdicionarEndereco) {
        btnAdicionarEndereco.addEventListener('click', function() {
            formEndereco.reset();

            tituloEndereco.textContent =
                'Adicionar endereço';

            document.getElementById('pais').value =
                'Brasil';

            modalEndereco.classList.add('active');
        });
    }

    if (btnFecharEndereco) {
        btnFecharEndereco.addEventListener('click', function() {
            modalEndereco.classList.remove('active');
        });
    }

    if (btnCancelarEndereco) {
        btnCancelarEndereco.addEventListener('click', function() {
            modalEndereco.classList.remove('active');
        });
    }

    document.querySelectorAll('.editar-endereco').forEach(function(botao) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            tituloEndereco.textContent =
                'Editar endereço';

            document.getElementById('nomeIdentificacao').value =
                this.dataset.nome || '';

            document.getElementById('tipoEndereco').value =
                this.dataset.tipoEndereco || '';

            document.getElementById('tipoResidencia').value =
                this.dataset.tipoResidencia || '';

            document.getElementById('tipoLogradouro').value =
                this.dataset.tipoLogradouro || '';

            document.getElementById('cep').value =
                this.dataset.cep || '';

            document.getElementById('logradouro').value =
                this.dataset.logradouro || '';

            document.getElementById('bairro').value =
                this.dataset.bairro || '';

            document.getElementById('numero').value =
                this.dataset.numero || '';

            document.getElementById('estado').value =
                this.dataset.estado || '';

            document.getElementById('cidade').value =
                this.dataset.cidade || '';

            document.getElementById('pais').value =
                this.dataset.pais || 'Brasil';

            document.getElementById('observacoes').value =
                this.dataset.observacoes || '';

            if (salvarPerfil) {
                salvarPerfil.parentElement.hidden = true;
            }

            modalEndereco.classList.add('active');
        });
    });

    if (formEndereco) {
        formEndereco.addEventListener('submit', function(e) {
            e.preventDefault();

            mostrarToast('Endereço salvo com sucesso!');
            modalEndereco.classList.remove('active');
        });
    }



    // Cartão
    const modalCartao =
        document.getElementById('modalCadastrarCartao');

    const formCartao =
        document.getElementById('formCartao');

    const btnAdicionarCartao =
        document.querySelector('.btn-adicionar-cartao');

    const btnFecharCartao =
        document.getElementById('btnFecharModalCartao');

    const btnCancelarCartao =
        document.getElementById('btnCancelarCartao');

    const numeroCartao =
        document.getElementById('numeroCartao');

    const cvv =
        document.getElementById('cvvCartao');

    const validade =
        document.getElementById('validadeCartao');

    const campoSalvarCartao = document.getElementById('campoSalvarCartao');
    let editandoCartao = false;

    if (campoSalvarCartao) {
        campoSalvarCartao.style.display = 'none';
    }

    if (btnAdicionarCartao) {
        btnAdicionarCartao.addEventListener('click', function() {
            formCartao.reset();

            document.getElementById('tituloModalCartao').textContent =
                'Cadastrar cartão';

            modalCartao.classList.add('active');
        });
    }

    if (btnFecharCartao) {
        btnFecharCartao.addEventListener('click', function() {
            modalCartao.classList.remove('active');
        });
    }

    if (btnCancelarCartao) {
        btnCancelarCartao.addEventListener('click', function() {
            modalCartao.classList.remove('active');
        });
    }

    if (numeroCartao) {
        numeroCartao.addEventListener('input', function() {
            let valor = this.value
                .replace(/\D/g, '')
                .slice(0, 16);

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

    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value
                .replace(/\D/g, '')
                .slice(0, 4);
        });
    }

    if (validade) {
        validade.addEventListener('input', function() {
            let valor = this.value
                .replace(/\D/g, '')
                .slice(0, 4);

            if (valor.length > 2) {
                valor = valor.replace(
                    /(\d{2})(\d{1,2})/,
                    '$1/$2'
                );
            }

            this.value = valor;
        });
    }

    document.querySelectorAll('.editar-cartao').forEach(function(botao) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            editandoCartao = true;

            document.getElementById('tituloModalCartao').textContent =
                'Editar cartão';

            document.getElementById('btnSalvarCartao').textContent =
                'Salvar';

            document.getElementById('numeroCartao').value = '';

            document.getElementById('nomeCartao').value =
                this.dataset.nome || '';

            document.getElementById('bandeiraCartao').value =
                this.dataset.bandeira || '';

            document.getElementById('cvvCartao').value =
                this.dataset.cvv || '';

            document.getElementById('validadeCartao').value =
                this.dataset.validade || '';

            if (campoSalvarCartao) {
                campoSalvarCartao.hidden = true;
            }

            modalCartao.classList.add('active');
        });
    });

    if (formCartao) {
        formCartao.addEventListener('submit', function(e) {
            e.preventDefault();

            const erroNumeroCartao =
                document.getElementById('mensagemErroNumero');

            const erroValidadeCartao =
                document.getElementById('mensagemErroValidade');

            erroNumeroCartao.textContent = '';
            erroValidadeCartao.textContent = '';

            let valido = true;

            // Número do cartão
            const numero =
                numeroCartao.value.replace(/\D/g, '');

            if (numero.length !== 16) {
                erroNumeroCartao.textContent =
                    'Digite o número completo do cartão.';
                valido = false;
            }

            // Validade
            const valorValidade =
                validade.value.trim();

            const partes =
                valorValidade.split('/');

            if (
                partes.length !== 2 ||
                partes[0].length !== 2 ||
                partes[1].length !== 2
            ) {
                erroValidadeCartao.textContent =
                    'Digite a validade no formato MM/AA.';
                valido = false;
            } else {
                const mes = parseInt(partes[0], 10);
                const ano = parseInt(partes[1], 10);

                if (mes < 1 || mes > 12) {
                    erroValidadeCartao.textContent =
                        'Digite um mês válido.';
                    valido = false;
                } else {
                    const hoje = new Date();

                    const anoAtual =
                        parseInt(
                            hoje.getFullYear().toString().slice(-2),
                            10
                        );

                    const mesAtual =
                        hoje.getMonth() + 1;

                    if (
                        ano < anoAtual ||
                        (ano === anoAtual && mes < mesAtual)
                    ) {
                        erroValidadeCartao.textContent =
                            'O cartão está vencido.';
                        valido = false;
                    }
                }
            }

            if (!valido) {
                return;
            }

           modalCartao.classList.remove('active');

           if (editandoCartao) {
               mostrarToast('Cartão alterado com sucesso!');
           } else {
               mostrarToast('Cartão cadastrado com sucesso!');
           }

           formCartao.reset();
        });
    }
});