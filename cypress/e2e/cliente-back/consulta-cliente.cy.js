describe('Consulta de clientes', () => {

    afterEach(() => {
        cy.pause();
    });

    beforeEach(() => {
        cy.visit('/admin/clientes');
        cy.viewport(1280, 720);
    });

    // RF0024
    it('CT01 - Deve apresentar os clientes sem informar filtros', () => {
        cy.get('table tbody tr')
            .should('have.length.at.least', 1);
    });

    // RF0024
    it('CT02 - Deve consultar clientes pelo nome', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza');

        cy.get('[name="nome"]')
            .closest('form')
            .submit();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');
    });

    // RF0024
    it('CT03 - Deve filtrar cliente somente pelo CPF', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroCpf')
            .type('312.048.179-36');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', '312.048.179-36');
    });

    // RF0024
    it('CT04 - Deve filtrar cliente somente pelo e-mail', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroEmail')
            .type('ana.souza03@email.com');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'ana.souza03@email.com');
    });

    // RF0024
    it('CT05 - Deve filtrar cliente somente pelo telefone', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroTelefone')
            .type('11966661003');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');
    });

    // RF0024
    it('CT06 - Deve filtrar cliente somente pela data de nascimento', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroDataNascimento')
            .type('2001-11-08');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');
    });

    // RF0024
    it('CT07 - Deve filtrar cliente somente pelo gênero', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroGenero')
            .select('1');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody tr')
            .should('exist');
    });

    // RF0024
    it('CT08 - Deve apresentar somente clientes ativos', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroStatus')
            .select('true');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody tr')
            .should('exist');
    });

    // RF0024
    it('CT09 - Deve apresentar somente clientes inativos', () => {
        cy.get('.btn-filtrar').click();

        cy.get('#filtroStatus')
            .select('false');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody tr')
            .should('exist');
    });

    // RF0024
    it('CT10 - Deve filtrar clientes utilizando dois filtros combinados', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza');

        cy.get('.btn-filtrar').click();

        cy.get('#filtroStatus')
            .select('true');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');
    });

    // RF0024
    it('CT11 - Deve filtrar clientes utilizando todos os filtros combinados', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza');

        cy.get('.btn-filtrar').click();

        cy.get('#filtroCpf')
            .type('636.868.244-26');

        cy.get('#filtroEmail')
            .type('ana.souza03@email.com');

        cy.get('#filtroTelefone')
            .type('11966661003');

        cy.get('#filtroDataNascimento')
            .type('2001-11-08');

        cy.get('#filtroGenero')
            .select('1');

        cy.get('#filtroStatus')
            .select('true');

        cy.get('.btn-aplicar').click();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');

        cy.get('table tbody')
            .should('contain.text', '636.868.244-26');

        cy.get('table tbody')
            .should('contain.text', 'ana.souza03@email.com');
    });

    // RF0024
    it('CT12 - Deve informar quando nenhum cliente for encontrado', () => {
        cy.get('[name="nome"]')
            .type('ClienteQueNaoExiste123456');

        cy.get('[name="nome"]')
            .closest('form')
            .submit();

        cy.get('.sem-resultados')
            .should('be.visible')
            .and('contain.text', 'Nenhum cliente encontrado.');
    });

    // RF0024
    it('CT13 - Deve permitir consultar utilizando parte do nome', () => {
        cy.get('[name="nome"]')
            .type('Ana');

        cy.get('[name="nome"]')
            .closest('form')
            .submit();

        cy.get('table tbody')
            .should('contain.text', 'Ana Beatriz Souza');

        cy.get('table tbody tr')
            .should('have.length.at.least', 1);
    });

    // RF0024
    it('CT14 - Deve informar quando filtros combinados não encontrarem clientes', () => {
        cy.get('[name="nome"]')
            .type('Ana Beatriz Souza');

        cy.get('.btn-filtrar').click();

        cy.get('#filtroEmail')
            .type('emailque-nao-existe@email.com');

        cy.get('.btn-aplicar').click();

        cy.get('.sem-resultados')
            .should('be.visible')
            .and('contain.text', 'Nenhum cliente encontrado.');
    });

});

