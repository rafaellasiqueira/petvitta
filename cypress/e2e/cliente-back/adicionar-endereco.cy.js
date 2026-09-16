describe('Adição de endereço do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function abrirAdicaoEndereco() {
        cy.get('#btnAdicionarEndereco')
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


    // RN0023
    it('CT01 - Deve adicionar endereço com todos os dados válidos', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        validarToast('Endereço adicionado com sucesso!');
    });


    // RN0023
    it('CT02 - Não deve adicionar endereço sem o nome de identificação', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();

        validarToast('O nome de identificação é obrigatório.');
    });


    // RN0023
    it('CT03 - Não deve adicionar endereço sem tipo de residência', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoResidencia');

        enviarFormulario();

        validarToast('O tipo de residência é obrigatório.');
    });


    // RN0023
    it('CT04 - Não deve adicionar endereço sem tipo de logradouro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoLogradouro');

        enviarFormulario();

        validarToast('O tipo de logradouro é obrigatório.');
    });


    // RN0023
    it('CT05 - Não deve adicionar endereço sem logradouro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();

        validarToast('O logradouro é obrigatório.');
    });


    // RN0023
    it('CT06 - Não deve adicionar endereço sem número', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();

        validarToast('O número é obrigatório.');
    });


    // RN0023
    it('CT07 - Não deve adicionar endereço sem bairro', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();

        validarToast('O bairro é obrigatório.');
    });


    // RN0023
    it('CT08 - Não deve adicionar endereço sem CEP', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();

        validarToast('O CEP é obrigatório.');
    });


    // RN0023
    it('CT09 - Não deve adicionar endereço sem cidade', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();

        validarToast('A cidade é obrigatória.');
    });


    // RN0023
    it('CT10 - Não deve adicionar endereço sem estado', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('estado');

        enviarFormulario();

        validarToast('O estado é obrigatório.');
    });


    // RN0023
    it('CT11 - Não deve adicionar endereço sem país', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();

        validarToast('O país é obrigatório.');
    });


    // RN0023
    it('CT12 - Deve permitir adicionar endereço sem observações', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco #observacoes')
            .clear();

        enviarFormulario();

        validarToast('Endereço adicionado com sucesso!');
    });


    // RN0021 / RN0022
    it('CT13 - Deve permitir adicionar endereço de entrega', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');

        enviarFormulario();

        validarToast('Endereço adicionado com sucesso!');
    });


    // RN0021
    it('CT14 - Deve permitir adicionar endereço de cobrança', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança');

        enviarFormulario();

        validarToast('Endereço adicionado com sucesso!');
    });


    // RN0021 / RN0022
    it('CT15 - Deve permitir adicionar endereço de cobrança e entrega', () => {

        abrirAdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança e Entrega');

        enviarFormulario();

        validarToast('Endereço adicionado com sucesso!');
    });

});
