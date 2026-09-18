
describe('Alteração de endereço do cliente', () => {
    afterEach(() => {
        cy.pause();
    });
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
        cy.get('#btnSalvarEndereco')
            .click();
    }

    function validarErro(seletor, mensagem) {
        cy.get(seletor)
            .should('be.visible')
            .and('have.text', mensagem);
    }

    function selecionarVazio(nome) {
        cy.get(`#modalAdicionarEditarEndereco [name="${nome}"]`)
            .invoke('val', '');
    }


    // RNF0034
    it('CT01 - Deve alterar um endereço com todos os dados válidos', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');
    });


    // RN0023
    it('CT02 - Não deve alterar endereço sem o nome de identificação', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroNomeIdentificacao',
            'Preencha o nome de identificação.'
        );
    });


    // RN0023
    it('CT03 - Não deve alterar endereço sem tipo de residência', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoResidencia');

        enviarFormulario();

        validarErro(
            '.erroTipoResidencia',
            'Selecione o tipo de residência.'
        );
    });


    // RN0023
    it('CT04 - Não deve alterar endereço sem tipo de logradouro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('tipoLogradouro');

        enviarFormulario();

        validarErro(
            '.erroTipoLogradouro',
            'Selecione o tipo de logradouro.'
        );
    });


    // RN0023
    it('CT05 - Não deve alterar endereço sem logradouro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroLogradouro',
            'Preencha o logradouro.'
        );
    });


    // RN0023
    it('CT06 - Não deve alterar endereço sem número', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroNumero',
            'Preencha o número.'
        );
    });


    // RN0023
    it('CT07 - Não deve alterar endereço sem bairro', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroBairro',
            'Preencha o nome do bairro.'
        );
    });


    // RN0023
    it('CT08 - Não deve alterar endereço sem CEP', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroCep',
            'Preencha o CEP.'
        );
    });


    // RN0023
    it('CT09 - Não deve alterar endereço sem cidade', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroCidade',
            'Preencha o nome da cidade.'
        );
    });


    // RN0023
    it('CT10 - Não deve alterar endereço sem estado', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        selecionarVazio('estado');

        enviarFormulario();

        validarErro(
            '.erroEstado',
            'Selecione o estado.'
        );
    });


    // RN0023
    it('CT11 - Não deve alterar endereço sem país', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();

        validarErro(
            '.erroPais',
            'Preencha o nome do país.'
        );
    });


    // RN0023
    it('CT12 - Pode alterar endereço sem informar observações', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="observacoes"]')
            .clear();

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');
    });


    // RNF0034
    it('CT13 - Deve permitir alterar somente o endereço', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();
        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');

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

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');
    });


    // RN0021 / RNF0034
    it('CT15 - Deve permitir alterar endereço de cobrança', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança');

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');
    });


    // RN0021 / RN0022 / RNF0034
    it('CT16 - Deve permitir alterar endereço de entrega e cobrança', () => {

        abrirEdicaoEndereco();
        preencherEnderecoValido();

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Cobrança e Entrega');

        enviarFormulario();

        cy.get('#modalAdicionarEditarEndereco .mensagem-erro')
            .should('have.text', '');
    });

});
