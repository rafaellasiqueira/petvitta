describe('Carrinho de compras', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RF0031/RF0032 - Deve permitir adicionar um produto ao carrinho com quantidade maior que 1', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/detalhes-produto/1');

        cy.wait(2000);

        cy.get('.seletor-quantidade input')
            .click()
            .type('2');
        cy.wait(2000);

        cy.get('.btn-adicionar-carrinho')
            .click()

        validarToast('Produto adicionado ao carrinho com sucesso!');
        cy.wait(3000);

        cy.visit('/cliente/carrinho');

        cy.get('.produto').should('have.length.at.least', 1);
    });

    it('RN0031 - Não deve permitir adicionar uma quantidade maior que a disponível em estoque', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/detalhes-produto/1');

        cy.wait(2000);

        cy.get('.seletor-quantidade input')
            .click()
            .type('52');
        cy.wait(2000);

        cy.get('.btn-adicionar-carrinho')
            .click()
        cy.wait(2000);

        cy.get('#mensagemEstoque')
            .should('have.text', 'Quantidade maior que o estoque disponível.');
        cy.wait(2000);

        // Back
        cy.get('#formAdicionar').then((form) => {
            form[0].action = '/cliente/carrinho/adicionar';
            form[0].querySelector('[name="variacaoId"]').value = 1;
            form[0].querySelector('[name="quantidade"]').value = 52;
            form[0].submit();
        });
        cy.wait(3000);

        validarToast('Quantidade maior que o estoque disponível.');
    });

    it('RF0031 - Deve permitir adicionar mais um produto ao carrinho', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/produtos');

        cy.wait(2000);

        cy.get('.produto')
            .eq(8)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

        cy.wait(2000);

        validarToast('Produto adicionado ao carrinho com sucesso!');
    });

    it('RF0031/RF0032 - Deve permitir visualizar a lista de itens adicionados e alterar suas quantidades', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/carrinho');

        cy.wait(2000);

        cy.get('.produto')
            .eq(0)
            .find('.seletor-quantidade input')
            .click()
            .clear()
            .type('3')
            .type('{enter}');
        cy.wait(1000);

        cy.get('.produto')
            .eq(1)
            .find('.seletor-quantidade input')
            .click()
            .clear()
            .type('3')
            .type('{enter}');
        cy.wait(1000);

        cy.reload();
    });

    it('RN0031 - Não deve permitir adicionar uma quantidade maior que a disponível em estoque no carrinho e nem finalizar a compra', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/carrinho');
        cy.wait(2000);

        cy.get('.produto')
            .eq(0)
            .find('.seletor-quantidade input')
            .click()
            .clear()
            .type('999')
            .type('{enter}');

        cy.get('.produto')
            .eq(0)
            .find('.checkbox-produto')
            .click();
        cy.wait(20);
        cy.wait(1000);

        cy.get('.produto')
            .eq(1)
            .find('.seletor-quantidade input')
            .click()
            .clear()
            .type('99')
            .type('{enter}')

        cy.get('.produto')
            .eq(1)
            .find('.checkbox-produto')
            .click();
        cy.wait(20);
        cy.wait(1000);

        cy.get('.btn-finalizar-a-compra')
            .click()

        cy.get('#toastAtencao', { timeout: 6000 })
            .should('be.visible')
            .and('contain', 'Estoque insuficiente');
    });

    it('RF0031 - Deve permitir excluir um produto no carrinho', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/carrinho');
        cy.wait(2000);

        cy.get('.produto')
            .eq(0)
            .find('.btn-excluir')
            .click();
        cy.wait(1000);

        validarToast('Item excluído do carrinho!');

    });

    it('CT07 - Não deve permitir finalizar a compra sem um item selecionado', () => {
        cy.viewport(1280, 720);
        cy.visit('/cliente/carrinho');
        cy.wait(2000);

        cy.get('.btn-finalizar-a-compra')
            .click()

        validarToast('Selecione pelo menos um produto.');

    });
});