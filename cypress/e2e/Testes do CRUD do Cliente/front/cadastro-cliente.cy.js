describe('Cadastro de cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/cadastrar');
        cy.viewport(1280, 720);
    });

    function preencherDadosValidos() {
        cy.get('[name="nome"]').type('Sophia da Silva');
        cy.get('[name="cpf"]').type('33793306046');
        cy.get('[name="tipoTelefone"]').select('1');
        cy.get('[name="telefone"]').type('11954852669');
        cy.get('[name="genero"]').select('1');
        cy.get('[name="dataNascimento"]').type('2005-02-01');
        cy.get('[name="email"]').type('sophia123@gmail.com');
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
        cy.get('#formCadastroCliente')
            .find('button[type="submit"], input[type="submit"]')
            .click();
    }

    function validarErro(tipo, mensagem, indice = null) {
        if (indice !== null) {
            cy.get(tipo)
                .eq(indice)
                .should('be.visible')
                .and('have.text', mensagem);
        } else {
            cy.get(tipo)
                .should('be.visible')
                .and('have.text', mensagem);
        }
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0021/RN0026/RF0026/RF0027/RN0023/RN0024 - Deve cadastrar o cliente com todos os dados obrigatórios válidos', () => {

        cy.get('[name="nome"]').type('Sophia da Silva');
        cy.wait(300);

        cy.get('[name="cpf"]').type('53474733800');
        cy.wait(300);

        cy.get('[name="tipoTelefone"]').select('1');
        cy.wait(300);

        cy.get('[name="telefone"]').type('11954852669');
        cy.wait(300);

        cy.get('[name="genero"]').select('1');
        cy.wait(300);

        cy.get('[name="dataNascimento"]').type('2005-02-01');
        cy.wait(300);

        cy.get('[name="email"]').type('sophia123@gmail.com');
        cy.wait(300);

        cy.get('[name="senha"]').type('Sophia123@');
        cy.wait(300);

        cy.get('[name="confirmarSenha"]').type('Sophia123@');
        cy.wait(300);

        preencherEndereco(0, '1');
        cy.wait(1000);

        cy.get('#btnAdicionarEndereco').click();
        cy.wait(300);

        preencherEndereco(1, '2');
        cy.wait(300);

        preencherCartao(0, true);
        cy.wait(300);

        cy.get('#btnAdicionarCartao').click();
        cy.wait(300);

        preencherCartao(1, false);
        cy.wait(100);

        enviarFormulario();

        validarToast('Cadastro concluído com sucesso!');
    });

    it('RNF0031 - Não deve cadastrar com a senha menor que 8 caracteres', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste@');
        cy.wait(300);

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });

    it('RNF0031 - Não deve cadastrar com a senha não contendo uma letra maiúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('teste123@');
        cy.wait(300);

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos uma letra maiúscula.'
        );
    });


    it('RNF0031 - Não deve cadastrar com a senha não contendo uma letra minúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('TESTE123@');
        cy.wait(300);

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos uma letra minúscula.'
        );
    });

    it('RNF0031 - Não deve cadastrar com a senha não contendo um caractere especial', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste123');
        cy.wait(300);

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos um caractere especial.'
        );
    });

    it('RNF0032 - Não deve cadastrar com senhas diferentes', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste123@');
        cy.wait(300);

        cy.get('[name="confirmarSenha"]')
            .clear()
            .type('TESTE');

        enviarFormulario();

        validarErro(
            '#erroConfirmarSenha',
            'As senhas não coincidem.'
        );
    });

    it('RN0021 - Não deve cadastrar o cliente sem endereço de cobrança', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('2');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('2');
        cy.wait(7000);

        enviarFormulario();

        validarToast(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });

    it('RN0022 - Não deve cadastrar o cliente sem endereço de entrega', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('1');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('1');
        cy.wait(7000);

        enviarFormulario();

        validarToast(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });

    it('RN0026/RF0026/RN0023/RN0024 - Não deve cadastrar o cliente com dados obrigatórios vazios', () => {
        cy.wait(2000);
        enviarFormulario();

        // Dados do cliente
        validarErro(
            '#erroNome',
            'Preencha o nome.'
        );
        validarErro(
            '#erroCpf',
            'Preencha o CPF.'
        );
        validarErro(
            '#erroTipoTelefone',
            'Selecione o tipo de telefone.'
        );

        validarErro(
            '#erroTelefone',
            'Preencha o telefone.'
        );

        validarErro(
            '#erroGenero',
            'Selecione o gênero.'
        );

        validarErro(
            '#erroDataNascimento',
            'Preencha a data de nascimento.'
        );

        validarErro(
            '#erroEmail',
            'Preencha o e-mail.'
        );

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );

        // Endereço
        validarErro(
            '.erroNomeIdentificacao',
            'Preencha o nome com até 20 caracteres.',
            0
        );

        validarErro(
            '.erroTipoEndereco',
            'Selecione o tipo de endereço.',
            0
        );

        validarErro(
            '.erroTipoResidencia',
            'Selecione o tipo de residência.',
            0
        );

        validarErro(
            '.erroTipoLogradouro',
            'Selecione o tipo de logradouro.',
            0
        );

        validarErro(
            '.erroCep',
            'Preencha o CEP.',
            0
        );

        validarErro(
            '.erroLogradouro',
            'Preencha o logradouro.',
            0
        );

        validarErro(
            '.erroBairro',
            'Preencha o nome do bairro.',
            0
        );

        validarErro(
            '.erroNumero',
            'Preencha o número.',
            0
        );

        validarErro(
            '.erroEstado',
            'Selecione o estado.',
            0
        );

        validarErro(
            '.erroCidade',
            'Preencha o nome da cidade.',
            0
        );

        validarErro(
            '.erroPais',
            'Preencha o nome do país.',
            0
        );

        // Cartão
        validarErro(
            '.erroNumeroCartao',
            'Preencha o número do cartão.',
            0
        );

        validarErro(
            '.erroNomeCartao',
            'Preencha o nome do cartão.',
            0
        );

        validarErro(
            '.erroBandeiraCartao',
            'Selecione a bandeira do cartão.',
            0
        );

        validarErro(
            '.erroCvvCartao',
            'Preencha o CVV.',
            0
        );

    });
});

