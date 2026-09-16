describe('Exclusão de cartão do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }


    // RF0027
    it('CT01 - Deve permitir excluir cartão não preferencial', () => {

        cy.get('.item-cartao')
            .find('form[action="/cliente/tornar-cartao-preferencial"]')
            .first()
            .parents('.item-cartao')
            .find('.excluir-cartao')
            .click();

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Cartão excluído com sucesso!');
    });


    // RF0027
    it('CT02 - Deve permitir excluir cartão preferencial', () => {

        cy.get('.item-cartao')
            .contains('Preferencial')
            .parents('.item-cartao')
            .find('.excluir-cartao')
            .click();

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Cartão excluído com sucesso!');

        cy.get('.item-cartao')
            .contains('Preferencial')
            .should('exist');
    });

});