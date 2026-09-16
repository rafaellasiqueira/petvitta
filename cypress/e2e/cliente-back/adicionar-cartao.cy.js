describe('Adição de cartão do cliente', () => {
    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function abrirAdicaoCartao() {
        cy.get('#btnAbrirCartao')
            .click();
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
        cy.get('#formCartao').then(($form) => {
            $form[0].submit();
        });
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    // RN0024 / RN0025
    it('CT01 - Deve adicionar cartão com todos os dados válidos', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        enviarFormulario();

        validarToast('Cartão adicionado com sucesso!');
    });


    // RN0024
    it('CT02 - Não deve adicionar cartão sem o número', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear();

        enviarFormulario();

        validarToast('O número do cartão é obrigatório.');
    });


    // RN0024
    it('CT03 - Não deve adicionar cartão sem o nome impresso', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="nomeImpresso"]')
            .clear();

        enviarFormulario();

        validarToast('O nome impresso no cartão deve ter entre 3 e 150 caracteres.');
    });


    // RN0024 / RN0025
    it('CT04 - Não deve adicionar cartão sem informar a bandeira', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="bandeira"] option[value=""]')
            .invoke('removeAttr', 'disabled');

        cy.get('#modalCadastrarCartao [name="bandeira"]')
            .select('');

        enviarFormulario();

        validarToast('A bandeira do cartão é obrigatória.');
    });


    // RN0024
    it('CT05 - Não deve adicionar cartão sem código de segurança', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#modalCadastrarCartao [name="codigoSeguranca"]')
            .clear();

        enviarFormulario();

        validarToast('O código de segurança é obrigatório.');
    });

    // RF0027
    it('CT06 - Deve permitir adicionar cartão como preferencial', () => {

        abrirAdicaoCartao();
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


    // RF0027
    it('CT07 - Deve permitir adicionar cartão sem torná-lo preferencial', () => {

        abrirAdicaoCartao();
        preencherCartaoValido();

        cy.get('#cartaoPreferencial')
            .should('not.be.checked');

        enviarFormulario();

        validarToast('Cartão adicionado com sucesso!');
    });


    // RF0027
    it('CT08 - Deve permitir tornar um cartão já cadastrado como preferencial', () => {

        cy.get('.item-cartao')
            .find('form[action="/cliente/tornar-cartao-preferencial"]')
            .eq(1)
            .find('button')
            .click();

        validarToast('Cartão definido como preferencial.');

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });

});