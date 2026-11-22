
const formulario = document.querySelector('#formChatbot');
const campoMensagem = document.querySelector('#inputChatbot');
const areaMensagens = document.querySelector('#chatbotMensagens');
const botaoEnviar = document.querySelector('#btnEnviarChatbot');

const chatbot = document.querySelector('#chatbot');
const botaoAbrir = document.querySelector('#btnAbrirChatbot');
const botaoFechar = document.querySelector('#btnFecharChatbot');

document.querySelectorAll('#chatbotMensagens .mensagem-bot p').forEach(paragrafo => {
    paragrafo.innerHTML = marked.parse(paragrafo.textContent);
});

// Abre o chatbot
botaoAbrir.addEventListener('click', () => {
    chatbot.classList.add('active');
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
});

// Fecha o chatbot
botaoFechar.addEventListener('click', () => {
    chatbot.classList.remove('active');
});


// Cria os botões de avaliação
function adicionarBotoesAvaliacao(mensagem, mensagemId, avaliacaoSalva = null) {

    const avaliacao = document.createElement('div');
    avaliacao.classList.add('chatbot-avaliacao');

    const opcaoPositiva = document.createElement('div');
    opcaoPositiva.classList.add('opcao-avaliacao');

    const btnPositivo = document.createElement('button');
    btnPositivo.type = 'button';
    btnPositivo.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>';

    const textoPositivo = document.createElement('span');
    textoPositivo.textContent = 'Útil';

    opcaoPositiva.appendChild(btnPositivo);
    opcaoPositiva.appendChild(textoPositivo);

    const opcaoNegativa = document.createElement('div');
    opcaoNegativa.classList.add('opcao-avaliacao');

    const btnNegativo = document.createElement('button');
    btnNegativo.type = 'button';
    btnNegativo.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>';

    const textoNegativo = document.createElement('span');
    textoNegativo.textContent = 'Não útil';

    opcaoNegativa.appendChild(btnNegativo);
    opcaoNegativa.appendChild(textoNegativo);

    // Recupera a avaliação salva
    if (avaliacaoSalva === 'Útil') {
        btnPositivo.classList.add('selecionado');
    }

    if (avaliacaoSalva === 'Não útil') {
        btnNegativo.classList.add('selecionado');
    }

    // Verifica se a mensagem já foi avaliada
    if (avaliacaoSalva !== null && avaliacaoSalva !== '') {
        btnPositivo.disabled = true;
        btnNegativo.disabled = true;
    }

    // Envia a avaliação
    [btnPositivo, btnNegativo].forEach(botao => {

        botao.addEventListener('click', async () => {

            let avaliacao;

            if (botao === btnPositivo) {
                avaliacao = 'Útil';
            } else {
                avaliacao = 'Não útil';
            }

            try {

                const resposta = await fetch('/api/chatbot/avaliacao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        avaliacao: avaliacao,
                        mensagemId: mensagemId
                    })
                });

                if (!resposta.ok) {
                    throw new Error('Não foi possível enviar a avaliação.');
                }

                btnPositivo.classList.remove('selecionado');
                btnNegativo.classList.remove('selecionado');

                botao.classList.add('selecionado');

                btnPositivo.disabled = true;
                btnNegativo.disabled = true;

            } catch (erro) {

                console.error('Erro ao enviar avaliação:', erro);

            }

        });

    });

    avaliacao.appendChild(opcaoPositiva);
    avaliacao.appendChild(opcaoNegativa);

    mensagem.appendChild(avaliacao);
}

// Recupera os botões das mensagens salvas
document.querySelectorAll('#chatbotMensagens .mensagem-bot[data-mensagem-id]')
    .forEach(mensagem => {

        const mensagemId = mensagem.dataset.mensagemId;
        const avaliacaoSalva = mensagem.dataset.avaliacao;

        adicionarBotoesAvaliacao(
            mensagem,
            mensagemId,
            avaliacaoSalva
        );

    });

function adicionarMensagem(texto, tipo, mensagemId = null) {

    const mensagem = document.createElement('div');
    const paragrafo = document.createElement('p');

    mensagem.classList.add('mensagem', tipo);

    if (tipo === 'mensagem-bot') {
        paragrafo.innerHTML = marked.parse(texto);
    } else {
        paragrafo.textContent = texto;
    }

    mensagem.appendChild(paragrafo);

    // Adiciona os botões de avaliação
    if (tipo === 'mensagem-bot' && mensagemId) {

        adicionarBotoesAvaliacao(
            mensagem,
            mensagemId
        );

    }

    areaMensagens.appendChild(mensagem);

    areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

// Envia a mensagem para o Gemini
async function enviarMensagem(texto) {

    try {

        botaoEnviar.disabled = true;

        const resposta = await fetch('/api/chatbot/mensagem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: texto
            })
        });

        // Converte a resposta do servidor para JSON
        const dados = await resposta.json();

        // Verifica se o servidor retornou algum erro
        if (!resposta.ok) {

            console.error('Erro retornado pelo servidor:', dados);

            throw new Error(
                `Erro HTTP ${resposta.status}: ${dados.resposta || 'Falha ao consultar o chatbot.'}`
            );
        }

        // Exibe a resposta da Gemini
        adicionarMensagem(
            dados.resposta,
            'mensagem-bot',
            dados.mensagemId
        );

    } catch (erro) {

        console.error('Erro no chatbot:', erro);

        adicionarMensagem(
            'Desculpe, não consegui responder agora. Tente novamente! 🐾',
            'mensagem-bot'
        );

    } finally {

        botaoEnviar.disabled = false;
    }
}


// Evento de envio do formulário
formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const texto = campoMensagem.value.trim();

    if (!texto) {
        return;
    }

    adicionarMensagem(texto, 'mensagem-usuario');

    campoMensagem.value = '';

    await enviarMensagem(texto);
});



document.addEventListener("DOMContentLoaded", function () {

    // Elementos do modal
    const btnLimparChatbot = document.getElementById("btnLimparChatbot");
    const modalExclusaoChatbot = document.getElementById("modalConfirmarExclusaoChatBot");

    const btnFecharModalExclusao = document.getElementById("btnFecharModalExclusaoChatbot");
    const btnCancelarExclusao = document.getElementById("btnCancelarExclusaoChatbot");

    const formExcluirConversa = document.getElementById("formExcluirConversa");

    // Abrir modal
    btnLimparChatbot.addEventListener("click", function () {
        modalExclusaoChatbot.classList.add("active");
    });

    // Fechar modal pelo X
    btnFecharModalExclusao.addEventListener("click", function () {
        modalExclusaoChatbot.classList.remove("active");
    });

    // Fechar modal pelo botão cancelar
    btnCancelarExclusao.addEventListener("click", function () {
        modalExclusaoChatbot.classList.remove("active");
    });

    // Confirmar exclusão
    formExcluirConversa.addEventListener("submit", async function (event) {

        event.preventDefault();

        const btnExcluir = formExcluirConversa.querySelector("button[type='submit']");

        btnExcluir.disabled = true;

        try {

            const resposta = await fetch(formExcluirConversa.action, {
                method: "POST",
                body: new FormData(formExcluirConversa)
            });

            if (!resposta.ok) {
                throw new Error("Não foi possível excluir a conversa.");
            }

            // Limpa as mensagens da tela
            const mensagens = document.getElementById("chatbotMensagens");

            mensagens.innerHTML = `
                <div class="mensagem mensagem-bot">
                    <p>
                        Olá! Seja bem-vindo(a) à PetVitta Club!
                        Sou sua assistente virtual e estou pronta
                        para ajudar com recomendações de rações,
                        petiscos, suplementos e muito mais.
                        É só me dizer o que você precisa!
                    </p>
                </div>
            `;

            // Fecha o modal
            modalExclusaoChatbot.classList.remove("active");

        } catch (erro) {

            console.error(erro);
            alert("Não foi possível excluir a conversa. Tente novamente!");

        } finally {

            btnExcluir.disabled = false;
        }
    });

});
