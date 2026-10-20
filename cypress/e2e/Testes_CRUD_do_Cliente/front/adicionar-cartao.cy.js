describe('Adicionar cartão', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
    });

    function preencherCartaoValido() {
        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear()
            .type('4111111111111111');
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="nomeImpresso"]')
            .clear()
            .type('BRUNO HENRIQUE LIMA');
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="bandeira"]')
            .select(1);
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="codigoSeguranca"]')
            .clear()
            .type('123');
        cy.wait(1000);
    }

    function enviarFormulario() {
        cy.get('#btnSalvarCartao')
            .click();
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RN0024/RN0025 - Deve adicionar cartão com todos os dados válidos', () => {
        cy.get('#btnAbrirCartao')
            .click();
        preencherCartaoValido();
        enviarFormulario()
        validarToast('Cartão adicionado com sucesso!');
    });

    it('RF0027 - Deve permitir adicionar cartão como preferencial', () => {
        cy.get('#btnAbrirCartao')
            .click();
        preencherCartaoValido();

        cy.get('#cartaoPreferencial')
            .check();

        cy.get('#cartaoPreferencial')
            .should('be.checked');

        enviarFormulario();
        validarToast('Cartão adicionado com sucesso!');

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });

    it('RF0027 - Deve permitir tornar um cartão já cadastrado como preferencial', () => {
        cy.get('.item-cartao')
            .eq(0)
            .find('.status-cartao')
            .click();

        validarToast('Cartão definido como preferencial.');

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });

    it('RN0024/RN0025 - Não deve permitir adicionar com dados vazios', () => {
        cy.get('#btnAbrirCartao')
            .click();
        enviarFormulario();

        cy.get('#erroNumeroCartao')
            .should('have.text', 'Preencha o número do cartão.');

        cy.get('#erroNomeCartao')
            .should('have.text', 'Preencha o nome impresso no cartão.');

        cy.get('#erroBandeira')
            .should('have.text', 'Selecione a bandeira do cartão.');

        cy.get('#erroCVV')
            .should('have.text', 'Preencha o código de segurança.');
    });
});