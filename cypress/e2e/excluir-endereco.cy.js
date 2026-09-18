describe('Exclusão de endereço do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    // Tipo: Cobrança
    it('CT01 - Deve permitir excluir endereço de cobrança', () => {

        cy.get('.item-endereco')
            .contains('Cobrança')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Endereço excluído com sucesso!');
    });

    // Tipo: Entrega
    it('CT02 - Deve permitir excluir endereço de entrega', () => {

        cy.get('.item-endereco')
            .contains('Entrega')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Endereço excluído com sucesso!');
    });

    // Tipo: Cobrança e Entrega
    it('CT03 - Deve permitir excluir endereço de cobrança e entrega', () => {

        cy.get('.item-endereco')
            .contains('Entrega e Cobrança')
            .parents('.item-endereco')
            .find('.excluir-endereco')
            .click();

        cy.get('#btnConfirmarExclusao')
            .click();

        validarToast('Endereço excluído com sucesso!');
    });

});