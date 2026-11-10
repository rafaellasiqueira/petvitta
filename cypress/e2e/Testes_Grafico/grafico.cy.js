describe('Gráfico', () => {

    afterEach(() => {
        cy.pause();
    });

    it('CT01 – Consulta de uma categoria em período válido, exibindo os totais mensais das vendas entregues.', () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);
        cy.wait(2000);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.wait(1000);

        cy.get('#btnEntrar')
            .click();

        cy.wait(3000);

        cy.get('#dataInicio')
            .clear()
            .type('2026-09-01');

        cy.get('#dataFim')
            .clear()
            .type('2026-10-31');

        cy.wait(2000);

        cy.contains('label.checkbox', 'Suplemento')
            .find('input')
            .uncheck();

        cy.contains('label.checkbox', 'Petisco')
            .find('input')
            .uncheck();
    });

    it('CT02 – Comparar duas categorias e aplicar uma data válida.', () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.get('#btnEntrar')
            .click();

        cy.wait(2000);

        cy.get('#dataInicio')
            .clear()
            .type('2025-11-01');

        cy.get('#dataFim')
            .clear()
            .type('2026-11-01');

        cy.wait(2000);

        cy.contains('label.checkbox', 'Suplemento')
            .find('input')
            .uncheck();
    });

    it('CT03 (RN0072) – Validar período máximo e mínimo de análise.', () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);
        cy.wait(1000);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.wait(1000);

        cy.get('#btnEntrar')
            .click();

        cy.get('#dataInicio')
            .clear()
            .type('2026-10-11');

        cy.get('#dataFim')
            .clear()
            .type('2026-11-10');

        cy.wait(2000);

        cy.get('#formDatas').submit();

        cy.wait(3000);
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', "O intervalo entre a data de início e a data de fim deve ser de no mínimo 1 mês e no máximo 24 meses.");

        cy.get('#dataInicio')
            .clear()
            .type('2026-10-11');

        cy.get('#dataFim')
            .clear()
            .type('2028-11-10');

        cy.wait(2000);

        cy.get('#formDatas').submit();

        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', "O intervalo entre a data de início e a data de fim deve ser de no mínimo 1 mês e no máximo 24 meses.");
    });

    it('CT04 – Exibir gráfico considerando apenas vendas com status ENTREGUE.', () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.get('#btnEntrar')
            .click();

        cy.wait(3000);

        cy.visit('/admin/pedidos');
        cy.wait(1000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .wait(1000)
            .select('Em transporte');

        cy.wait(2000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        cy.visit('/admin/dashboard');
        cy.wait(3000);


        cy.visit('/admin/pedidos');
        cy.wait(1000);

        cy.get('table tbody tr')
            .eq(0)
            .find('.dropdown')
            .wait(1000)
            .select('Entregue');

        cy.get('#modalStatusPedido')
            .should('be.visible');

        cy.wait(1000);

        cy.get('#btnConfirmarStatus')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.wait(2000);

        cy.visit('/admin/dashboard');
    });

    it('CT05 – Permitir acesso ao gráfico apenas para o usuário administrador.', () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);
        cy.wait(2000);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.wait(1000);

        cy.get('#btnEntrar')
            .click();

        cy.wait(3000);

        cy.contains('.menu-item', 'Sair')
            .click();

        cy.wait(2000);

        cy.visit('/cliente/login');

        cy.wait(2000);

        cy.get('#email')
            .type('anaBeatriz@gmail.com');
        cy.get('#senha')
            .type('@AnaBeatriz123');

        cy.wait(2000);

        cy.get('#btnEntrar').click();

        cy.wait(3000);

        cy.visit('/admin/dashboard');
    });

    it("CT06 - Tempo de resposta da consulta de até 1 segundo.", () => {
        cy.visit('/admin/login');
        cy.viewport(1280, 720);
        cy.wait(2000);

        cy.get('#email')
            .type('admin@petvittaclub.com');

        cy.get('#senha')
            .type('@Admin123');

        cy.get('#btnEntrar')
            .click();

        cy.wait(2000);

        cy.contains('label.checkbox', 'Suplemento')
            .find('input')
            .uncheck();

        cy.wait(1000);

        cy.get('#dataInicio')
            .clear()
            .type('2025-11-01');

        cy.get('#dataFim')
            .clear()
            .type('2026-11-01');

        cy.wait(2000);

        let inicio;

        cy.get('#btnAplicar').then(() => {
            inicio = performance.now();
        });

        cy.get('#btnAplicar').click();

        cy.get('#graficoVendas').should('be.visible').then(() => {
            const tempo = performance.now() - inicio;

            cy.log(`Tempo: ${Math.round(tempo)}ms`);
            expect(tempo).to.be.lessThan(1000);
        });
    });
});
