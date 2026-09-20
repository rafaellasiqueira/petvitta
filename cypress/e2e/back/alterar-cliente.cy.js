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
        cy.wait(3000);
        cy.get('#formDadosPessoais').then((formulario) => {
            formulario[0].submit();
        });
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

    it('RN0026 - Deve alterar somente o nome do cliente', () => {
        cy.get('[name="nome"]')
            .clear()
            .type('Bruno Henrique Lima');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RN0026 - Deve alterar somente o telefone do cliente', () => {
        cy.get('[name="telefone"]')
            .clear()
            .type('11987654321');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RN0026 - Deve alterar somente o gênero do cliente', () => {
        cy.get('[name="genero"]')
            .select('3');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!');
    });

    it('RN0026 - Deve alterar somente a data de nascimento', () => {
        cy.get('[name="dataNascimento"]')
            .clear()
            .type('2005-01-23');

        enviarFormulario();
        validarToast('Dados salvos com sucesso!')
    });

    it('RN0026 - Deve validar nome obrigatório', () => {
        cy.get('[name="nome"]')
            .clear();

        enviarFormulario();
        validarToast('O nome deve ter no mínimo 3 caracteres e no máximo 150 caracteres.');
    });

    it('RN0026 - Deve validar tipo telefone obrigatório', () => {
        cy.get('[name="tipoTelefone"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O tipo de telefone é obrigatório.');
    });

    it('RN0026 - Deve validar telefone obrigatório', () => {
        cy.get('[name="telefone"]')
            .clear();

        enviarFormulario();
        validarToast('O telefone é obrigatório.');
    });

    it('RN0026 - Deve validar gênero obrigatório', () => {
        cy.get('[name="genero"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O gênero é obrigatório.');
    });

    it('RN0026 - Deve validar data de nascimento obrigatória', () => {
        cy.get('[name="dataNascimento"]')
            .clear();

        enviarFormulario();
        validarToast('A data de nascimento é obrigatória.');
    });
});