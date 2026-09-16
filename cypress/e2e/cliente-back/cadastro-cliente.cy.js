describe('Cadastro de cliente', () => {
    /*afterEach(() => {
        cy.pause();
    });*/

    function preencherDadosValidos() {
        cy.get('[name="nome"]').type('Sophia da Silva');
        cy.get('[name="cpf"]').type('17177963030');
        cy.get('[name="tipoTelefone"]').select('1');
        cy.get('[name="telefone"]').type('11954852669');
        cy.get('[name="genero"]').select('1');
        cy.get('[name="dataNascimento"]').type('2005-02-01');

        cy.get('[name="email"]').type('sophia@gmail.com');
        cy.get('[name="senha"]').type('Sophia123@');
        cy.get('[name="confirmarSenha"]').type('Sophia123@');

        preencherEndereco(0, '1');

        cy.get('#btnAdicionarEndereco').click();

        preencherEndereco(1, '2');

        preencherCartao(0, true);

        cy.get('#btnAdicionarCartao').click();

        preencherCartao(1, false);
    }

    function preencherEndereco(indice, tipoEndereco) {
        let nomeEndereco;
        let numero;

        if (indice === 0) {
            nomeEndereco = 'Casa';
            numero = '123';
        } else {
            nomeEndereco = 'Trabalho';
            numero = '456';
        }

        cy.get(`[name="enderecos[${indice}].nomeIdentificacao"]`).type(nomeEndereco);
        cy.get(`[name="enderecos[${indice}].tipoEndereco"]`).select(tipoEndereco);
        cy.get(`[name="enderecos[${indice}].tipoResidencia"]`).select('1');
        cy.get(`[name="enderecos[${indice}].tipoLogradouro"]`).select('1');
        cy.get(`[name="enderecos[${indice}].cep"]`).type('08775530');
        cy.get(`[name="enderecos[${indice}].logradouro"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].bairro"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].numero"]`).type(numero);
        cy.get(`[name="enderecos[${indice}].estado"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].cidade"]`).should('not.have.value', '');
        cy.get(`[name="enderecos[${indice}].pais"]`).type('Brasil');
    }

    function preencherCartao(indice, preferencial = false) {
        cy.get(`[name="cartoes[${indice}].numero"]`).type('5303891175233860');
        cy.get(`[name="cartoes[${indice}].nomeImpresso"]`).type('SOPHIA D SILVA');
        cy.get(`[name="cartoes[${indice}].bandeira"]`).select('1');
        cy.get(`[name="cartoes[${indice}].codigoSeguranca"]`).type('1234');

        if (preferencial) {
            cy.get(`[name="cartoes[${indice}].preferencial"][value="true"]`).check();
        }
    }

    function enviarFormulario() {
        cy.get('#formCadastroCliente').then(($form) => {
            $form[0].submit();
        });
    }

    function validarToastErro(mensagem) {
        cy.get('#toast', { timeout: 6000 })
            .should('be.visible')
            .and('contain', mensagem);
    }

    beforeEach(() => {
        cy.visit('/cliente/cadastrar');
    });

    // RN0026
    it('CT01 - Não deve cadastrar o cliente sem o nome', () => {
        preencherDadosValidos();

        cy.get('[name="nome"]').clear();

        enviarFormulario();

        validarToastErro('O nome é obrigatório.');
    });


    // RN0026
    it('CT02 - Não deve cadastrar o cliente sem CPF', () => {
        preencherDadosValidos();

        cy.get('[name="cpf"]').clear();

        enviarFormulario();

        validarToastErro('O CPF é obrigatório.');
    });


    // RN0026
    it('CT03 - Não deve cadastrar o cliente sem selecionar o tipo de telefone', () => {
        preencherDadosValidos();

        cy.get('[name="tipoTelefone"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('O tipo de telefone é obrigatório.');
    });


    // RN0026
    it('CT04 - Não deve cadastrar o cliente sem o telefone', () => {
        preencherDadosValidos();

        cy.get('[name="telefone"]').clear();
        enviarFormulario();

        validarToastErro('O telefone é obrigatório.');
    });


    // RN0026
    it('CT05 - Não deve cadastrar o cliente sem selecionar o gênero', () => {
        preencherDadosValidos();

        cy.get('[name="genero"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('O gênero é obrigatório.');
    });


    // RN0026
    it('CT06 - Não deve cadastrar o cliente sem a data de nascimento', () => {
        preencherDadosValidos();

        cy.get('[name="dataNascimento"]').clear();
        enviarFormulario();

        validarToastErro('A data de nascimento é obrigatória.');
    });


    // RN0026
    it('CT07 - Não deve cadastrar o cliente sem o email', () => {
        preencherDadosValidos();

        cy.get('[name="email"]').clear();
        enviarFormulario();

        validarToastErro('O e-mail é obrigatório.');
    });


    // RN0026
    it('CT08 - Não deve cadastrar o cliente sem a senha', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear();
        enviarFormulario();

        validarToastErro('A senha deve ter entre 8 e 100 caracteres.');
    });


    // RN0026
    it('CT09 - Não deve cadastrar o cliente sem confirmar a senha', () => {
        preencherDadosValidos();

        cy.get('[name="confirmarSenha"]').clear();
        enviarFormulario();

        validarToastErro('A confirmação de senha é obrigatória.');
    });

    // RN0023
    it('CT10 - Não deve cadastrar o cliente sem identificação do endereço', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].nomeIdentificacao"]').clear();
        enviarFormulario();

        validarToastErro('O nome de identificação é obrigatório.');
    });


    // RN0023
    it('CT11 - Não deve cadastrar o cliente sem tipo de endereço', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('O tipo de endereço é obrigatório.');
    });


    // RN0023
    it('CT12 - Não deve cadastrar o cliente sem tipo de residência', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoResidencia"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('O tipo de residência é obrigatório.');
    });


    // RN0023
    it('CT13 - Não deve cadastrar o cliente sem tipo de logradouro', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoLogradouro"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('O tipo de logradouro é obrigatório.');
    });


    // RN0023
    it('CT14 - Não deve cadastrar o cliente sem CEP', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].cep"]').clear();
        enviarFormulario();

        validarToastErro('O CEP é obrigatório.');
    });

    // RN0023
    it('CT15 - Não deve cadastrar o cliente sem logradouro', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].logradouro"]').clear();

        enviarFormulario();

        validarToastErro('O logradouro é obrigatório.');
    });

    // RN0023
    it('CT16 - Não deve cadastrar o cliente sem bairro', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].bairro"]').clear();

        enviarFormulario();

        validarToastErro('O bairro é obrigatório.');
    });


    // RN0023
    it('CT17 - Não deve cadastrar o cliente sem número', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].numero"]').clear();
        enviarFormulario();

        validarToastErro('O número é obrigatório.');
    });


    // RN0023
    it('CT18 - Não deve cadastrar o cliente sem estado', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].estado"]').invoke('val', '');

        enviarFormulario();

        validarToastErro('O estado é obrigatório.');
    });


    // RN0023
    it('CT19 - Não deve cadastrar o cliente sem cidade', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].cidade"]').clear();

        enviarFormulario();

        validarToastErro('A cidade é obrigatória.');
    });

    // RN0023
    it('CT20 - Não deve cadastrar o cliente sem país', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].pais"]').clear();
        enviarFormulario();

        validarToastErro('O país é obrigatório.');
    });

    // RN0024
    it('CT21 - Não deve cadastrar o cliente sem número do cartão', () => {
        preencherDadosValidos();

        cy.get('[name="cartoes[0].numero"]').clear();
        enviarFormulario();

        validarToastErro('O número do cartão é obrigatório.');
    });


    // RN0024
    it('CT22 - Não deve cadastrar o cliente sem nome impresso no cartão', () => {
        preencherDadosValidos();

        cy.get('[name="cartoes[0].nomeImpresso"]').clear();
        enviarFormulario();

        validarToastErro('O nome impresso no cartão é obrigatório.');
    });


    // RN0024
    it('CT23 - Não deve cadastrar o cliente sem a bandeira do cartão', () => {
        preencherDadosValidos();

        cy.get('[name="cartoes[0].bandeira"]').invoke('val', '');
        enviarFormulario();

        validarToastErro('A bandeira do cartão é obrigatória.');
    });


    // RN0025
    it('CT24 - Não deve cadastrar o cliente sem código de segurança', () => {
        preencherDadosValidos();

        cy.get('[name="cartoes[0].codigoSeguranca"]').clear();
        enviarFormulario();

        validarToastErro('O código de segurança deve ter 3 ou 4 caracteres.');
    });

    // RF0027
    it('CT25 - Não deve cadastrar dois cartões como preferenciais', () => {
        preencherDadosValidos();

        cy.get('[name="cartoes[1].preferencial"][value="true"]').invoke('prop', 'checked', true);
        cy.get('[name="cartoes[0].preferencial"][value="true"]').should('be.checked');
        cy.get('[name="cartoes[1].preferencial"][value="true"]').should('be.checked');

        enviarFormulario();

        validarToastErro('Somente um cartão pode ser preferencial.');
    });

    // RNF0031
    it('CT26 - Não deve cadastrar com a senha menor que 8 caracteres', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste@');
        cy.get('[name="confirmarSenha"]').clear().type('Teste@');

        enviarFormulario();

        validarToastErro('A senha deve ter entre 8 e 100 caracteres.');
    });


    // RNF0031
    it('CT27 - Não deve cadastrar com a senha não contendo uma letra maiúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('teste123@');
        cy.get('[name="confirmarSenha"]').clear().type('teste123@');

        enviarFormulario();

        validarToastErro('A senha deve ter pelo menos uma letra maiúscula.');
    });


    // RNF0031
    it('CT28 - Não deve cadastrar com a senha não contendo uma letra minúscula', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('TESTE123@');
        cy.get('[name="confirmarSenha"]').clear().type('TESTE123@');

        enviarFormulario();

        validarToastErro('A senha deve ter pelo menos uma letra minúscula.');
    });


    // RNF0031
    it('CT29 - Não deve cadastrar com a senha não contendo um caractere especial', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste123');
        cy.get('[name="confirmarSenha"]').clear().type('Teste123');

        enviarFormulario();

        validarToastErro('A senha deve ter pelo menos um caractere especial.');
    });


    // RNF0032
    it('CT30 - Não deve cadastrar com senhas diferentes', () => {
        preencherDadosValidos();

        cy.get('[name="senha"]').clear().type('Teste123@');
        cy.get('[name="confirmarSenha"]').clear().type('TESTE');

        enviarFormulario();

        validarToastErro('As senhas não coincidem.');
    });


    // RN0021
    it('CT31 - Não deve cadastrar o cliente sem endereço de cobrança', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('2');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('2');

        enviarFormulario();

        validarToastErro(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });


    // RN0022
    it('CT32 - Não deve cadastrar o cliente sem endereço de entrega', () => {
        preencherDadosValidos();

        cy.get('[name="enderecos[0].tipoEndereco"]').select('1');
        cy.get('[name="enderecos[1].tipoEndereco"]').select('1');

        enviarFormulario();

        validarToastErro(
            'É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos).'
        );
    });

    /*
    // RF0021
    it('CT33 - Deve cadastrar o cliente com todos os dados obrigatórios válidos', () => {
        preencherDadosValidos();

        enviarFormulario();

        cy.get('.toast')
            .should('be.visible')
            .and('contain', 'Cadastro concluído com sucesso!');
    });
     */

});