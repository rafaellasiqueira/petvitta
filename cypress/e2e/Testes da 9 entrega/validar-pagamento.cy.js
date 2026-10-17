describe('Validar Pagamento', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0053/RN0028/RN0037/RN0038 - Aprovar pagamento', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.visit('/cliente/produtos');

        cy.wait(500);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(500);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(500);
        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(500);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('111.00');
        cy.wait(500);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Aprovada").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RN0028/RN0037/RN0038 - Reprovar pagamento com cartão inválido', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.visit('/cliente/produtos');

        cy.wait(500);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(500);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(500);
        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('#mostrarOutrosCartoes')
            .check();

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.checkbox-cartao')
            .check();
        cy.wait(500);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.campo-valor-cartao input')
            .clear()
            .type('111.00');
        cy.wait(500);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RN0028/RN0037/RN0038 - Reprovar compra com cupom vencido', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.intercept('POST', '**/cliente/finalizar-compra', (req) => {

            const dados = new URLSearchParams(req.body);

            dados.delete('cuponsIds');
            dados.append('cuponsIds', '1');

            req.body = dados.toString();

        }).as('finalizarCompra');

        cy.visit('/cliente/produtos');

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.get('.btn-finalizar-a-compra').click();

        cy.get('#btnVerCupons').click();

        cy.get('.checkbox-cupom').eq(0).check();

        cy.get('#btnFecharModalCupom').click();
        cy.wait(500);

        cy.get('#btnFinalizarCompra').click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RN0028/RN0037/RN0038 - Reprovar compra com cupom não disponível', () => {

        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.intercept('POST', '**/cliente/finalizar-compra', (req) => {

            const dados = new URLSearchParams(req.body);

            dados.delete('cuponsIds');
            dados.append('cuponsIds', '2');

            req.body = dados.toString();

        }).as('finalizarCompra');

        cy.visit('/cliente/produtos');

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.get('.btn-finalizar-a-compra').click();

        cy.get('#btnVerCupons').click();

        cy.get('.checkbox-cupom').eq(0).check();

        cy.get('#btnFecharModalCupom').click();
        cy.wait(500);

        cy.get('#btnFinalizarCompra').click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RN0027 - Ranking do cliente', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/perfil');
    });
});