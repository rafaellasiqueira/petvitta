describe('Consulta de clientes', () => {

    /*afterEach(() => {
        cy.pause();
    });*/

    beforeEach(() => {
        cy.visit('/admin/clientes');
        cy.viewport(1280, 720);
    });

    it('RF0024 - Deve consultar clientes pelo nome', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza{enter}');

        cy.wait(1000);

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');
    });

    it('RF0024 - Deve filtrar cliente somente pelo CPF', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroCpf')
            .type('312.048.179-36');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', '312.048.179-36');
    });

    it('RF0024 - Deve filtrar cliente somente pelo e-mail', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroEmail')
            .type('ana.souza03@email.com');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'ana.souza03@email.com');
    });

    it('RF0024 - Deve filtrar cliente somente pelo telefone', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroTelefone')
            .type('11966661003');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();
    });

    it('RF0024 - Deve filtrar cliente somente pela data de nascimento', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroDataNascimento')
            .type('2001-11-08');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();
    });

    it('RF0024 - Deve filtrar cliente somente pelo gênero', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroGenero')
            .select('1');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();
    });

    it('RF0024 - Deve filtrar somente clientes ativos', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroStatus')
            .select('true');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();
    });

    it('RF0024 - Deve filtrar somente clientes inativos', () => {
        cy.get('#btnfiltrar').click();
        cy.wait(1000);

        cy.get('#filtroStatus')
            .select('false');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();
    });

    it('RF0024 - Deve filtrar clientes utilizando todos os filtros combinados', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza');
        cy.wait(1000);

        cy.get('#btnfiltrar').click();

        cy.get('#filtroCpf')
            .type('636.868.244-26');
        cy.wait(1000);

        cy.get('#filtroEmail')
            .type('ana.souza03@email.com');
        cy.wait(1000);

        cy.get('#filtroTelefone')
            .type('11966661003');
        cy.wait(1000);

        cy.get('#filtroDataNascimento')
            .type('2001-11-08');
        cy.wait(1000);

        cy.get('#filtroGenero')
            .select('1');
        cy.wait(1000);

        cy.get('#filtroStatus')
            .select('true');
        cy.wait(1000);

        cy.get('#btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');

        cy.get('table tbody')
            .should('contain.text', '636.868.244-26');

        cy.get('table tbody')
            .should('contain.text', 'ana.souza03@email.com');
    });

    it('RF0024 - Deve informar quando nenhum cliente for encontrado', () => {
        cy.get('[name="nome"]')
            .type('ClienteQueNaoExiste123456{enter}');

        cy.wait(1000);

        cy.get('.sem-resultados')
            .should('be.visible')
            .and('contain.text', 'Nenhum cliente encontrado.');
    });

});

