
const formulario = document.querySelector('#formChatbot');
const campoMensagem = document.querySelector('#inputChatbot');
const areaMensagens = document.querySelector('#chatbotMensagens');
const botaoEnviar = document.querySelector('#btnEnviarChatbot');

const chatbot = document.querySelector('#chatbot');
const botaoAbrir = document.querySelector('#btnAbrirChatbot');
const botaoFechar = document.querySelector('#btnFecharChatbot');

// Abre o chatbot
botaoAbrir.addEventListener('click', () => {
    chatbot.classList.add('active');
});

// Fecha o chatbot
botaoFechar.addEventListener('click', () => {
    chatbot.classList.remove('active');
});

// Adiciona uma mensagem na conversa
function adicionarMensagem(texto, tipo) {

    const mensagem = document.createElement('div');

    mensagem.classList.add('mensagem', tipo);
    mensagem.textContent = texto;

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
        adicionarMensagem(dados.resposta, 'mensagem-bot');

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
