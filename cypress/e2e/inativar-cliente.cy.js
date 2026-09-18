describe('Inativação de cliente', () => {
    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/admin/clientes');
    });

    function preencherInativacao() {
        cy.get('#motivoInativar')
            .select(1);

        cy.get('#justificativaInativar')
            .type('Cliente solicitou a inativação.');
    }

    function preencherAtivacao() {
        cy.get('#motivoAtivar')
            .select(1);

        cy.get('#justificativaAtivar')
            .type('Cliente solicitou a ativação.');
    }

    function enviarFormularioInativar() {
        cy.get('#formInativarCliente')
            .then(($form) => {
                $form[0].submit();
            });
    }

    function enviarFormularioAtivar() {
        cy.get('#formAtivarCliente')
            .then(($form) => {
                $form[0].submit();
            });
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    // RF0023
    it('CT01 - Deve permitir inativar um cliente ativo', () => {

        cy.get('table tbody tr')
            .eq(5)
            .find('.btn-inativar')
            .click();

        preencherInativacao();
        enviarFormularioInativar();

        validarToast('Cliente inativado com sucesso!');

        cy.visit('/cliente/produtos');
    });

    // RF0023
    it('CT02 - Deve permitir ativar um cliente inativo', () => {

        cy.get('.btn-ativar')
            .first()
            .click();

        preencherAtivacao();
        enviarFormularioAtivar();

        validarToast('Cliente ativado com sucesso!');
    });

});