describe('Alteração de endereço do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
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

    function selecionarVazio(nome) {
        cy.get(`#modalAdicionarEditarEndereco [name="${nome}"] option[value=""]`)
            .invoke('removeAttr', 'disabled');

        cy.get(`#modalAdicionarEditarEndereco [name="${nome}"]`)
            .select('');
    }


    // RNF0034
    it('CT01 - Deve alterar um endereço com todos os dados válidos', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });


    // RN0023
    it('CT02 - Não deve alterar endereço sem o nome de identificação', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();

        validarToast('O nome de identificação é obrigatório.');
    });


    // RN0023
    it('CT03 - Não deve alterar endereço sem tipo de residência', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoResidencia');

        enviarFormulario();

        validarToast('O tipo de residência é obrigatório.');
    });


    // RN0023
    it('CT04 - Não deve alterar endereço sem tipo de logradouro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoLogradouro');

        enviarFormulario();

        validarToast('O tipo de logradouro é obrigatório.');
    });


    // RN0023
    it('CT05 - Não deve alterar endereço sem logradouro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();

        validarToast('O logradouro é obrigatório.');
    });


    // RN0023
    it('CT06 - Não deve alterar endereço sem número', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();

        validarToast('O número é obrigatório.');
    });


    // RN0023
    it('CT07 - Não deve alterar endereço sem bairro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();

        validarToast('O bairro é obrigatório.');
    });


    // RN0023
    it('CT08 - Não deve alterar endereço sem CEP', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();

        validarToast('O CEP é obrigatório.');
    });


    // RN0023
    it('CT09 - Não deve alterar endereço sem cidade', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();

        validarToast('A cidade é obrigatória.');
    });


    // RN0023
    it('CT10 - Não deve alterar endereço sem estado', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('estado');

        enviarFormulario();

        validarToast('O estado é obrigatório.');
    });


    // RN0023
    it('CT11 - Não deve alterar endereço sem país', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();

        validarToast('O país é obrigatório.');
    });


    // RN0023
    it('CT12 - Pode alterar endereço sem informar observações', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="observacoes"]')
            .clear();

        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });


    // RNF0034
    it('CT13 - Deve permitir alterar somente o endereço', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');

        cy.get('[name="nome"]')
            .should('have.value', 'Bruno Henrique');
    });


    // RN0022 / RNF0034
    it('CT14 - Deve permitir alterar endereço de entrega', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');

        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });


    // RN0021 / RNF0034
    it('CT15 - Deve permitir alterar endereço de cobrança', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança');

        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });


    // RN0021 / RN0022 / RNF0034
    it('CT16 - Deve permitir alterar endereço de entrega e cobrança', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança e Entrega');

        enviarFormulario();

        validarToast('Endereço alterado com sucesso!');
    });

});
