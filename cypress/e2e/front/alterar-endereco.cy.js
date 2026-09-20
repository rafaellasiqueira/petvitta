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
            .select('Cobrança');

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

    it('RNF0034/RF0026/RN0023 - Não deve alterar endereço com campos obrigatórios vazios', () => {
        abrirEdicaoEndereco();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear();

        cy.get('[name="tipoEndereco"]')
            .invoke('val', '');

        cy.get('[name="tipoResidencia"]')
            .invoke('val', '');

        cy.get('[name="tipoLogradouro"]')
            .invoke('val', '');

        cy.get('#modalAdicionarEditarEndereco [name="logradouro"]')
            .clear();

        cy.get('#modalAdicionarEditarEndereco [name="numero"]')
            .clear();

        cy.get('#modalAdicionarEditarEndereco [name="bairro"]')
            .clear();

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear();

        cy.get('#modalAdicionarEditarEndereco [name="cidade"]')
            .clear();

        cy.get('[name="estado"]')
            .invoke('val', '');

        cy.get('#modalAdicionarEditarEndereco [name="pais"]')
            .clear();

        enviarFormulario();
        
        validarErro(
            '.erroNomeIdentificacao',
            'Preencha o nome com até 20 caracteres.'
        );

        validarErro(
            '.erroTipoEndereco',
            'Selecione o tipo de endereço.'
        );

        validarErro(
            '.erroTipoResidencia',
            'Selecione o tipo de residência.'
        );

        validarErro(
            '.erroTipoLogradouro',
            'Selecione o tipo de logradouro.'
        );

        validarErro(
            '.erroLogradouro',
            'Preencha o logradouro.'
        );

        validarErro(
            '.erroNumero',
            'Preencha o número.'
        );

        validarErro(
            '.erroBairro',
            'Preencha o nome do bairro.'
        );

        validarErro(
            '.erroCep',
            'Preencha o CEP.'
        );

        validarErro(
            '.erroCidade',
            'Preencha o nome da cidade.'
        );

        validarErro(
            '.erroEstado',
            'Selecione o estado.'
        );

        validarErro(
            '.erroPais',
            'Preencha o nome do país.'
        );
    });
});
