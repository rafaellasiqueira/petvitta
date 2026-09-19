describe('Alteração de endereço do cliente', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/cliente/perfil');
        cy.viewport(1280, 720);
        cy.wait(2000);
    });

    function abrirEdicaoEndereco() {
        cy.get('.editar-endereco')
            .first()
            .click();
    }

    function preencherEnderecoValido() {
        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear()
            .type('Casa Nova');

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');

        cy.get('#modalAdicionarEditarEndereco [name="tipoResidencia"]')
            .select('Casa');

        cy.get('#modalAdicionarEditarEndereco [name="tipoLogradouro"]')
            .select('Rua');

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear()
            .type('08710-000');

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear()
            .type('123');

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear()
            .type('Brasil');
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

    it('RNF0034/RN0023/RF0026 - Deve alterar um endereço com todos os dados válidos', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });

    it('RNF0034/RF0026 - Não deve alterar endereço sem o nome de identificação', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();
        validarToast('O nome de identificação deve ter no mínimo 3 e máximo 20 caracteres.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem o tipo de endereço', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoEndereco"]')
            .invoke('val', '');

        enviarFormulario();

        validarToast('O tipo de endereço é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem o tipo de residência', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoResidencia"]')
            .invoke('val', '');

        enviarFormulario();

        validarToast('O tipo de residência é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem tipo de logradouro', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="tipoLogradouro"]')
            .invoke('val', '');

        enviarFormulario();
        validarToast('O tipo de logradouro é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem logradouro', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();
        validarToast('O logradouro é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem número', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();
        validarToast('O número é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem bairro', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();
        validarToast('O bairro é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem CEP', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();
        validarToast('O CEP é obrigatório.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem cidade', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();
        validarToast('A cidade é obrigatória.');
    });

    it('RNF0034/RN0023 - Não deve alterar endereço sem estado', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('[name="estado"]')
            .invoke('val', '');

        enviarFormulario();

        validarToast('O estado é obrigatório.');
    });

    it('RNF0034/RN0023- Não deve alterar endereço sem país', () => {
        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();
        validarToast('O país é obrigatório.');
    });
});
