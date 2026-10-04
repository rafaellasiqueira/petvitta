describe('Inativação de cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/admin/clientes');
        cy.viewport(1280, 720);
        cy.wait(3000);
    });

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0023 - Deve permitir inativar um cliente ativo', () => {
        cy.get('table tbody tr')
            .eq(5)
            .find('.btn-inativar')
            .click();

        cy.get('#motivoInativar')
            .select(1);

        cy.get('#justificativaInativar')
            .type('Atividade suspeita identificada.');

        cy.wait(6000);

        cy.get('#btnInativarModal')
            .click();

        validarToast('Cliente inativado com sucesso!');
        cy.wait(4000);

        cy.visit('/cliente/produtos');
    });

    it('CT02 - Deve permitir ativar um cliente inativo', () => {
        cy.get('table tbody tr')
            .eq(5)
            .find('.btn-ativar')
            .click();

        cy.get('#motivoAtivar')
            .select(1);

        cy.get('#justificativaAtivar')
            .type('Conta revisada e regularizada.');

        cy.wait(6000);

        cy.get('#btnAtivarModal')
            .click();

        validarToast('Cliente ativado com sucesso!');
    });
});