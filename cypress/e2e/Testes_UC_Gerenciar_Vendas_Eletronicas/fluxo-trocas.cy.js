describe('Fluxo de trocas', () => {

    afterEach(() => {
        cy.pause();
    });

    function validarToast(mensagem) {
        cy.get('#toast', {timeout: 6000})
            .should('be.visible')
            .and('contain', mensagem);
    }


    it('RN0043 - Bloquear troca de pedido não entregue (back-end)', () => {
        cy.visit('/cliente/pedido');

        cy.wait(3000);

        cy.get('.card-pedido').first().within(() => {
            cy.get('.status-pedido')
                .should('not.contain', 'Entregue');
        });

        cy.get('.card-pedido').first().then(($pedido) => {
            const pedidoId = $pedido.find('[name="pedidoId"]').val();

            cy.request({
                method: 'POST',
                url: '/cliente/pedido/solicitar-troca',
                form: true,
                followRedirect: false,
                body: {
                    pedidoId: pedidoId,
                    motivoTroca: 1,
                    justificativaTroca: 'Teste de troca',
                    'itens[0].itemPedidoId': 1,
                    'itens[0].quantidade': 1
                }
            }).then((response) => {
                expect(response.status).to.eq(302);
                expect(response.headers.location)
                    .to.include('/cliente/pedido');

            });

            cy.reload();

            cy.get('#toast', { timeout: 6000 })
                .should('be.visible')
                .and('contain', 'Somente pedidos entregues podem ser solicitados para troca.');

        });
    });

    it('RF0041/RN0041/RN0043 - Solicitar a troca de um item do pedido', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(3000);

        cy.get('.btn-solicitar-troca')
            .eq(0)
            .click();

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .first()
            .check();

        cy.get('.modal.active .motivo-troca')
            .select(1);

        cy.get('.modal.active .justificativa-troca')
            .type('Recebi o produto "Ração Premium Cães Adultos Frango" em vez do produto "Ração Bionatural Prime para Cães Adultos Raças Médias e Grandes".');

        cy.wait(3000);

        cy.get('.modal.active #btnSolicitarTroca')
            .should('be.visible')
            .should('be.enabled')
            .click();

        validarToast("Troca solicitada com sucesso!");
    });

    it('RF0041/RN0041/RN0043 - Solicitar a troca da compra inteira', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(3000);

        cy.get('.btn-solicitar-troca')
            .eq(0)
            .click();

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .eq(0)
            .check();

        cy.get('.modal.active .checkbox-troca')
            .eq(1)
            .check();

        cy.get('.modal.active .motivo-troca')
            .select(1);

        cy.get('.modal.active .justificativa-troca')
            .type('Recebi o produto "Ração Premium Cães Adultos Frango" em vez do produto "Ração Bionatural Prime para Cães Adultos Raças Médias e Grandes".');

        cy.wait(3000);

        cy.get('.modal.active #btnSolicitarTroca')
            .should('be.visible')
            .should('be.enabled')
            .click();

        validarToast("Troca solicitada com sucesso!");
    });

    it('RF0042/RF0043/RN0046 - Autorizar a troca e visualizar a notificação', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/trocas');

        cy.wait(3000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .select('Troca Autorizada');

        cy.get('#modalStatusTroca')
            .should('be.visible');

        cy.wait(2000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(1)
            .find('.dropdown')
            .select('Troca Autorizada');

        cy.get('#modalStatusTroca')
            .should('be.visible');

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        validarToast("Status alterado com sucesso!");

        cy.wait(2000);

        cy.visit('/cliente/notificacao');

        cy.wait(5000);

        cy.visit('/cliente/pedido');
    });

    it('CT005 - Enviar o item', () => {
        cy.viewport(1366, 768);

        cy.visit('/cliente/pedido');

        cy.wait(2000);

        cy.get('.btn-enviado')
            .eq(0)
            .click();

        cy.visit('/cliente/pedido');

        cy.get('.btn-enviado')
            .eq(0)
            .click();
    });

    it('RF0044/RF0045/RF0054/RN0042 - Receber o item devolvido sem retornar ao estoque', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(3000);

        cy.visit('/admin/trocas');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .select('Item Recebido');

        cy.get('.modal')
            .should('be.visible');

        cy.wait(2000);

        cy.get('.modal.active')
            .find('.btn-cancelar')
            .click();

        cy.wait(4000);

        cy.visit('/admin/estoque');
    });

    it('RF0044/RF0045/RF0054/RN0042 - Receber o item devolvido e retornar ao estoque', () => {
        cy.viewport(1366, 768);

        cy.visit('/admin/estoque');

        cy.wait(2000);

        cy.visit('/admin/trocas');

        cy.wait(2000);

        cy.get('table tbody tr')
            .eq(1)
            .find('.dropdown')
            .select('Item Recebido');

        cy.get('.modal')
            .should('be.visible');

        cy.get('.modal.active .checkbox-troca')
            .eq(0)
            .check();

        cy.wait(2000);

        cy.get('.modal.active')
            .find('.btn-confirmar-retorno')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(4000);

        cy.visit('/admin/estoque');
    });

        it('CT08 - Utilizar cupom de troca gerado em nova compra', () => {
         cy.viewport(1366, 768);

        cy.visit('/cliente/produtos');

        cy.wait(1000);

        cy.get('.produto')
            .eq(0)
            .find('.btn-adicionar')
            .click();
        cy.wait(20);

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
            .eq(2)
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
    });
});
