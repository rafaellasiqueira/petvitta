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
        cy.get('#formEndereco').then(($form) => {
            $form[0].submit();
        });
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

    it('RN0023/RF0026 - Não deve adicionar endereço sem o nome de identificação', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();
        validarToast('O nome de identificação deve ter no mínimo 3 e máximo 20 caracteres.');
    });

    it('RN0023 - Não deve adicionar endereço sem o tipo de endereço', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoEndereco"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O tipo de endereço é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem o tipo de residência', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoResidencia"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O tipo de residência é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem o tipo de logradouro', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoLogradouro"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O tipo de logradouro é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem logradouro', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();
        validarToast('O logradouro é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem número', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();
        validarToast('O número é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem bairro', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();
        validarToast('O bairro é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem CEP', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();
        validarToast('O CEP é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem cidade', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();
        validarToast('A cidade é obrigatória.');
    });

    it('RN0023 - Não deve adicionar endereço sem estado', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="estado"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O estado é obrigatório.');
    });

    it('RN0023 - Não deve adicionar endereço sem país', () => {
        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();
        validarToast('O país é obrigatório.');
    });
});
