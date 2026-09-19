
describe('Cadastro de clientes - Popular banco', () => {

    const clientes = [
        {
            nome: 'Ana Beatriz Souza',
            cpf: '52998224725',
            telefone: '11988881001',
            nascimento: '2002-03-15',
            email: 'ana.souza01@email.com',
            cep: '08710000',
            numero: '100',
            cartao: '4000000000000002'
        },
        {
            nome: 'Bruna Henrique Lima',
            cpf: '31204817936',
            telefone: '11977771002',
            nascimento: '1999-07-22',
            email: 'bruna.lima02@email.com',
            cep: '08720000',
            numero: '250',
            cartao: '4000000000000010'
        },
        {
            nome: 'Ana Beatriz Souza',
            cpf: '63686824426',
            telefone: '11966661003',
            nascimento: '2001-11-08',
            email: 'ana.souza03@email.com',
            cep: '08730000',
            numero: '350',
            cartao: '4000000000000028'
        },
        {
            nome: 'Diego Ferreira Santos',
            cpf: '20955432111',
            telefone: '11955551004',
            nascimento: '1998-01-30',
            email: 'diego.santos04@email.com',
            cep: '08740000',
            numero: '420',
            cartao: '4000000000000036'
        },
        {
            nome: 'Carla Mendes Oliveira',
            cpf: '71991066880',
            telefone: '11944441005',
            nascimento: '2003-05-17',
            email: 'carla.oliveira05@email.com',
            cep: '08750000',
            numero: '515',
            cartao: '4000000000000044'
        },
        {
            nome: 'Bruno Henrique Lima',
            cpf: '73540669400',
            telefone: '11933331006',
            nascimento: '2000-09-12',
            email: 'bruno.lima06@email.com',
            cep: '08760000',
            numero: '630',
            cartao: '4000000000000051'
        },
        {
            nome: 'Gabriela Nunes Rocha',
            cpf: '70196010730',
            telefone: '11922221007',
            nascimento: '2002-12-03',
            email: 'gabriela.rocha07@email.com',
            cep: '08770000',
            numero: '745',
            cartao: '4000000000000069'
        },
        {
            nome: 'Ana Beatriz Souza',
            cpf: '79871240872',
            telefone: '11911111008',
            nascimento: '1997-06-25',
            email: 'ana.souza08@email.com',
            cep: '08780000',
            numero: '850',
            cartao: '4000000000000077'
        },
        {
            nome: 'Carla Mendes Oliveira',
            cpf: '48245975796',
            telefone: '11900001009',
            nascimento: '2004-02-19',
            email: 'carla.oliveira09@email.com',
            cep: '08790000',
            numero: '965',
            cartao: '4000000000000085'
        },
        {
            nome: 'João Pedro Martins',
            cpf: '62891920279',
            telefone: '11988881010',
            nascimento: '1996-10-11',
            email: 'joao.martins10@email.com',
            cep: '08800000',
            numero: '1070',
            cartao: '4000000000000093'
        }
        ];
    clientes.forEach((cliente, index) => {

        it(`CT${String(index + 1).padStart(2, '0')} - Cadastrar ${cliente.nome}`, () => {

            cy.visit('/cliente/cadastrar');

            // =========================
            // DADOS PESSOAIS
            // =========================

            cy.get('[name="nome"]')
                .type(cliente.nome);

            cy.get('[name="cpf"]')
                .type(cliente.cpf);

            cy.get('[name="tipoTelefone"]')
                .select('1');

            cy.get('[name="telefone"]')
                .type(cliente.telefone);

            cy.get('[name="genero"]')
                .select('1');

            cy.get('[name="dataNascimento"]')
                .type(cliente.nascimento);


            // =========================
            // DADOS DE ACESSO
            // =========================

            cy.get('[name="email"]')
                .type(cliente.email);

            cy.get('[name="senha"]')
                .type('PetVitta@123');

            cy.get('[name="confirmarSenha"]')
                .type('PetVitta@123');


            // =========================
            // ENDEREÇO
            // =========================

            cy.get('[name="enderecos[0].nomeIdentificacao"]')
                .type('Casa');

            cy.get('[name="enderecos[0].tipoEndereco"]')
                .select('3');

            cy.get('[name="enderecos[0].tipoResidencia"]')
                .select('1');

            cy.get('[name="enderecos[0].tipoLogradouro"]')
                .select('1');

            cy.get('[name="enderecos[0].cep"]')
                .type(cliente.cep);

            cy.get('[name="enderecos[0].numero"]')
                .type(cliente.numero);

            cy.get('[name="enderecos[0].pais"]')
                .type('Brasil');


            // =========================
            // CARTÃO
            // =========================

            cy.get('[name="cartoes[0].numero"]')
                .type(cliente.cartao);

            cy.get('[name="cartoes[0].nomeImpresso"]')
                .type(cliente.nome.toUpperCase());

            cy.get('[name="cartoes[0].bandeira"]')
                .select('1');

            cy.get('[name="cartoes[0].codigoSeguranca"]')
                .type('123');


            // =========================
            // CADASTRAR
            // =========================

            cy.get('#btnSalvarCliente')
                .click();

            cy.get('#toast')
                .should('be.visible')
                .and('contain', 'Cadastro concluído com sucesso!');
        });
    });
});

