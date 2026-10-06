describe('Testes de compra - PetVitta', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/carrinho');
    });

    function preencherEndereco() {
        cy.get('#btnAdicionarEndereco')
            .click();

        cy.get('#modalAdicionarEditarEndereco')
            .should('have.class', 'active');

        cy.get('#modalAdicionarEditarEndereco [name="tipoEndereco"]')
            .select('Entrega');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="tipoResidencia"]')
            .select('Casa');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="tipoLogradouro"]')
            .select('Rua');
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

    function preencherCartao() {
        cy.get('#btnCadastrarCartao')
            .click();

        cy.get('#modalCadastrarCartao [name="numero"]')
            .clear()
            .type('4111111111111111');
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="nomeImpresso"]')
            .clear()
            .type('BRUNO HENRIQUE LIMA');
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="bandeira"]')
            .select(1);
        cy.wait(1000);

        cy.get('#modalCadastrarCartao [name="codigoSeguranca"]')
            .clear()
            .type('123');
        cy.wait(1000);
    }

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF033, RF0034, RF0035, RF0036, RF0038 - Deve finalizar a compra com endereço e cartão cadastrados', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(1000);
        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(3000);

        cy.get('.btnAlterarEndereco')
            .click();

        cy.get('#modalAlterarEndereco')
            .should('have.class', 'active');

        cy.get('#modalAlterarEndereco')
            .find('input[name="enderecoId"]')
            .eq(1)
            .check({ force: true });
        cy.wait(2000);

        cy.get('#btnConfirmarEndereco')
            .click();

        cy.wait(4000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('355.70');
        cy.wait(2000);

        cy.get('#btnFinalizarCompra')
            .click();

    });

    it('RF0035, RF0036 - Deve finalizar a compra com endereço e cartão temporários', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(1000);
        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(3000);

        cy.get('.btnAlterarEndereco')
            .click();

        cy.get('#modalAlterarEndereco')
            .should('have.class', 'active');

        cy.wait(1000);

        preencherEndereco();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear()
            .type('Casa da mãe');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear()
            .type('69301-030');
        cy.wait(500);

        cy.wait(3000);

        cy.get('#btnSalvarEndereco')
            .click();

        cy.wait(2000);

        cy.get('.btnAlterarEndereco')
            .click();

        cy.get('#modalAlterarEndereco')
            .should('have.class', 'active');

        cy.get('#modalAlterarEndereco')
            .find('input[name="enderecoTemporarioId"]')
            .eq(0)
            .check({ force: true });
        cy.wait(2000);

        cy.get('#btnConfirmarEndereco')
            .click();

        cy.wait(4000);

        preencherCartao();

        cy.get('#btnSalvarCartao')
            .click();

        cy.wait(3000);

        cy.get('.cartao-temporario')
            .find('.checkbox-cartao-temporario')
            .check();
        cy.wait(2000);

        cy.get('.cartao-temporario')
            .find('.campo-valor-cartao input')
            .clear()
            .type('41.20');
        cy.wait(2000);

        cy.get('#btnFinalizarCompra')
            .click();
    });

    it('RF0035, RF0036, RN0034 - Deve permitir cadastrar um endereço e cartão, vinculá-los ao perfil e realizar pagamento com vários cartões, respeitando o valor mínimo de R$ 10,00 por cartão.', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(1000);
        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(3000);

        cy.get('.btnAlterarEndereco')
            .click();

        cy.get('#modalAlterarEndereco')
            .should('have.class', 'active');

        cy.wait(3000);

        preencherEndereco();

        cy.get('#modalAdicionarEditarEndereco [name="nomeIdentificacao"]')
            .clear()
            .type('Casa da vó');
        cy.wait(500);

        cy.get('#modalAdicionarEditarEndereco [name="cep"]')
            .clear()
            .type('88020-120');

        cy.get('#modalAdicionarEditarEndereco [name="salvarNoPerfil"]')
            .check();

        cy.wait(3000);

        cy.get('#btnSalvarEndereco')
            .click();

        cy.wait(2000);

        cy.get('.btnAlterarEndereco')
            .click();

        cy.get('#modalAlterarEndereco')
            .should('have.class', 'active');

        cy.get('#modalAlterarEndereco')
            .find('input[name="enderecoId"]')
            .eq(2)
            .check({ force: true });
        cy.wait(2000);

        cy.get('#btnConfirmarEndereco')
            .click();

        cy.wait(4000);

        preencherCartao();

        cy.get('#modalCadastrarCartao [name="salvarNoPerfil"]')
            .check();

        cy.get('#btnSalvarCartao')
            .click();

        cy.wait(3000);

        cy.get('#mostrarOutrosCartoes')
            .check();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('5.00');
        cy.wait(2000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.campo-valor-cartao input')
            .clear()
            .type('25.75');
        cy.wait(2000);

        cy.get('#btnFinalizarCompra')
            .click();

        validarToast('Cada cartão deve pagar no mínimo R$ 10,00.');

        cy.get('#mostrarOutrosCartoes')
            .check();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('20.00');
        cy.wait(2000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.campo-valor-cartao input')
            .clear()
            .type('10.75');
        cy.wait(2000);

        cy.get('#btnFinalizarCompra')
            .click();
    });

    it('RF0037, RN0036, RN0033 - Deve ser gerado um cupom de troca quando o valor do cupom supere o valor da compra.', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();

        cy.wait(3000);

        cy.get('#btnVerCupons')
            .click();

        cy.wait(1000);

        cy.get('.checkbox-cupom')
            .eq(0)
            .check();

        cy.get('.checkbox-cupom')
            .eq(2)
            .check();

        cy.wait(3000);

        cy.get('.checkbox-cupom')
            .eq(1)
            .invoke('prop', 'checked', true);

        cy.wait(3000);

        cy.get('#btnFecharModalCupom')
            .click();

        cy.get('#btnFinalizarCompra')
            .click();

        validarToast('Apenas um cupom promocional pode ser utilizado por compra.');
        cy.wait(3000);

        cy.get('#btnVerCupons')
            .click();

        cy.get('.checkbox-cupom')
            .eq(0)
            .check();

        cy.get('.checkbox-cupom')
            .eq(1)
            .check();

        cy.wait(3000);

        cy.get('#btnFecharModalCupom')
            .click();

        cy.get('#btnFinalizarCompra')
            .click();
        cy.wait(5000);

        cy.visit('/cliente/perfil');
    });

    it('RN0035 - Deve permitir a realização da compra utilizando cartão e cupom, mesmo quando o valor a ser pago no cartão for inferior a R$ 10,00.', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.get('.produto')
            .eq(1)
            .find('.checkbox-produto')
            .click();

        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();

        cy.wait(3000);

        cy.get('#btnVerCupons')
            .click();

        cy.wait(1000);

        cy.get('.checkbox-cupom')
            .eq(0)
            .check();

        cy.get('.checkbox-cupom')
            .eq(1)
            .check();

        cy.get('.checkbox-cupom')
            .eq(2)
            .check();

        cy.wait(3000);

        cy.get('#btnFecharModalCupom')
            .click();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(2000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('3.39');

        cy.get('#btnFinalizarCompra')
            .click();
        cy.wait(3000);
    });

    it('CT06 - Não deve finalizar sem forma de pagamento', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.get('.btn-finalizar-a-compra')
            .click();

        cy.wait(3000);

        cy.get('#btnFinalizarCompra')
            .click();
    });

    it('CT07 - Não deve finalizar quando o pagamento for insuficiente', () => {
        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.get('.btn-finalizar-a-compra')
            .click();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(4000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('10.00');

        cy.get('#btnFinalizarCompra')
            .click();
        cy.wait(3000);
    });
});