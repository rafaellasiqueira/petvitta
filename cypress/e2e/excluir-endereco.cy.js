describe('Exclusão de endereço do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
        cy.wait(4000);
    });

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('CT01 - Deve permitir excluir endereço de cobrança', () => {
        cy.get('.item-endereco')
            .contains('Cobrança')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.wait(4000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Endereço excluído com sucesso!');
    });

    it('CT02 - Deve permitir excluir endereço de entrega', () => {
        cy.get('.item-endereco')
            .contains('Entrega')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.wait(4000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Endereço excluído com sucesso!');
    });

    it('RN0021 - Não deve permitir excluir o único endereço de cobrança', () => {
        cy.get('.item-endereco')
            .contains('Cobrança')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.wait(4000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast(
            'Não é possível excluir este endereço, pois você deve possuir ao menos um endereço de cobrança e um de entrega.'
        );
    });

    it('RN0022 - Não deve permitir excluir o único endereço de entrega', () => {
        cy.get('.item-endereco')
            .contains('Entrega')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.wait(4000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast(
            'Não é possível excluir este endereço, pois você deve possuir ao menos um endereço de cobrança e um de entrega.'
        );
    });
});