
describe('Alteração de dados cadastrais do cliente', () => {

    beforeEach(() => {
        cy.visit('/cliente/perfil');
    });

    function capturarDados() {
        return cy.get('#formDadosPessoais').then(($form) => ({
            nome: $form.find('[name="nome"]').val(),
            cpf: $form.find('[name="cpf"]').val(),
            tipoTelefone: $form.find('[name="tipoTelefone"]').val(),
            telefone: $form.find('[name="telefone"]').val(),
            genero: $form.find('[name="genero"]').val(),
            dataNascimento: $form.find('[name="dataNascimento"]').val()
        }));
    }

    function enviarFormulario() {
        cy.get('#formDadosPessoais')
            .find('button[type="submit"]')
            .click();
    }

    function validarErro(seletor, mensagem) {
        cy.get(seletor)
            .should('be.visible')
            .and('have.text', mensagem);
    }


    // RF0022
    it('CT01 - Deve alterar os dados cadastrais do cliente', () => {

        cy.get('[name="nome"]')
            .clear()
            .type('Bruno Henrique');

        cy.get('[name="telefone"]')
            .clear()
            .type('11987654321');

        cy.get('[name="genero"]')
            .select('3');

        enviarFormulario();

        cy.get('#erroNome')
            .should('have.text', '');

        cy.get('#erroTelefone')
            .should('have.text', '');
    });


    // RF0022
    it('CT02 - Deve alterar somente o nome do cliente', () => {

        capturarDados().then((dados) => {

            cy.get('[name="nome"]')
                .clear()
                .type('Bruno Henrique Lima');

            enviarFormulario();

            cy.get('[name="nome"]')
                .should('have.value', 'Bruno Henrique Lima');

            cy.get('[name="cpf"]')
                .should('have.value', dados.cpf);

            cy.get('[name="tipoTelefone"]')
                .should('have.value', dados.tipoTelefone);

            cy.get('[name="telefone"]')
                .should('have.value', dados.telefone);

            cy.get('[name="genero"]')
                .should('have.value', dados.genero);

            cy.get('[name="dataNascimento"]')
                .should('have.value', dados.dataNascimento);

            cy.get('#erroNome')
                .should('have.text', '');
        });
    });


    // RF0022
    it('CT03 - Deve alterar somente o telefone do cliente', () => {

        capturarDados().then((dados) => {

            cy.get('[name="telefone"]')
                .clear()
                .type('11987654321');

            enviarFormulario();

            cy.get('[name="nome"]')
                .should('have.value', dados.nome);

            cy.get('[name="cpf"]')
                .should('have.value', dados.cpf);

            cy.get('[name="tipoTelefone"]')
                .should('have.value', dados.tipoTelefone);

            cy.get('[name="telefone"]')
                .should('have.value', '(11) 98765-4321');

            cy.get('[name="genero"]')
                .should('have.value', dados.genero);

            cy.get('[name="dataNascimento"]')
                .should('have.value', dados.dataNascimento);

            cy.get('#erroTelefone')
                .should('have.text', '');
        });
    });


    // RF0022
    it('CT04 - Deve alterar somente o gênero do cliente', () => {

        capturarDados().then((dados) => {

            cy.get('[name="genero"]')
                .select('3');

            enviarFormulario();

            cy.get('[name="nome"]')
                .should('have.value', dados.nome);

            cy.get('[name="cpf"]')
                .should('have.value', dados.cpf);

            cy.get('[name="tipoTelefone"]')
                .should('have.value', dados.tipoTelefone);

            cy.get('[name="telefone"]')
                .should('have.value', dados.telefone);

            cy.get('[name="genero"]')
                .should('have.value', '3');

            cy.get('[name="dataNascimento"]')
                .should('have.value', dados.dataNascimento);
        });
    });


    // RF0022
    it('CT05 - Deve alterar mais de um dado cadastral simultaneamente', () => {

        cy.get('[name="nome"]')
            .clear()
            .type('Bruno Henrique');

        cy.get('[name="telefone"]')
            .clear()
            .type('11987654324');

        cy.get('[name="genero"]')
            .select('2');

        enviarFormulario();

        cy.get('#erroNome')
            .should('have.text', '');

        cy.get('#erroTelefone')
            .should('have.text', '');
    });


    // RN0026
    it('CT06 - Não deve permitir alterar o CPF', () => {

        cy.get('[name="cpf"]')
            .should('have.attr', 'readonly');
    });


    // RN0026
    it('CT07 - Não deve permitir alterar a data de nascimento', () => {

        cy.get('[name="dataNascimento"]')
            .should('have.attr', 'readonly');
    });


    // RN0026
    it('CT08 - Deve validar nome obrigatório', () => {

        cy.get('[name="nome"]')
            .clear()
            .type('A')
            .blur();

        validarErro(
            '#erroNome',
            'Digite um nome com pelo menos 3 caracteres.'
        );
    });


    // RN0026
    it('CT09 - Deve validar tipo de telefone obrigatório', () => {

        cy.get('[name="tipoTelefone"]')
            .invoke('val', '');

        cy.get('[name="tipoTelefone"]')
            .should('have.value', '');

        cy.get('[name="tipoTelefone"]')
            .should('have.attr', 'required');
    });


    // RN0026
    it('CT10 - Deve validar telefone obrigatório', () => {

        cy.get('[name="telefone"]')
            .clear()
            .type('119');

        validarErro(
            '#erroTelefone',
            'Digite o telefone completo.'
        );
    });


    // RN0026
    it('CT11 - Deve validar gênero obrigatório', () => {

        cy.get('[name="genero"]')
            .invoke('val', '');

        cy.get('[name="genero"]')
            .should('have.value', '');

        cy.get('[name="genero"]')
            .should('have.attr', 'required');
    });


    // RF0022
    it('CT12 - Deve cancelar a alteração dos dados', () => {

        capturarDados().then((dados) => {

            cy.get('[name="nome"]')
                .clear()
                .type('Nome Que Não Deve Ser Salvo');

            cy.visit('/cliente/perfil');

            cy.get('[name="nome"]')
                .should('have.value', dados.nome);

            cy.get('[name="cpf"]')
                .should('have.value', dados.cpf);

            cy.get('[name="tipoTelefone"]')
                .should('have.value', dados.tipoTelefone);

            cy.get('[name="telefone"]')
                .should('have.value', dados.telefone);

            cy.get('[name="genero"]')
                .should('have.value', dados.genero);

            cy.get('[name="dataNascimento"]')
                .should('have.value', dados.dataNascimento);
        });
    });

});

