describe('Expiração e aviso do carrinho', () => {

    afterEach(() => {
        cy.pause();
    });


    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }

    it('RN0044 - Deve exibir o aviso de expiração do carrinho', () => {
        cy.viewport(1366, 768);

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

        const idCarrinho = 1;

        cy.request({
            method: 'POST',
            url: `/teste/carrinho/${idCarrinho}/aviso`,
            followRedirect: false // Verifica a resposta antes de redirecionar
        }).then((resposta) => {
            expect(resposta.status).to.be.oneOf([200, 302, 303]);
        });

        cy.visit('/cliente/carrinho');
    });

    it('RNF0042/RN0044/RN0045 - Deve remover os itens quando o carrinho expirar', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/carrinho');

        const idCarrinho = 1;

        cy.request({
            method: 'POST',
            url: `/teste/carrinho/${idCarrinho}/expirar`,
            followRedirect: false
        }).then((resposta) => {
            expect(resposta.status).to.be.oneOf([200, 302, 303]);
        });

        cy.wait(6500);
        cy.visit('/cliente/carrinho');
        cy.wait(5000);


        cy.get('.btn-finalizar-a-compra').click();
        cy.wait(500);
    });
});
