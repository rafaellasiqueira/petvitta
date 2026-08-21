document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // MODAL ADICIONAR / EDITAR ENDEREÇO
    // =========================================================

    const modalAdicionarEditarEndereco =
        document.getElementById('modalAdicionarEditarEndereco');

    const btnAdicionarEndereco =
        document.getElementById('btnAdicionarEndereco');

    const btnFecharModalEndereco =
        document.getElementById('btnFecharModalEndereco');

    const btnCancelarEndereco =
        document.getElementById('btnCancelarEndereco');

    const tituloModalEndereco =
        document.getElementById('tituloModalEndereco');

    const btnSalvarEndereco =
        document.getElementById('btnSalvarEndereco');

    const formEndereco =
        document.getElementById('formEndereco');


    // =========================================================
    // CAMPOS DO ENDEREÇO
    // =========================================================

    const nomeIdentificacao =
        document.getElementById('nomeIdentificacao');

    const tipoEndereco =
        document.getElementById('tipoEndereco');

    const tipoResidencia =
        document.getElementById('tipoResidencia');

    const tipoLogradouro =
        document.getElementById('tipoLogradouro');

    const cep =
        document.getElementById('cep');

    const logradouro =
        document.getElementById('logradouro');

    const bairro =
        document.getElementById('bairro');

    const numero =
        document.getElementById('numero');

    const estado =
        document.getElementById('estado');

    const cidade =
        document.getElementById('cidade');

    const pais =
        document.getElementById('pais');

    const observacoes =
        document.getElementById('observacoes');

    const salvarPerfil =
        document.getElementById('salvarPerfil');

    const campoSalvarPerfil =
        document.getElementById('campoSalvarPerfil');


    // =========================================================
    // VERIFICA SE ESTÁ NA PÁGINA DE PERFIL
    // =========================================================

    const estaNaPaginaPerfil =
        window.location.pathname.includes('/perfil');


    // =========================================================
    // ESCONDE "SALVAR ESTE ENDEREÇO NO MEU PERFIL"
    // =========================================================
    // Na página de perfil esse campo nunca será exibido.
    // =========================================================

    if (estaNaPaginaPerfil && campoSalvarPerfil) {
        campoSalvarPerfil.style.display = 'none';
    }


    // =========================================================
    // MODO DO ENDEREÇO
    // =========================================================

    let modoEndereco = 'adicionar';


    // =========================================================
    // ABRIR MODAL DE ENDEREÇO
    // =========================================================

    const abrirModalEndereco = () => {

        if (modalAdicionarEditarEndereco) {
            modalAdicionarEditarEndereco.classList.add('active');
        }
    };


    // =========================================================
    // FECHAR MODAL DE ENDEREÇO
    // =========================================================

    const fecharModalEndereco = () => {

        if (modalAdicionarEditarEndereco) {
            modalAdicionarEditarEndereco.classList.remove('active');
        }
    };


    // =========================================================
    // ADICIONAR ENDEREÇO
    // =========================================================

    if (btnAdicionarEndereco) {

        btnAdicionarEndereco.addEventListener('click', () => {

            modoEndereco = 'adicionar';

            if (formEndereco) {
                formEndereco.reset();
            }

            // Define Brasil novamente depois do reset
            if (pais) {
                pais.value = 'Brasil';
            }

            if (tituloModalEndereco) {
                tituloModalEndereco.textContent =
                    'Adicionar endereço';
            }

            if (btnSalvarEndereco) {
                btnSalvarEndereco.textContent =
                    'Adicionar';
            }


            // =================================================
            // SALVAR NO PERFIL
            // =================================================
            // Como estamos na página de perfil, permanece
            // escondido.
            // =================================================

            if (estaNaPaginaPerfil) {

                if (campoSalvarPerfil) {
                    campoSalvarPerfil.style.display = 'none';
                }

                if (salvarPerfil) {
                    salvarPerfil.checked = false;
                }

            } else {

                // Caso o mesmo JS seja usado em outra página,
                // o campo poderá aparecer normalmente.

                if (campoSalvarPerfil) {
                    campoSalvarPerfil.style.display = 'flex';
                }

                if (salvarPerfil) {
                    salvarPerfil.checked = false;
                }
            }


            abrirModalEndereco();
        });
    }


    // =========================================================
    // EDITAR ENDEREÇO
    // =========================================================

    const botoesEditarEndereco =
        document.querySelectorAll('.editar-endereco');

    botoesEditarEndereco.forEach((botao) => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();

            modoEndereco = 'editar';

            const dados = botao.dataset;


            if (nomeIdentificacao) {
                nomeIdentificacao.value =
                    dados.nome || '';
            }

            if (tipoEndereco) {
                tipoEndereco.value =
                    dados.tipoEndereco || '';
            }

            if (tipoResidencia) {
                tipoResidencia.value =
                    dados.tipoResidencia || '';
            }

            if (tipoLogradouro) {
                tipoLogradouro.value =
                    dados.tipoLogradouro || '';
            }

            if (cep) {
                cep.value =
                    dados.cep || '';
            }

            if (logradouro) {
                logradouro.value =
                    dados.logradouro || '';
            }

            if (bairro) {
                bairro.value =
                    dados.bairro || '';
            }

            if (numero) {
                numero.value =
                    dados.numero || '';
            }

            if (estado) {
                estado.value =
                    dados.estado || '';
            }

            if (cidade) {
                cidade.value =
                    dados.cidade || '';
            }

            if (pais) {
                pais.value =
                    dados.pais || 'Brasil';
            }

            if (observacoes) {
                observacoes.value =
                    dados.observacoes || '';
            }


            // =================================================
            // ESCONDE "SALVAR NO PERFIL"
            // =================================================

            if (salvarPerfil) {
                salvarPerfil.checked = false;
            }

            if (campoSalvarPerfil) {
                campoSalvarPerfil.style.display = 'none';
            }


            if (tituloModalEndereco) {
                tituloModalEndereco.textContent =
                    'Editar endereço';
            }

            if (btnSalvarEndereco) {
                btnSalvarEndereco.textContent =
                    'Salvar alterações';
            }


            abrirModalEndereco();
        });
    });


    // =========================================================
    // FECHAR MODAL DE ENDEREÇO
    // =========================================================

    if (btnFecharModalEndereco) {

        btnFecharModalEndereco.addEventListener(
            'click',
            fecharModalEndereco
        );
    }


    if (btnCancelarEndereco) {

        btnCancelarEndereco.addEventListener(
            'click',
            fecharModalEndereco
        );
    }


    // =========================================================
    // SALVAR / ADICIONAR ENDEREÇO
    // =========================================================

    if (formEndereco) {

        formEndereco.addEventListener('submit', (event) => {

            event.preventDefault();


            if (modoEndereco === 'adicionar') {

                console.log(
                    'Novo endereço adicionado.'
                );

            } else if (modoEndereco === 'editar') {

                console.log(
                    'Endereço editado.'
                );
            }


            fecharModalEndereco();
        });
    }


    // =========================================================
    // MODAL ADICIONAR / EDITAR CARTÃO
    // =========================================================

    const modalCadastrarCartao =
        document.getElementById('modalCadastrarCartao');

    const formCartao =
        document.getElementById('formCartao');

    const tituloModalCartao =
        document.getElementById('tituloModalCartao');

    const btnSalvarCartao =
        document.getElementById('btnSalvarCartao');

    const btnFecharModalCartao =
        document.getElementById('btnFecharModalCartao');

    const btnCancelarCartao =
        document.getElementById('btnCancelarCartao');


    // =========================================================
    // CAMPOS DO CARTÃO
    // =========================================================

    const numeroCartao =
        document.getElementById('numeroCartao');

    const nomeCartao =
        document.getElementById('nomeCartao');

    const bandeiraCartao =
        document.getElementById('bandeiraCartao');

    const cvvCartao =
        document.getElementById('cvvCartao');

    const validadeCartao =
        document.getElementById('validadeCartao');

    const salvarCartao =
        document.getElementById('salvarCartao');

    const campoSalvarCartao =
        document.getElementById('campoSalvarCartao');


    // =========================================================
    // ESCONDE "SALVAR ESTE CARTÃO NO MEU PERFIL"
    // =========================================================

    if (estaNaPaginaPerfil && campoSalvarCartao) {
        campoSalvarCartao.style.display = 'none';
    }


    // =========================================================
    // MODO DO CARTÃO
    // =========================================================

    let modoCartao = 'adicionar';


    // =========================================================
    // ABRIR MODAL DE CARTÃO
    // =========================================================

    const abrirModalCartao = () => {

        if (modalCadastrarCartao) {
            modalCadastrarCartao.classList.add('active');
        }
    };


    // =========================================================
    // FECHAR MODAL DE CARTÃO
    // =========================================================

    const fecharModalCartao = () => {

        if (modalCadastrarCartao) {
            modalCadastrarCartao.classList.remove('active');
        }
    };


    // =========================================================
    // ADICIONAR CARTÃO
    // =========================================================

    const botoesAdicionarCartao =
        document.querySelectorAll('.btn-adicionar-cartao');

    botoesAdicionarCartao.forEach((botao) => {

        botao.addEventListener('click', () => {

            modoCartao = 'adicionar';

            if (formCartao) {
                formCartao.reset();
            }


            if (tituloModalCartao) {
                tituloModalCartao.textContent =
                    'Cadastrar cartão';
            }

            if (btnSalvarCartao) {
                btnSalvarCartao.textContent =
                    'Cadastrar';
            }


            // =================================================
            // SALVAR NO PERFIL
            // =================================================
            // Na página de perfil permanece escondido.
            // =================================================

            if (estaNaPaginaPerfil) {

                if (campoSalvarCartao) {
                    campoSalvarCartao.style.display = 'none';
                }

                if (salvarCartao) {
                    salvarCartao.checked = false;
                }

            } else {

                if (campoSalvarCartao) {
                    campoSalvarCartao.style.display = 'flex';
                }

                if (salvarCartao) {
                    salvarCartao.checked = false;
                }
            }


            abrirModalCartao();
        });
    });


    // =========================================================
    // EDITAR CARTÃO
    // =========================================================

    const botoesEditarCartao =
        document.querySelectorAll('.editar-cartao');

    botoesEditarCartao.forEach((botao) => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();

            modoCartao = 'editar';

            const dados = botao.dataset;


            if (numeroCartao) {
                numeroCartao.value =
                    dados.numero || '';
            }

            if (nomeCartao) {
                nomeCartao.value =
                    dados.nome || '';
            }

            if (bandeiraCartao) {
                bandeiraCartao.value =
                    dados.bandeira || '';
            }

            if (cvvCartao) {
                cvvCartao.value =
                    dados.cvv || '';
            }

            if (validadeCartao) {
                validadeCartao.value =
                    dados.validade || '';
            }


            if (tituloModalCartao) {
                tituloModalCartao.textContent =
                    'Editar cartão';
            }

            if (btnSalvarCartao) {
                btnSalvarCartao.textContent =
                    'Salvar alterações';
            }


            // =================================================
            // ESCONDE "SALVAR NO PERFIL"
            // =================================================

            if (campoSalvarCartao) {
                campoSalvarCartao.style.display = 'none';
            }

            if (salvarCartao) {
                salvarCartao.checked = false;
            }


            abrirModalCartao();
        });
    });


    // =========================================================
    // FECHAR MODAL CARTÃO
    // =========================================================

    if (btnFecharModalCartao) {

        btnFecharModalCartao.addEventListener(
            'click',
            fecharModalCartao
        );
    }


    if (btnCancelarCartao) {

        btnCancelarCartao.addEventListener(
            'click',
            fecharModalCartao
        );
    }


    // =========================================================
    // SALVAR / ADICIONAR CARTÃO
    // =========================================================

    if (formCartao) {

        formCartao.addEventListener('submit', (event) => {

            event.preventDefault();


            if (modoCartao === 'adicionar') {

                console.log(
                    'Novo cartão cadastrado.'
                );

            } else if (modoCartao === 'editar') {

                console.log(
                    'Cartão editado.'
                );
            }


            fecharModalCartao();
        });
    }


    // =========================================================
    // MÁSCARA CEP
    // =========================================================

    if (cep) {

        cep.addEventListener('input', () => {

            let valor =
                cep.value.replace(/\D/g, '');

            valor =
                valor.substring(0, 8);

            if (valor.length > 5) {

                valor =
                    valor.substring(0, 5) +
                    '-' +
                    valor.substring(5);
            }

            cep.value = valor;
        });
    }


    // =========================================================
    // MÁSCARA NÚMERO DO CARTÃO
    // =========================================================

    if (numeroCartao) {

        numeroCartao.addEventListener('input', () => {

            let valor =
                numeroCartao.value.replace(/\D/g, '');

            valor =
                valor.substring(0, 16);

            valor =
                valor.replace(
                    /(\d{4})(?=\d)/g,
                    '$1 '
                );

            numeroCartao.value = valor;
        });
    }


    // =========================================================
    // MÁSCARA CVV
    // =========================================================

    if (cvvCartao) {

        cvvCartao.addEventListener('input', () => {

            cvvCartao.value =
                cvvCartao.value
                    .replace(/\D/g, '')
                    .substring(0, 4);
        });
    }


    // =========================================================
    // MÁSCARA VALIDADE
    // =========================================================

    if (validadeCartao) {

        validadeCartao.addEventListener('input', () => {

            let valor =
                validadeCartao.value.replace(/\D/g, '');

            valor =
                valor.substring(0, 4);

            if (valor.length > 2) {

                valor =
                    valor.substring(0, 2) +
                    '/' +
                    valor.substring(2);
            }

            validadeCartao.value = valor;
        });
    }


    // =========================================================
    // MODAL DE EXCLUSÃO
    // =========================================================

    const modalConfirmarExclusao =
        document.getElementById('modalConfirmarExclusao');

    const btnFecharModalExclusao =
        document.getElementById('btnFecharModalExclusao');

    const btnCancelarExclusao =
        document.getElementById('btnCancelarExclusao');

    const btnConfirmarExclusao =
        document.getElementById('btnConfirmarExclusao');

    const mensagemModalExclusao =
        document.getElementById('mensagemModalExclusao');


    let tipoExclusao = '';
    let nomeExclusao = '';


    // =========================================================
    // ABRIR MODAL DE EXCLUSÃO
    // =========================================================

    const abrirModalExclusao = () => {

        if (modalConfirmarExclusao) {
            modalConfirmarExclusao.classList.add('active');
        }
    };


    // =========================================================
    // FECHAR MODAL DE EXCLUSÃO
    // =========================================================

    const fecharModalExclusao = () => {

        if (modalConfirmarExclusao) {
            modalConfirmarExclusao.classList.remove('active');
        }
    };


    // =========================================================
    // EXCLUIR ENDEREÇO
    // =========================================================

    const botoesExcluirEndereco =
        document.querySelectorAll('.excluir-endereco');

    botoesExcluirEndereco.forEach((botao) => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();

            tipoExclusao = 'endereco';

            nomeExclusao =
                botao.dataset.nome ||
                'este endereço';


            if (mensagemModalExclusao) {

                mensagemModalExclusao.textContent =
                    `Tem certeza de que deseja excluir o endereço "${nomeExclusao}"?`;
            }


            abrirModalExclusao();
        });
    });


    // =========================================================
    // EXCLUIR CARTÃO
    // =========================================================

    const botoesExcluirCartao =
        document.querySelectorAll('.excluir-cartao');

    botoesExcluirCartao.forEach((botao) => {

        botao.addEventListener('click', (event) => {

            event.preventDefault();
            event.stopPropagation();

            tipoExclusao = 'cartao';

            nomeExclusao =
                botao.dataset.nome ||
                'este cartão';


            if (mensagemModalExclusao) {

                mensagemModalExclusao.textContent =
                    `Tem certeza de que deseja excluir o cartão "${nomeExclusao}"?`;
            }


            abrirModalExclusao();
        });
    });


    // =========================================================
    // FECHAR MODAL DE EXCLUSÃO
    // =========================================================

    if (btnFecharModalExclusao) {

        btnFecharModalExclusao.addEventListener(
            'click',
            fecharModalExclusao
        );
    }


    if (btnCancelarExclusao) {

        btnCancelarExclusao.addEventListener(
            'click',
            fecharModalExclusao
        );
    }


    // =========================================================
    // CONFIRMAR EXCLUSÃO
    // =========================================================

    if (btnConfirmarExclusao) {

        btnConfirmarExclusao.addEventListener(
            'click',
            () => {

                if (tipoExclusao === 'endereco') {

                    console.log(
                        'Endereço excluído:',
                        nomeExclusao
                    );

                } else if (tipoExclusao === 'cartao') {

                    console.log(
                        'Cartão excluído:',
                        nomeExclusao
                    );
                }


                fecharModalExclusao();
            }
        );
    }

    // =========================================================
    // VIA CEP
    // =========================================================

    if (cep) {

        cep.addEventListener('blur', async () => {

            const cepLimpo =
                cep.value.replace(/\D/g, '');

            // Verifica se possui 8 números
            if (cepLimpo.length !== 8) {
                return;
            }

            try {

                const resposta =
                    await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

                if (!resposta.ok) {
                    throw new Error('Erro ao consultar o CEP.');
                }

                const dados =
                    await resposta.json();

                // CEP não encontrado
                if (dados.erro) {

                    alert('CEP não encontrado.');

                    if (logradouro) {
                        logradouro.value = '';
                    }

                    if (bairro) {
                        bairro.value = '';
                    }

                    if (cidade) {
                        cidade.value = '';
                    }

                    if (estado) {
                        estado.value = '';
                    }

                    return;
                }

                // Preenche os campos automaticamente
                if (logradouro) {
                    logradouro.value =
                        dados.logradouro || '';
                }

                if (bairro) {
                    bairro.value =
                        dados.bairro || '';
                }

                if (cidade) {
                    cidade.value =
                        dados.localidade || '';
                }

                if (estado) {
                    estado.value =
                        dados.uf || '';
                }

                if (pais) {
                    pais.value = 'Brasil';
                }

            } catch (erro) {

                console.error(
                    'Erro ao consultar ViaCEP:',
                    erro
                );

                alert(
                    'Não foi possível consultar o CEP. Tente novamente.'
                );
            }
        });
    }

});