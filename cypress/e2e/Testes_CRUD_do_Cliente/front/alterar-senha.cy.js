describe('Alteração de senha do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
        cy.wait(2000);
    });

    function enviarFormulario() {
        cy.wait(3000);
        cy.get('#formAlterarSenha')
            .find('button[type="submit"]')
            .click();
    }

    function validarErro(tipo, mensagem) {
        cy.get(tipo)
            .should('be.visible')
            .and('have.text', mensagem);
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0028/RN0031 - Deve alterar a senha com dados válidos', () => {
        cy.get('[name="senhaAtual"]')
            .type('PetVitta@123');

        cy.get('[name="novaSenha"]')
            .type('PetVitta@123');

        cy.get('[name="confirmarSenha"]')
            .type('PetVitta@123');

        enviarFormulario();
        validarToast('Senha alterada com sucesso!');
    });

    it('RF0028 - Não deve alterar a senha com a senha atual incorreta', () => {
        cy.get('[name="senhaAtual"]')
            .type('SenhaIncorreta@123');

        cy.get('[name="novaSenha"]')
            .type('NovaSenha@123');

        cy.get('[name="confirmarSenha"]')
            .type('NovaSenha@123');

        enviarFormulario();
        validarToast('A senha atual está incorreta.');
    });

    it('RF0028/RN0031 - Não deve aceitar nova senha com menos de 8 caracteres', () => {
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

    it('RF0028/RN0031 - Não deve aceitar nova senha sem letra maiúscula', () => {
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

    it('RF0028/RN0031 - Não deve aceitar nova senha sem letra minúscula', () => {

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

    it('RF0028/RN0031 - Não deve aceitar nova senha sem caractere especial', () => {
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

    it('RF0028/RNF0032 - Não deve alterar quando a confirmação da senha for diferente', () => {
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

    it('RF0028/RN0031 - Não deve alterar com os campos vazios', () => {
        enviarFormulario();

        validarErro(
            '#erroSenhaAtual',
            'Digite sua senha atual.'
        );

        validarErro(
            '#erroNovaSenha',
            'A senha deve ter pelo menos 8 caracteres.'
        );
    });
});

