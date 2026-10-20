describe('Validar Pagamento', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0036/RF0053/RN0028/RN0034/RN0037/RN0038 - Aprovar pagamento com um cartão', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(3000);

        cy.visit('/cliente/produtos');

        cy.wait(1000);

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

        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('111.00');
        cy.wait(1000);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Aprovada").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RF0036/RF0053/RN0028/RN0034/RN0037/RN0038 - Aprovar compra com pagamento dividido entre dois cartões', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(3000);

        cy.visit('/cliente/produtos');

        cy.wait(1000);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(500);

        cy.get('.produto')
            .eq(1)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('#todos')
            .should('be.visible')
            .check();
        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('#mostrarOutrosCartoes')
            .check();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('213.91');
        cy.wait(1000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.campo-valor-cartao input')
            .clear()
            .type('9.99');
        cy.wait(1500);

        cy.get('#btnFinalizarCompra')
            .click();

        validarToast('Cada cartão deve pagar no mínimo R$ 10,00.');

        cy.wait(500);

        cy.get('#mostrarOutrosCartoes')
            .check();

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('213.89');
        cy.wait(1000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('#outrosCartoes .cartao-item')
            .first()
            .find('.campo-valor-cartao input')
            .clear()
            .type('10.01');
        cy.wait(1500);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Aprovada").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RF0036/RF0053/RN0028/RN0035/RN0037/RN0038 - Aprovar compra com cupom promocional e cartão', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(3000);

        cy.visit('/cliente/produtos');

        cy.wait(1000);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(500);

        cy.get('.produto')
            .eq(1)
            .find('.btn-adicionar')
            .click();
        cy.wait(2000);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('#todos')
            .should('be.visible')
            .check();
        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('#btnVerCupons')
            .click();

        cy.wait(1000);

        cy.get('.checkbox-cupom')
            .eq(0)
            .check();

        cy.wait(2000);

        cy.get('#btnFecharModalCupom')
            .click();

        cy.get('#mostrarOutrosCartoes')
        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.checkbox-cartao')
            .check();
        cy.wait(1000);

        cy.get('.cartao-item')
            .contains('.preferencial', 'Preferencial')
            .closest('.cartao-item')
            .find('.campo-valor-cartao input')
            .clear()
            .type('01.90');
        cy.wait(1000);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Aprovada").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RF0036/RF0053/RN0028/RN0036/RN0037/RN0038 - Aprovar compra com cupons de troca cujo valor total ultrapassa o valor da compra', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(3000);

        cy.visit('/cliente/produtos');

        cy.wait(1000);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(500);

        cy.get('.produto')
            .eq(1)
            .find('.btn-adicionar')
            .click();
        cy.wait(2000);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('#todos')
            .should('be.visible')
            .check();
        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click();
        cy.wait(500);

        cy.get('#btnVerCupons')
            .click();

        cy.wait(1000);

        cy.get('.checkbox-cupom')
            .eq(0)
            .check();

        cy.get('.checkbox-cupom')
            .eq(1)
            .check();

        cy.wait(2000);

        cy.get('#btnFecharModalCupom')
            .click();

        cy.wait(3000);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Aprovada").should("be.visible");

        cy.wait(3000)
        cy.visit('/admin/estoque');
    });

    it('RN0028/RN0037/RN0038 - Reprovar compra por cartão inválido', () => {
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
            .eq(1)
            .find('.checkbox-cartao')
            .check();

        cy.wait(500);

        cy.get('#outrosCartoes .cartao-item')
            .eq(1)
            .find('.campo-valor-cartao input')
            .clear()
            .type('111.00');

        cy.wait(1000);

        cy.get('#btnFinalizarCompra')
            .click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000);

        cy.visit('/cliente/carrinho');

        cy.wait(3000);

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

        cy.wait(500);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(500);

        cy.get('.btn-finalizar-a-compra').click();

        cy.wait(500);

        cy.get('#btnVerCupons').click();

        cy.wait(500);

        cy.get('.checkbox-cupom').eq(0).check();

        cy.get('#btnFecharModalCupom').click();
        cy.wait(500);

        cy.get('#btnFinalizarCompra').click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000);

        cy.visit('/cliente/carrinho');

        cy.wait(3000);

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

        cy.wait(500);

        validarToast('Produto adicionado ao carrinho com sucesso!');

        cy.visit('/cliente/carrinho');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();

        cy.wait(500);

        cy.get('.btn-finalizar-a-compra').click();

        cy.get('#btnVerCupons').click();
        cy.wait(500);

        cy.get('.checkbox-cupom').eq(0).check();

        cy.get('#btnFecharModalCupom').click();
        cy.wait(500);

        cy.get('#btnFinalizarCompra').click();

        cy.wait(6000);

        cy.reload();

        cy.contains("Reprovado").should("be.visible");

        cy.wait(3000);

        cy.visit('/cliente/carrinho');

        cy.wait(3000);

        cy.visit('/admin/estoque');
    });

    it('RN0027 - Ranking do cliente', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/perfil');
    });

});