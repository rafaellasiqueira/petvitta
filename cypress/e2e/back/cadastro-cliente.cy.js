describe('Cadastro de cliente', () => {

    /*afterEach(() => {
        cy.pause();
    });*/

    beforeEach(() => {
        cy.visit('/cliente/cadastrar');
        cy.viewport(1280, 720);
    });

    function preencherDadosValidos() {
        cy.get('[name="nome"]').type('Sophia da Silva');
        cy.get('[name="cpf"]').type('17177963030');
        cy.get('[name="tipoTelefone"]').select('1');
        cy.get('[name="telefone"]').type('11954852669');
        cy.get('[name="genero"]').select('1');
        cy.get('[name="dataNascimento"]').type('2005-02-01');

        cy.get('[name="email"]').type('sophia@gmail.com');
        cy.get('[name="senha"]').type('Sophia123@');
        cy.get('[name="confirmarSenha"]').type('Sophia123@');

        preencherEndereco(0, '1');

        cy.get('#btnAdicionarEndereco').click();

        preencherEndereco(1, '2');

        preencherCartao(0, true);

        cy.get('#btnAdicionarCartao').click();

        preencherCartao(1, false);
    }

    function preencherEndereco(indice, tipoEndereco) {
        let nomeEndereco;
        let numero;

        if (indice === 0) {
            nomeEndereco = 'Casa';
            numero = '123';
        } else {
            nomeEndereco = 'Trabalho';
            numero = '456';
        }

        cy.get(`[name="enderecos[${indice}].nomeIdentificacao"]`).type(nomeEndereco);
        cy.get(`[name="enderecos[${indice}].tipoEndereco"]`).select(tipoEndereco);
        cy.get(`[name="enderecos[${indice}].tipoResidencia"]`).select('1');
        cy.get(`[name="enderecos[${indice}].tipoLogradouro"]`).select('1');
        cy.get(`[name="enderecos[${indice}].cep"]`).type('08775530');
        cy.get(`[name="enderecos[${indice}].logradouro"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].bairro"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].numero"]`).type(numero);
        cy.get(`[name="enderecos[${indice}].estado"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].cidade"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].pais"]`).type('Brasil');
    }

    function preencherCartao(indice, preferencial = false) {
        cy.get(`[name="cartoes[${indice}].numero"]`).type('5303891175233860');
        cy.get(`[name="cartoes[${indice}].nomeImpresso"]`).type('SOPHIA D SILVA');
        cy.get(`[name="cartoes[${indice}].bandeira"]`).select('1');
        cy.get(`[name="cartoes[${indice}].codigoSeguranca"]`).type('1234');

        if (preferencial) {
            cy.get(`[name="cartoes[${indice}].preferencial"][value="true"]`).check();
        }
    }

    function enviarFormulario() {
        cy.get('#formCadastroCliente').then(($form) => {
            $form[0].submit();
        });
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0021/RN0026 - Deve cadastrar o cliente com todos os dados obrigatórios válidos', () => {
        preencherDadosValidos();
        enviarFormulario();
        validarToast('Cadastro concluído com sucesso!');
    });

    it('RNF0031 - Não deve cadastrar com a senha menor que 8 caracteres', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste@');
        cy.get('[name="confirmarSenha"]').clear().type('Teste@');

        enviarFormulario();

        validarToast('A senha deve ter entre 8 e 100 caracteres.');
    });

    it('RNF0031 - Não deve cadastrar com a senha não contendo uma letra maiúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('teste123@');
        cy.get('[name="confirmarSenha"]').clear().type('teste123@');

        enviarFormulario();

        validarToast('A senha deve ter pelo menos uma letra maiúscula.');
    });

    it('RNF0031 - Não deve cadastrar com a senha não contendo uma letra minúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('TESTE123@');
        cy.get('[name="confirmarSenha"]').clear().type('TESTE123@');

        enviarFormulario();

        validarToast('A senha deve ter pelo menos uma letra minúscula.');
    });

    it('RNF0031 - Não deve cadastrar com a senha não contendo um caractere especial', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste123');
        cy.get('[name="confirmarSenha"]').clear().type('Teste123');

        enviarFormulario();

        validarToast('A senha deve ter pelo menos um caractere especial.');
    });

    it('RNF0032 - Não deve cadastrar com senhas diferentes', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste123@');
        cy.get('[name="confirmarSenha"]').clear().type('TESTE');

        enviarFormulario();

        validarToast('As senhas não coincidem.');
    });

    it('RN0021 - Não deve cadastrar o cliente sem endereço de cobrança', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('2');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('2');

        enviarFormulario();

        validarToast(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });

    it('RN0022 - Não deve cadastrar o cliente sem endereço de entrega', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('1');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('1');

        enviarFormulario();

        validarToast(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });

    it('RN0026 - Não deve cadastrar o cliente sem o nome', () => {
        preencherDadosValidos();
        cy.get('[name="nome"]').clear();
        enviarFormulario();
        validarToast('O nome é obrigatório.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem CPF', () => {
        preencherDadosValidos();
        cy.get('[name="cpf"]').clear();
        enviarFormulario();
        validarToast('O CPF é obrigatório.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem selecionar o tipo de telefone', () => {
        preencherDadosValidos();
        cy.get('[name="tipoTelefone"]').invoke('val', '');
        enviarFormulario();
        validarToast('O tipo de telefone é obrigatório.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem o telefone', () => {
        preencherDadosValidos();
        cy.get('[name="telefone"]').clear();
        enviarFormulario();
        validarToast('O telefone é obrigatório.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem selecionar o gênero', () => {
        preencherDadosValidos();
        cy.get('[name="genero"]').invoke('val', '');
        enviarFormulario();
        validarToast('O gênero é obrigatório.');
    });

    it('RN0026- Não deve cadastrar o cliente sem a data de nascimento', () => {
        preencherDadosValidos();
        cy.get('[name="dataNascimento"]').clear();
        enviarFormulario();
        validarToast('A data de nascimento é obrigatória.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem o email', () => {
        preencherDadosValidos();
        cy.get('[name="email"]').clear();
        enviarFormulario();
        validarToast('O e-mail é obrigatório.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem a senha', () => {
        preencherDadosValidos();
        cy.get('[name="senha"]').clear();
        enviarFormulario();
        validarToast('A senha deve ter entre 8 e 100 caracteres.');
    });

    it('RN0026 - Não deve cadastrar o cliente sem confirmar a senha', () => {
        preencherDadosValidos();
        cy.get('[name="confirmarSenha"]').clear();
        enviarFormulario();
        validarToast('A confirmação de senha é obrigatória.');
    });

    it('RF0026 - Não deve cadastrar o cliente sem identificação do endereço', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].nomeIdentificacao"]').clear();
        enviarFormulario();
        validarToast('O nome de identificação deve ter no mínimo 3 e máximo 20 caracteres.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem tipo de endereço', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].tipoEndereco"]').invoke('val', '');
        enviarFormulario();
        validarToast('O tipo de endereço é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem tipo de residência', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].tipoResidencia"]').invoke('val', '');
        enviarFormulario();
        validarToast('O tipo de residência é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem tipo de logradouro', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].tipoLogradouro"]').invoke('val', '');
        enviarFormulario();
        validarToast('O tipo de logradouro é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem CEP', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].cep"]').clear();
        enviarFormulario();
        validarToast('O CEP é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem logradouro', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].logradouro"]').clear();
        enviarFormulario();
        validarToast('O logradouro é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem bairro', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].bairro"]').clear();
        enviarFormulario();
        validarToast('O bairro é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem número', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].numero"]').clear();
        enviarFormulario();
        validarToast('O número é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem estado', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].estado"]').invoke('val', '');
        enviarFormulario();
        validarToast('O estado é obrigatório.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem cidade', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].cidade"]').clear();
        enviarFormulario();
        validarToast('A cidade é obrigatória.');
    });

    it('RN0023 - Não deve cadastrar o cliente sem país', () => {
        preencherDadosValidos();
        cy.get('[name="enderecos[0].pais"]').clear();
        enviarFormulario();
        validarToast('O país é obrigatório.');
    });

    it('RN0024 - Não deve cadastrar o cliente sem número do cartão', () => {
        preencherDadosValidos();
        cy.get('[name="cartoes[0].numero"]').clear();
        enviarFormulario();
        validarToast('O número do cartão é obrigatório.');
    });

    it('RN0024 - Não deve cadastrar o cliente sem nome impresso no cartão', () => {
        preencherDadosValidos();
        cy.get('[name="cartoes[0].nomeImpresso"]').clear();
        enviarFormulario();
        validarToast('O nome impresso no cartão deve ter entre 3 e 150 caracteres.');
    });

    it('RN0024 - Não deve cadastrar o cliente sem a bandeira do cartão', () => {
        preencherDadosValidos();
        cy.get('[name="cartoes[0].bandeira"]').invoke('val', '');
        enviarFormulario();
        validarToast('A bandeira do cartão é obrigatória.');
    });

    it('RN0024 - Não deve cadastrar o cliente sem código de segurança', () => {
        preencherDadosValidos();
        cy.get('[name="cartoes[0].codigoSeguranca"]').clear();
        enviarFormulario();
        validarToast('O código de segurança deve ter 3 ou 4 caracteres.');
    });
});