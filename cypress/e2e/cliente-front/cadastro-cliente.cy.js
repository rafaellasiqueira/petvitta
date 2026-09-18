
describe('Cadastro de cliente - Front-end', () => {

    beforeEach(() => {
        cy.visit('/cliente/cadastrar');
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

        cy.get(`[name="enderecos[${indice}].nomeIdentificacao"]`)
            .type(nomeEndereco);

        cy.get(`[name="enderecos[${indice}].tipoEndereco"]`)
            .select(tipoEndereco);

        cy.get(`[name="enderecos[${indice}].tipoResidencia"]`)
            .select('1');

        cy.get(`[name="enderecos[${indice}].tipoLogradouro"]`)
            .select('1');

        cy.get(`[name="enderecos[${indice}].cep"]`)
            .type('08775530');

        cy.get(`[name="enderecos[${indice}].logradouro"]`)
            .should('not.have.value', '');

        cy.get(`[name="enderecos[${indice}].bairro"]`)
            .should('not.have.value', '');

        cy.get(`[name="enderecos[${indice}].numero"]`)
            .type(numero);

        cy.get(`[name="enderecos[${indice}].estado"]`)
            .should('not.have.value', '');

        cy.get(`[name="enderecos[${indice}].cidade"]`)
            .should('not.have.value', '');

        cy.get(`[name="enderecos[${indice}].pais"]`)
            .type('Brasil');
    }

    function preencherCartao(indice, preferencial = false) {

        cy.get(`[name="cartoes[${indice}].numero"]`)
            .type('5303891175233860');

        cy.get(`[name="cartoes[${indice}].nomeImpresso"]`)
            .type('SOPHIA D SILVA');

        cy.get(`[name="cartoes[${indice}].bandeira"]`)
            .select('1');

        cy.get(`[name="cartoes[${indice}].codigoSeguranca"]`)
            .type('1234');

        if (preferencial) {
            cy.get(
                `[name="cartoes[${indice}].preferencial"][value="true"]`
            ).check();
        }
    }

    function enviarFormulario() {
        cy.get('#formCadastroCliente')
            .find('button[type="submit"], input[type="submit"]')
            .click();
    }

    function validarErro(seletor, mensagem) {

        cy.get(seletor)
            .should('be.visible')
            .and('have.text', mensagem);
    }


    // RN0026
    it('CT01 - Não deve cadastrar o cliente sem o nome', () => {

        preencherDadosValidos();

        cy.get('[name="nome"]').clear();

        enviarFormulario();

        validarErro(
            '#erroNome',
            'Preencha o nome.'
        );
    });


    // RN0026
    it('CT02 - Não deve cadastrar o cliente sem CPF', () => {

        preencherDadosValidos();

        cy.get('[name="cpf"]').clear();

        enviarFormulario();

        validarErro(
            '#erroCpf',
            'Preencha o CPF.'
        );
    });


    // RN0026
    it('CT03 - Não deve cadastrar o cliente sem selecionar o tipo de telefone', () => {

        preencherDadosValidos();

        cy.get('[name="tipoTelefone"]').invoke('val', '');

        enviarFormulario();

        validarErro(
            '#erroTipoTelefone',
            'Selecione o tipo de telefone.'
        );
    });


    // RN0026
    it('CT04 - Não deve cadastrar o cliente sem o telefone', () => {

        preencherDadosValidos();

        cy.get('[name="telefone"]').clear();

        enviarFormulario();

        validarErro(
            '#erroTelefone',
            'Preencha o telefone.'
        );
    });


    // RN0026
    it('CT05 - Não deve cadastrar o cliente sem selecionar o gênero', () => {

        preencherDadosValidos();

        cy.get('[name="genero"]').invoke('val', '');

        enviarFormulario();

        validarErro(
            '#erroGenero',
            'Selecione o gênero.'
        );
    });


    // RN0026
    it('CT06 - Não deve cadastrar o cliente sem a data de nascimento', () => {

        preencherDadosValidos();

        cy.get('[name="dataNascimento"]').clear();

        enviarFormulario();

        validarErro(
            '#erroDataNascimento',
            'Preencha a data de nascimento.'
        );
    });


    // RN0026
    it('CT07 - Não deve cadastrar o cliente sem o email', () => {

        preencherDadosValidos();

        cy.get('[name="email"]').clear();

        enviarFormulario();

        validarErro(
            '#erroEmail',
            'Preencha o e-mail.'
        );
    });


    // RN0026
    it('CT08 - Não deve cadastrar o cliente sem a senha', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]').clear();

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });


    // RN0026
    it('CT09 - Não deve cadastrar o cliente sem confirmar a senha', () => {

        preencherDadosValidos();

        cy.get('[name="confirmarSenha"]').clear();

        enviarFormulario();

        validarErro(
            '#erroConfirmarSenha',
            'As senhas não coincidem.'
        );
    });


    // RN0023
    it('CT10 - Não deve cadastrar o cliente sem identificação do endereço', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].nomeIdentificacao"]').clear();

        enviarFormulario();

        validarErro(
            '.erroNomeIdentificacao',
            'Preencha o nome de identificação.'
        );
    });


    // RN0023
    it('CT11 - Não deve cadastrar o cliente sem tipo de endereço', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]')
            .invoke('val', '');

        enviarFormulario();

        validarErro(
            '.erroTipoEndereco',
            'Selecione o tipo de endereço.'
        );
    });


    // RN0023
    it('CT12 - Não deve cadastrar o cliente sem tipo de residência', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoResidencia"]')
            .invoke('val', '');

        enviarFormulario();

        validarErro(
            '.erroTipoResidencia',
            'Selecione o tipo de residência.'
        );
    });


    // RN0023
    it('CT13 - Não deve cadastrar o cliente sem tipo de logradouro', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoLogradouro"]')
            .invoke('val', '');

        enviarFormulario();

        validarErro(
            '.erroTipoLogradouro',
            'Selecione o tipo de logradouro.'
        );
    });


    // RN0023
    it('CT14 - Não deve cadastrar o cliente sem CEP', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].cep"]').clear();

        enviarFormulario();

        validarErro(
            '.erroCep',
            'Preencha o CEP.'
        );
    });


    // RN0023
    it('CT15 - Não deve cadastrar o cliente sem logradouro', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].logradouro"]').clear();

        enviarFormulario();

        validarErro(
            '.erroLogradouro',
            'Preencha o logradouro.'
        );
    });


    // RN0023
    it('CT16 - Não deve cadastrar o cliente sem bairro', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].bairro"]').clear();

        enviarFormulario();

        validarErro(
            '.erroBairro',
            'Preencha o nome do bairro.'
        );
    });


    // RN0023
    it('CT17 - Não deve cadastrar o cliente sem número', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].numero"]').clear();

        enviarFormulario();

        validarErro(
            '.erroNumero',
            'Preencha o número.'
        );
    });


    // RN0023
    it('CT18 - Não deve cadastrar o cliente sem estado', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].estado"]')
            .invoke('val', '');

        enviarFormulario();

        validarErro(
            '.erroEstado',
            'Selecione o estado.'
        );
    });


    // RN0023
    it('CT19 - Não deve cadastrar o cliente sem cidade', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].cidade"]').clear();

        enviarFormulario();

        validarErro(
            '.erroCidade',
            'Preencha o nome da cidade.'
        );
    });


    // RN0023
    it('CT20 - Não deve cadastrar o cliente sem país', () => {

        preencherDadosValidos();

        cy.get('[name="enderecos[0].pais"]').clear();

        enviarFormulario();

        validarErro(
            '.erroPais',
            'Preencha o nome do país.'
        );
    });


    // RN0024
    it('CT21 - Não deve cadastrar o cliente sem número do cartão', () => {

        preencherDadosValidos();

        cy.get('[name="cartoes[0].numero"]').clear();

        enviarFormulario();

        validarErro(
            '.erroNumeroCartao',
            'Preencha o número do cartão.'
        );
    });


    // RN0024
    it('CT22 - Não deve cadastrar o cliente sem nome impresso no cartão', () => {

        preencherDadosValidos();

        cy.get('[name="cartoes[0].nomeImpresso"]').clear();

        enviarFormulario();

        validarErro(
            '.erroNomeCartao',
            'Preencha o nome do cartão.'
        );
    });


    // RN0024
    it('CT23 - Não deve cadastrar o cliente sem a bandeira do cartão', () => {

        preencherDadosValidos();

        cy.get('[name="cartoes[0].bandeira"]')
            .invoke('val', '');

        enviarFormulario();

        validarErro(
            '.erroBandeiraCartao',
            'Selecione a bandeira do cartão.'
        );
    });


    // RN0025
    it('CT24 - Não deve cadastrar o cliente sem código de segurança', () => {

        preencherDadosValidos();

        cy.get('[name="cartoes[0].codigoSeguranca"]').clear();

        enviarFormulario();

        validarErro(
            '.erroCvvCartao',
            'Preencha o CVV.'
        );
    });


    // RF0027
    it('CT25 - Não deve cadastrar dois cartões como preferenciais', () => {

        preencherDadosValidos();

        cy.get(
            '[name="cartoes[1].preferencial"][value="true"]'
        ).check();

        cy.get(
            '[name="cartoes[0].preferencial"][value="true"]'
        ).should('not.be.checked');

        cy.get(
            '[name="cartoes[1].preferencial"][value="true"]'
        ).should('be.checked');
    });


    // RNF0031
    it('CT26 - Não deve cadastrar com a senha menor que 8 caracteres', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste@');

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });


    // RNF0031
    it('CT27 - Não deve cadastrar com a senha não contendo uma letra maiúscula', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('teste123@');

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos uma letra maiúscula.'
        );
    });


    // RNF0031
    it('CT28 - Não deve cadastrar com a senha não contendo uma letra minúscula', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('TESTE123@');

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos uma letra minúscula.'
        );
    });


    // RNF0031
    it('CT29 - Não deve cadastrar com a senha não contendo um caractere especial', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste123');

        enviarFormulario();

        validarErro(
            '#erroSenha',
            'A senha deve ter pelo menos um caractere especial.'
        );
    });


    // RNF0032
    it('CT30 - Não deve cadastrar com senhas diferentes', () => {

        preencherDadosValidos();

        cy.get('[name="senha"]')
            .clear()
            .type('Teste123@');

        cy.get('[name="confirmarSenha"]')
            .clear()
            .type('TESTE');

        enviarFormulario();

        validarErro(
            '#erroConfirmarSenha',
            'As senhas não coincidem.'
        );
    });


    // Validação específica do front
    it('CT31 - Não deve cadastrar com CPF inválido', () => {

        preencherDadosValidos();

        cy.get('[name="cpf"]')
            .clear()
            .type('11111111111');

        enviarFormulario();

        validarErro(
            '#erroCpf',
            'Digite um CPF válido.'
        );
    });


    // Validação específica do front
    it('CT32 - Não deve cadastrar com e-mail inválido', () => {

        preencherDadosValidos();

        cy.get('[name="email"]')
            .clear()
            .type('email-invalido');

        enviarFormulario();

        validarErro(
            '#erroEmail',
            'Digite um e-mail válido.'
        );
    });

});

