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
    document.querySelectorAll('.btn-mostrar-senha').forEach(botao => {
        botao.addEventListener('click', function() {
            const input = document.getElementById(this.dataset.input);
            const icone = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icone.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icone.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // CPF
    const cpf = document.getElementById('cpf');
    if (cpf) {
        cpf.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            this.value = v;
        });
    }

    // Telefone
    const telefone = document.getElementById('telefone');
    const tipoTelefone = document.getElementById('tipoTelefone');
    function mascaraTelefone() {
        if (!telefone || !tipoTelefone) return;
        let v = telefone.value.replace(/\D/g, '');
        if (tipoTelefone.value === 'fixo') {
            v = v.substring(0, 10);
            if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,4})(\d{0,4})$/, '($1) $2-$3');
            telefone.placeholder = '(00) 0000-0000';
        } else {
            v = v.substring(0, 11);
            if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
            telefone.placeholder = '(00) 00000-0000';
        }
        telefone.value = v;
    }
    if (telefone) telefone.addEventListener('input', mascaraTelefone);
    if (tipoTelefone) tipoTelefone.addEventListener('change', mascaraTelefone);

    // Dados pessoais
    const formDados = document.querySelector('.form-dados-pessoais');
    if (formDados) {
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
    }

    // Senha
    const formSenha = document.querySelector('.form-alterar-senha');
    if (formSenha) {
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
            } else if (!/[A-Z]/.test(nova.value) || !/[a-z]/.test(nova.value) || !/[^A-Za-z0-9]/.test(nova.value)) {
                document.getElementById('erroNovaSenha').textContent = 'A senha deve ter maiúscula, minúscula e caractere especial.';
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
    }

    // Endereço
    const modalEndereco = document.getElementById('modalAdicionarEditarEndereco');
    const formEndereco = document.getElementById('formEndereco');
    const tituloEndereco = document.getElementById('tituloModalEndereco');
    const cep = document.getElementById('cep');

    // CORRIGIDO: era 'ativo', o CSS espera 'active'
    function abrirEndereco() {
        if (modalEndereco) modalEndereco.classList.add('active');
    }

    // CORRIGIDO: era 'ativo', o CSS espera 'active'
    function fecharEndereco() {
        if (modalEndereco) modalEndereco.classList.remove('active');
    }

    const btnAdicionarEndereco = document.getElementById('btnAdicionarEndereco');
    if (btnAdicionarEndereco) {
        btnAdicionarEndereco.addEventListener('click', function() {
            if (!formEndereco) return;
            formEndereco.reset();
            tituloEndereco.textContent = 'Adicionar endereço';
            document.getElementById('pais').value = 'Brasil';
            abrirEndereco();
        });
    }

    const btnFecharEndereco = document.getElementById('btnFecharModalEndereco');
    const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
    if (btnFecharEndereco) btnFecharEndereco.addEventListener('click', fecharEndereco);
    if (btnCancelarEndereco) btnCancelarEndereco.addEventListener('click', fecharEndereco);

    // CEP
    if (cep) {
        cep.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 8);
            if (v.length > 5) v = v.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
            this.value = v;
        });
        cep.addEventListener('blur', async function() {
            const v = this.value.replace(/\D/g, '');
            if (v.length !== 8) return;
            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${v}/json/`);
                const dados = await resposta.json();
                if (dados.erro) {
                    mostrarToast('CEP não encontrado.');
                    return;
                }
                document.getElementById('logradouro').value = dados.logradouro || '';
                document.getElementById('bairro').value = dados.bairro || '';
                document.getElementById('cidade').value = dados.localidade || '';
                document.getElementById('estado').value = dados.uf || '';
                document.getElementById('pais').value = 'Brasil';
            } catch {
                mostrarToast('Erro ao consultar o CEP.');
            }
        });
    }

    // Editar endereço
    document.querySelectorAll('.editar-endereco').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!modalEndereco) return;
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
            abrirEndereco();
        });
    });

    // Salvar endereço
    if (formEndereco) {
        formEndereco.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!formEndereco.checkValidity()) {
                formEndereco.reportValidity();
                return;
            }
            mostrarToast('Endereço salvo com sucesso!');
            fecharEndereco();
        });
    }

    // Cartão
    const modalCartao = document.getElementById('modalCadastrarCartao');
    const formCartao = document.getElementById('formCartao');

    // CORRIGIDO: era 'ativo', o CSS espera 'active'
    function abrirCartao() {
        if (modalCartao) modalCartao.classList.add('active');
    }

    // CORRIGIDO: era 'ativo', o CSS espera 'active'
    function fecharCartao() {
        if (modalCartao) modalCartao.classList.remove('active');
    }

    const btnAdicionarCartao = document.querySelector('.btn-adicionar-cartao');
    if (btnAdicionarCartao) {
        btnAdicionarCartao.addEventListener('click', function() {
            if (!formCartao) return;
            formCartao.reset();
            document.getElementById('tituloModalCartao').textContent = 'Cadastrar cartão';
            abrirCartao();
        });
    }

    const btnFecharCartao = document.getElementById('btnFecharModalCartao');
    const btnCancelarCartao = document.getElementById('btnCancelarCartao');
    if (btnFecharCartao) btnFecharCartao.addEventListener('click', fecharCartao);
    if (btnCancelarCartao) btnCancelarCartao.addEventListener('click', fecharCartao);

    // Número cartão
    const numeroCartao = document.getElementById('numeroCartao');
    if (numeroCartao) {
        numeroCartao.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 16);
            v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
            this.value = v;
        });
    }

    // CVV
    const cvv = document.getElementById('cvvCartao');
    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Validade
    const validade = document.getElementById('validadeCartao');
    if (validade) {
        validade.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').substring(0, 4);
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            this.value = v;
        });
    }

    // Nome cartão
    const nomeCartao = document.getElementById('nomeCartao');
    if (nomeCartao) {
        nomeCartao.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
        });
    }

    // Editar cartão
    document.querySelectorAll('.editar-cartao').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!modalCartao) return;
            document.getElementById('tituloModalCartao').textContent = 'Editar cartão';
            document.getElementById('numeroCartao').value = '';
            document.getElementById('nomeCartao').value = this.dataset.nome || '';
            document.getElementById('bandeiraCartao').value = this.dataset.bandeira || '';
            document.getElementById('cvvCartao').value = this.dataset.cvv || '';
            document.getElementById('validadeCartao').value = this.dataset.validade || '';
            abrirCartao();
        });
    });

    // Salvar cartão
    if (formCartao) {
        formCartao.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!formCartao.checkValidity()) {
                formCartao.reportValidity();
                return;
            }
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
            fecharCartao();
        });
    }

    // Exclusão
    const modalExclusao = document.getElementById('modalConfirmarExclusao');
    const tituloExclusao = document.getElementById('tituloModalExclusao');
    const mensagemExclusao = document.getElementById('mensagemModalExclusao');

    // CORRIGIDO: era 'ativo', o CSS espera 'active'
    function fecharExclusao() {
        if (modalExclusao) modalExclusao.classList.remove('active');
    }

    const btnFecharExclusao = document.getElementById('btnFecharModalExclusao');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
    if (btnFecharExclusao) btnFecharExclusao.addEventListener('click', fecharExclusao);
    if (btnCancelarExclusao) btnCancelarExclusao.addEventListener('click', fecharExclusao);

    document.querySelectorAll('.excluir-endereco').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!modalExclusao) return;
            tituloExclusao.textContent = 'Excluir endereço';
            mensagemExclusao.textContent = `Deseja excluir o endereço "${this.dataset.nome}"?`;
            // CORRIGIDO: era 'ativo', o CSS espera 'active'
            modalExclusao.classList.add('active');
        });
    });

    document.querySelectorAll('.excluir-cartao').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!modalExclusao) return;
            tituloExclusao.textContent = 'Excluir cartão';
            mensagemExclusao.textContent = `Deseja excluir o cartão "${this.dataset.nome}"?`;
            // CORRIGIDO: era 'ativo', o CSS espera 'active'
            modalExclusao.classList.add('active');
        });
    });

    // Confirmar exclusão
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', function() {
            fecharExclusao();
            mostrarToast('Item excluído com sucesso!');
        });
    }
});