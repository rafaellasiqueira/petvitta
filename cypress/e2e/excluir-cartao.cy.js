describe('Exclusão de cartão do cliente', () => {

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

    it('CT01 - Deve permitir excluir cartão não preferencial', () => {
        cy.get('.item-cartao')
            .eq(1)
            .find('.excluir-cartao')
            .click();

        cy.wait(5000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Cartão excluído com sucesso!');
    });

    it('RF0027 - Deve permitir excluir cartão preferencial', () => {
        cy.get('.item-cartao')
            .contains('Preferencial')
            .parents('.item-cartao')
            .find('.excluir-cartao')
            .click();

        cy.wait(5000);

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Cartão excluído com sucesso!');

        cy.wait(4000);

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });
});