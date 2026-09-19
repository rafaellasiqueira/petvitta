describe('Alteração de dados cadastrais do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
        cy.wait(2000);
    });

    function enviarFormulario() {
        cy.get('#formDadosPessoais')
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

    it('RF0022 - Deve alterar os dados cadastrais do cliente', () => {
        cy.get('[name="nome"]')
            .clear()
            .type('Bruno Henrique');

        cy.get('[name="telefone"]')
            .clear()
            .type('11987654321');

        cy.get('[name="genero"]')
            .select('3');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RF0022 - Deve alterar somente o nome do cliente', () => {
        cy.get('[name="nome"]')
            .clear()
            .type('Bruno Henrique Lima');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RF0022 - Deve alterar somente o telefone do cliente', () => {
        cy.get('[name="telefone"]')
            .clear()
            .type('11987654321');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RF0022 - Deve alterar somente o gênero do cliente', () => {
        cy.get('[name="genero"]')
            .select('3');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RF0022 - Deve alterar somente a data de nascimento', () => {
        cy.get('[name="dataNascimento"]')
            .clear()
            .type('2005-01-23');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!')
    });

    it('RN0026 - Não deve permitir enviar com campos vazios', () => {
        cy.get('[name="nome"]')
            .clear();

        cy.get('[name="telefone"]')
            .clear();

        cy.get('[name="dataNascimento"]')
            .clear();

        enviarFormulario();

        validarErro(
            '#erroNome',
            'Preencha o nome.'
        );

        validarErro(
            '#erroTelefone',
            'Preencha o telefone.'
        );

        validarErro(
            '#erroDataNascimento',
            'Preencha a data de nascimento.'
        );
    });
});

