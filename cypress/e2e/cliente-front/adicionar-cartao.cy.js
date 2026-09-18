describe('dicionar cartão', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function abrirAdicaoCartao() {
        cy.get('#btnAbrirCartao').click();
    }

    function preencherCartaoValido() {
        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear()
            .type('4111111111111111');

        cy.get('#modalCadastrarCartao [name="nomeImpresso"]')
            .clear()
            .type('BRUNO HENRIQUE LIMA');

        cy.get('#modalCadastrarCartao [name="bandeira"]')
            .select(1);

        cy.get('#modalCadastrarCartao [name="codigoSeguranca"]')
            .clear()
            .type('123');
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

    it('RN0024 - Deve adicionar cartão com todos os dados válidos', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();
        enviarFormulario()
        validarToast('Cartão adicionado com sucesso!');
    });

    it('RN0024 - Não deve adicionar cartão sem o número', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear();

        enviarFormulario();

        cy.get('#erroNumeroCartao')
            .should('have.text', 'Preencha o número do cartão.');
    });

    it('RN0024 - Não deve adicionar cartão sem o nome impresso', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="nomeImpresso"]')
            .clear();

        enviarFormulario();

        cy.get('#erroNomeCartao')
            .should('have.text', 'Preencha o nome impresso no cartão.');
    });

    it('RN0025 - Não deve adicionar cartão sem informar a bandeira', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="bandeira"] option[value=""]')
            .invoke('removeAttr', 'disabled');

        cy.get('#modalCadastrarCartao [name="bandeira"]')
            .select('');

        enviarFormulario();

        cy.get('#erroBandeira')
            .should('have.text', 'Selecione a bandeira do cartão.');
    });

    it('RN0024 - Não deve adicionar cartão sem código de segurança', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="codigoSeguranca"]')
            .clear();

        enviarFormulario();

        cy.get('#erroCVV')
            .should('have.text', 'Preencha o código de segurança.');
    });

    it('RF0027 - Deve permitir adicionar cartão como preferencial', () => {
        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear()
            .type('1234567812345678');

        enviarFormulario();

        cy.get('#erroNumeroCartao')
            .should('have.text', 'Número do cartão inválido.');
    });


    it('RF0027 - Deve permitir tornar um cartão já cadastrado como preferencial', () => {
        cy.get('.item-cartao')
            .eq(1)
            .find('form[action="/cliente/tornar-cartao-preferencial"]')
            .find('button')
            .click();

        validarToast('Cartão definido como preferencial.');

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });
});