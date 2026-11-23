const formulario = document.querySelector('#formChatbot');
const campoMensagem = document.querySelector('#inputChatbot');
const areaMensagens = document.querySelector('#chatbotMensagens');
const botaoEnviar = document.querySelector('#btnEnviarChatbot');

const chatbot = document.querySelector('#chatbot');
const botaoAbrir = document.querySelector('#btnAbrirChatbot');
const botaoFechar = document.querySelector('#btnFecharChatbot');

// Permite a formatação Markdown
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


// Envia a avaliação da resposta

// Envia a avaliação da resposta

areaMensagens.addEventListener('click', async (evento) => {

    const botao = evento.target.closest('.botao-avaliacao');

    if (!botao) {
        return;
    }

    const mensagem = botao.closest('.mensagem-bot');

    if (!mensagem) {
        return;
    }

    const mensagemId = mensagem.dataset.mensagemId;

    if (!mensagemId || mensagemId === 'null' || mensagemId === 'undefined') {
        mostrarToast('erro', 'Não foi possível identificar a mensagem.');
        console.error('ID da mensagem não encontrado:', mensagem);
        return;
    }

    const opcao = botao.closest('.opcao-avaliacao');
    const avaliacao = opcao.querySelector('span').textContent.trim();

    const botoes = mensagem.querySelectorAll('.botao-avaliacao');

    try {

        botoes.forEach(b => b.disabled = true);

        const resposta = await fetch('/api/chatbot/avaliacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagemId: Number(mensagemId),
                avaliacao: avaliacao
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Não foi possível registrar a avaliação.');
        }

        mensagem.dataset.avaliacao = avaliacao;

        botao.classList.add('selecionado');

        mostrarToast('sucesso', resultado.mensagem);

    } catch (erro) {

        botoes.forEach(b => b.disabled = false);

        mostrarToast('erro', erro.message);

        console.error('Erro ao registrar avaliação:', erro);
    }
});


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


// Adicionar mensagem
function adicionarMensagem(texto, tipo, mensagemId = null) {

    const mensagem = document.createElement('div');
    const paragrafo = document.createElement('p');

    // Adiciona o CSS
    mensagem.classList.add('mensagem', tipo);

    if (tipo === 'mensagem-bot') {

        paragrafo.innerHTML = marked.parse(texto);

        if (mensagemId != null) {
            mensagem.dataset.mensagemId = mensagemId;
        }
        mensagem.dataset.avaliacao = '';

        // Cria a área de avaliação
        const avaliacao = document.createElement('div');
        avaliacao.classList.add('chatbot-avaliacao');

        // Botão Útil
        const opcaoUtil = document.createElement('div');
        opcaoUtil.classList.add('opcao-avaliacao');

        const botaoUtil = document.createElement('button');
        botaoUtil.type = 'button';
        botaoUtil.classList.add('botao-avaliacao');

        botaoUtil.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>';

        const textoUtil = document.createElement('span');
        textoUtil.textContent = 'Útil';

        opcaoUtil.appendChild(botaoUtil);
        opcaoUtil.appendChild(textoUtil);

        // Botão Não útil
        const opcaoNaoUtil = document.createElement('div');
        opcaoNaoUtil.classList.add('opcao-avaliacao');

        const botaoNaoUtil = document.createElement('button');
        botaoNaoUtil.type = 'button';
        botaoNaoUtil.classList.add('botao-avaliacao');

        botaoNaoUtil.innerHTML = '<i class="fa-regular fa-thumbs-down"></i>';

        const textoNaoUtil = document.createElement('span');
        textoNaoUtil.textContent = 'Não útil';

        opcaoNaoUtil.appendChild(botaoNaoUtil);
        opcaoNaoUtil.appendChild(textoNaoUtil);

        // Adiciona os botões à avaliação
        avaliacao.appendChild(opcaoUtil);
        avaliacao.appendChild(opcaoNaoUtil);

        // Adiciona os elementos à mensagem
        mensagem.appendChild(paragrafo);
        mensagem.appendChild(avaliacao);

    } else {
        paragrafo.textContent = texto;
        mensagem.appendChild(paragrafo);
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

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.resposta);
        }

        adicionarMensagem(
            dados.resposta,
            'mensagem-bot',
            dados.mensagemId
        );

    } catch (erro) {
        adicionarMensagem(
            erro.message, 'mensagem-bot');
    } finally {
        botaoEnviar.disabled = false;
    }
}

// Limpa a conversa do chatbot
document.addEventListener("DOMContentLoaded", function () {
    const btnLimpar = document.getElementById("btnLimparChatbot");
    const modal = document.getElementById("modalConfirmarExclusaoChatBot");
    const form = document.getElementById("formExcluirConversa");

    btnLimpar.addEventListener("click", function () {
        modal.classList.add("active");
    });

    document.getElementById("btnFecharModalExclusaoChatbot")
        .addEventListener("click", function () {
            modal.classList.remove("active");
        });

    document.getElementById("btnCancelarExclusaoChatbot")
        .addEventListener("click", function () {
            modal.classList.remove("active");
        });

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {
            const resposta = await fetch(form.action, {
                method: "POST",

                // Pega os campos preenchidos
                body: new FormData(form)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.mensagem);
            }

            document.getElementById("chatbotMensagens").innerHTML = `
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

            modal.classList.remove("active");

            mostrarToast("sucesso", resultado.mensagem);

        } catch (erro) {
            mostrarToast("erro", erro.message);
        }
    });
});

