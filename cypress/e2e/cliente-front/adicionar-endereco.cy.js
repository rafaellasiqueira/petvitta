describe('Adicionar endereço do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function abrirAdicaoEndereco() {
        cy.get('#btnAdicionarEndereco')
            .click();
    }

    function preencherEnderecoValido() {
        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear()
            .type('Casa Nova');

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');

        cy.get('#modalAdicionarEditarEndereco [name="tipoResidencia"]')
            .select('Casa');

        cy.get('#modalAdicionarEditarEndereco [name="tipoLogradouro"]')
            .select('Rua');

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear()
            .type('08710-000');

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear()
            .type('123');

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear()
            .type('Brasil');
    }

    function enviarFormulario() {
        cy.get('#btnSalvarEndereco')
            .click();
    }

    function selecionarVazio(nome) {
        cy.get(`#modalAdicionarEditarEndereco [name="${nome}"]`)
            .invoke('val', '');
    }


    // RN0023
    it('RN0023 - Deve adicionar endereço com todos os dados válidos', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT02 - Não deve adicionar endereço sem o nome de identificação', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();

        cy.get('.erroNomeIdentificacao')
            .should('have.text', 'Preencha o nome de identificação.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT03 - Não deve adicionar endereço sem tipo de residência', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoResidencia');

        enviarFormulario();

        cy.get('.erroTipoResidencia')
            .should('have.text', 'Selecione o tipo de residência.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT04 - Não deve adicionar endereço sem tipo de logradouro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoLogradouro');

        enviarFormulario();

        cy.get('.erroTipoLogradouro')
            .should('have.text', 'Selecione o tipo de logradouro.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT05 - Não deve adicionar endereço sem logradouro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();

        cy.get('.erroLogradouro')
            .should('have.text', 'Preencha o logradouro.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT06 - Não deve adicionar endereço sem número', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();

        cy.get('.erroNumero')
            .should('have.text', 'Preencha o número.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT07 - Não deve adicionar endereço sem bairro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();

        cy.get('.erroBairro')
            .should('have.text', 'Preencha o nome do bairro.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT08 - Não deve adicionar endereço sem CEP', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();

        cy.get('.erroCep')
            .should('have.text', 'Preencha o CEP.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT09 - Não deve adicionar endereço sem cidade', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();

        cy.get('.erroCidade')
            .should('have.text', 'Preencha o nome da cidade.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT10 - Não deve adicionar endereço sem estado', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('estado');

        enviarFormulario();

        cy.get('.erroEstado')
            .should('have.text', 'Selecione o estado.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT11 - Não deve adicionar endereço sem país', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();

        cy.get('.erroPais')
            .should('have.text', 'Preencha o nome do país.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0023
    it('CT12 - Deve permitir adicionar endereço sem observações', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco #observacoes')
            .clear();

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0021 / RN0022
    it('CT13 - Deve permitir adicionar endereço de entrega', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0021
    it('CT14 - Deve permitir adicionar endereço de cobrança', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança');

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });


    // RN0021 / RN0022
    it('CT15 - Deve permitir adicionar endereço de cobrança e entrega', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança e Entrega');

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });

});
