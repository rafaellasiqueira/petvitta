document.addEventListener('DOMContentLoaded', () => {

    const chatbot = document.getElementById('chatbot');
    const btnAbrir = document.getElementById('btnAbrirChatbot');
    const btnFechar = document.getElementById('btnFecharChatbot');
    const form = document.getElementById('formChatbot');
    const input = document.getElementById('inputChatbot');
    const mensagens = document.getElementById('chatbotMensagens');

    // ABRIR CHATBOT
    btnAbrir?.addEventListener('click', () => {
        chatbot.classList.add('active'); // Corrigido de 'ativo' para 'active'
        input?.focus();
    });

    // FECHAR CHATBOT
    btnFechar?.addEventListener('click', () => {
        chatbot.classList.remove('active'); // Corrigido de 'ativo' para 'active'
    });

    // ENVIAR MENSAGEM
    form?.addEventListener('submit', (event) => {
        event.preventDefault();

        const texto = input.value.trim();
        if (!texto) return;

        adicionarMensagem(texto, 'usuario');
        input.value = '';

        setTimeout(() => {
            responderChatbot(texto);
        }, 600);
    });

    // ADICIONAR MENSAGEM
    function adicionarMensagem(texto, tipo) {
        const mensagem = document.createElement('div');
        mensagem.classList.add('mensagem');

        if (tipo === 'usuario') {
            mensagem.classList.add('mensagem-usuario');
        } else {
            mensagem.classList.add('mensagem-bot');
        }

        const p = document.createElement('p');
        p.textContent = texto;

        mensagem.appendChild(p);
        mensagens.appendChild(mensagem);

        mensagens.scrollTop = mensagens.scrollHeight;
    }

    // RESPOSTAS DO CHATBOT
    function responderChatbot(texto) {
        const mensagem = texto.toLowerCase();

        if (mensagem.includes('ração') || mensagem.includes('racao')) {
            adicionarMensagem('Claro! 🐾 Para qual tipo de pet você procura a ração?', 'bot');
            return;
        }

        if (mensagem.includes('cachorro') || mensagem.includes('cão') || mensagem.includes('cao')) {
            adicionarMensagem('Encontrei algumas opções para cães! 🐶 Você procura para qual porte?', 'bot');
            return;
        }

        if (mensagem.includes('gato') || mensagem.includes('gata')) {
            adicionarMensagem('Tenho ótimas opções para gatos! 🐱 Você procura uma ração seca ou úmida?', 'bot');
            return;
        }

        if (mensagem.includes('seca')) {
            mostrarRecomendacoes();
            return;
        }

        if (mensagem.includes('petisco')) {
            adicionarMensagem('Temos diversos petiscos para cães e gatos! 🐾 Posso recomendar algumas opções de acordo com o porte e a idade do seu pet.', 'bot');
            return;
        }

        if (mensagem.includes('suplemento')) {
            adicionarMensagem('Temos suplementos para diferentes necessidades dos pets. 🐾 Posso ajudar a encontrar uma opção adequada.', 'bot');
            return;
        }

        adicionarMensagem('Posso ajudar a encontrar rações, petiscos e suplementos. 🐾 Me conte um pouco mais sobre o que você procura!', 'bot');
    }

    // RECOMENDAÇÕES
    function mostrarRecomendacoes() {
        const mensagem = document.createElement('div');
        mensagem.classList.add('mensagem', 'mensagem-bot');

        mensagem.innerHTML = `
            <p>Encontrei algumas opções para você! 🐾</p>
            <div class="recomendacoes-chatbot">
                <div class="recomendacao-chatbot">
                    <h4>Ração Cães Adultos</h4>
                    <span>Frango e Carne • 10,1 KG</span>
                    <button type="button" class="btn-recomendacao">Ver produto</button>
                </div>
                <div class="recomendacao-chatbot">
                    <h4>GoldeN Special Gatos</h4>
                    <span>Frango e Carne • 10,1 KG</span>
                    <button type="button" class="btn-recomendacao">Ver produto</button>
                </div>
            </div>
        `;

        mensagens.appendChild(mensagem);
        mensagens.scrollTop = mensagens.scrollHeight;
    }
});