describe('Atualizar status do pedido', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0039/RN0039 - Atualizar status para EM TRANSPORTE', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/pedidos');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(3)
            .find('.dropdown')
            .wait(1000)
            .select('Em transporte');

        cy.get('#modalStatusPedido')
            .should('be.visible');

        cy.wait(1000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(3000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.visit('/cliente/pedido');
    });

    it('RF0040/RN0040 - Atualizar status para ENTREGUE', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/pedidos');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(3)
            .find('.dropdown')
            .wait(1000)
            .select('Entregue');

        cy.get('#modalStatusPedido')
            .should('be.visible');

        cy.wait(3000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.visit('/cliente/pedido');
    });


});