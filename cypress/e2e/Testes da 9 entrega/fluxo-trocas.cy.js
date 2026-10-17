describe('Fluxo de trocas', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0041/RN0041/RN0043 - Solicitar uma troca', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(3000);

        cy.get('.btn-solicitar-troca')
            .eq(0)
            .click();

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .first()
            .check();

        cy.get('.modal.active .motivo-troca')
            .select(1);

        cy.get('.modal.active .justificativa-troca')
            .type('Recebi o produto "Ração Premium Cães Adultos Frango" em vez do produto "Ração Bionatural Prime para Cães Adultos Raças Médias e Grandes".');

        cy.wait(3000);

        cy.get('.modal.active #btnSolicitarTroca')
            .should('be.visible')
            .should('be.enabled')
            .click();

        validarToast("Troca solicitada com sucesso!");
    });


    it('RF0041/RN0041/RN0043 - Solicitar uma troca de somente um produto', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(3000);

        cy.get('.btn-solicitar-troca')
            .eq(0)
            .click();

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .first()
            .check();

        cy.get('.modal.active .motivo-troca')
            .select(1);

        cy.get('.modal.active .justificativa-troca')
            .type('Recebi o produto "Ração Premium Cães Adultos Frango" em vez do produto "Ração Bionatural Prime para Cães Adultos Raças Médias e Grandes".');

        cy.wait(3000);

        cy.get('.modal.active #btnSolicitarTroca')
            .should('be.visible')
            .should('be.enabled')
            .click();

        validarToast("Troca solicitada com sucesso!");
    });

    it('RF0042/RF0043/RN0046 - Autorizar uma troca e gerar uma notificação', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/trocas');

        cy.wait(3000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .select('Troca Autorizada');

        cy.get('#modalStatusTroca')
            .should('be.visible');

        cy.wait(2000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(1)
            .find('.dropdown')
            .select('Troca Autorizada');

        cy.get('#modalStatusTroca')
            .should('be.visible');

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.visit('/cliente/notificacao');

        cy.wait(5000);

        cy.visit('/cliente/pedido');
    });

    it('RF0042 - Recusar uma troca', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/trocas');

        cy.wait(3000);

        cy.get('table tbody tr')
            .eq(2)
            .find('.dropdown')
            .select('Troca Recusada');

        cy.get('#modalStatusTroca')
            .should('be.visible');

        cy.wait(2000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(5000);

        cy.visit('/cliente/pedido');
    });

    it('CT005 - Enviar o item', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(2000);

        cy.get('.btn-enviado')
            .should('have.length.at.least', 1)
            .first()
            .click();

        cy.visit('/cliente/pedido');

        cy.get('.btn-enviado')
            .should('have.length.at.least', 1)
            .first()
            .click();
    });

    it('RF0044/RF0045/RF0054/RN0042 - Receber o item e mudar o status para TROCADO', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.visit('/admin/trocas');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .select('Item Recebido');

        cy.get('.modal')
            .should('be.visible');

        cy.wait(2000);

        cy.get('.modal.active')
            .find('.btn-cancelar')
            .click();

        cy.wait(4000);

        cy.visit('/admin/estoque');

        cy.wait(4000);

        cy.visit('/admin/trocas');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(1)
            .find('.dropdown')
            .select('Item Recebido');

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .eq(0)
            .check();

        cy.wait(2000);

        cy.get('.modal.active')
            .find('.btn-confirmar-retorno')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(4000);

        cy.visit('/admin/estoque');
    });

});
