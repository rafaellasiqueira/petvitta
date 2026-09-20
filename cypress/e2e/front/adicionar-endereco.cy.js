describe('Adicionar endereço do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
        cy.wait(2000);
    });

    function abrirAdicaoEndereco() {
        cy.get('#btnAdicionarEndereco')
            .click();
    }

    function preencherEnderecoValido() {
        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear()
            .type('Casa Nova');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="tipoResidencia"]')
            .select('Casa');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="tipoLogradouro"]')
            .select('Rua');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear()
            .type('08710-000');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear()
            .type('123');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear()
            .type('Brasil');
        cy.wait(500);
    }

    function enviarFormulario() {
        cy.get('#btnSalvarEndereco')
            .click();
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RN0023/RF0026 - Deve adicionar endereço com todos os dados válidos', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();
        cy.wait(7000);
        enviarFormulario();
        validarToast('Endereço adicionado com sucesso!');
    });

    it('RN0023/RF0026 - Não deve adicionar com campos vazios', () => {
        abrirAdicaoEndereco();

        enviarFormulario();

        cy.get('.erroNomeIdentificacao')
            .should('have.text', 'Preencha o nome com até 20 caracteres.');

        cy.get('.erroTipoEndereco')
            .should('have.text', 'Selecione o tipo de endereço.');

        cy.get('.erroTipoResidencia')
            .should('have.text', 'Selecione o tipo de residência.');

        cy.get('.erroTipoLogradouro')
            .should('have.text', 'Selecione o tipo de logradouro.');

        cy.get('.erroLogradouro')
            .should('have.text', 'Preencha o logradouro.');

        cy.get('.erroNumero')
            .should('have.text', 'Preencha o número.');

        cy.get('.erroBairro')
            .should('have.text', 'Preencha o nome do bairro.');

        cy.get('.erroCep')
            .should('have.text', 'Preencha o CEP.');

        cy.get('.erroPais')
            .should('have.text', 'Preencha o nome do país.');

        cy.get('.erroCidade')
            .should('have.text', 'Preencha o nome da cidade.');

        cy.get('.erroEstado')
            .should('have.text', 'Selecione o estado.');

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');
    });
});
