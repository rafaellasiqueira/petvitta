
describe('Alteração de senha do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function enviarFormulario() {
        cy.get('#formAlterarSenha')
            .find('button[type="submit"]')
            .click();
    }

    function validarErro(seletor, mensagem) {
        cy.get(seletor)
            .should('be.visible')
            .and('have.text', mensagem);
    }


    // RF0022
    it('CT01 - Não deve aceitar nova senha com menos de 8 caracteres', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('Ab@123');

        cy.get('[name="confirmarSenha"]')
            .type('Ab@123');

        enviarFormulario();

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });


    // RF0022
    it('CT02 - Não deve aceitar nova senha sem letra maiúscula', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('novasenha@123');

        cy.get('[name="confirmarSenha"]')
            .type('novasenha@123');

        enviarFormulario();

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos uma letra maiúscula.'
        );
    });


    // RF0022
    it('CT03 - Não deve aceitar nova senha sem letra minúscula', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('NOVASENHA@123');

        cy.get('[name="confirmarSenha"]')
            .type('NOVASENHA@123');

        enviarFormulario();

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos uma letra minúscula.'
        );
    });


    // RF0022
    it('CT04 - Não deve aceitar nova senha sem caractere especial', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('NovaSenha123');

        cy.get('[name="confirmarSenha"]')
            .type('NovaSenha123');

        enviarFormulario();

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos um caractere especial.'
        );
    });


    // RF0022
    it('CT05 - Não deve alterar quando a confirmação da senha for diferente', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('NovaSenha@123');

        cy.get('[name="confirmarSenha"]')
            .type('OutraSenha@123');

        enviarFormulario();

        validarErro(
            '#erroConfirmarSenha',
            'As senhas não coincidem.'
        );
    });


    // RF0022
    it('CT06 - Não deve alterar com a senha atual vazia', () => {

        cy.get('[name="novaSenha"]')
            .type('NovaSenha@123');

        cy.get('[name="confirmarSenha"]')
            .type('NovaSenha@123');

        enviarFormulario();

        validarErro(
            '#erroSenhaAtual',
            'Digite sua senha atual.'
        );
    });


    // RF0022
    it('CT07 - Não deve alterar com a nova senha vazia', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="confirmarSenha"]')
            .type('NovaSenha@123');

        enviarFormulario();

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });


    // RF0022
    it('CT08 - Não deve alterar com a confirmação da nova senha vazia', () => {

        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('NovaSenha@123');

        enviarFormulario();

        validarErro(
            '#erroConfirmarSenha',
            'As senhas não coincidem.'
        );
    });

});

