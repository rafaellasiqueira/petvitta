document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const btnAbrir = document.getElementById('btnAbrirChatbot');
    const btnFechar = document.getElementById('btnFecharChatbot');
    const form = document.getElementById('formChatbot');
    const input = document.getElementById('inputChatbot');
    const mensagens = document.getElementById('chatbotMensagens');

    // Abrir chatbot
    btnAbrir.addEventListener('click', () => {
        chatbot.classList.add('active');
    });

    // Fechar chatbot
    btnFechar.addEventListener('click', () => {
        chatbot.classList.remove('active');
    });

    // Enviar mensagem
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const texto = input.value.trim();

        if (texto === '') {
            return;
        }

        adicionarMensagem(texto, 'usuario');
        input.value = '';

        // Resposta do chatbot
        const mensagem = texto.toLowerCase(); /* Tudo em letras minusculas */

        // Cachorro
        if (mensagem.includes('cachorro')) {

            adicionarMensagem(
                '🐶 Recomendo a Ração Cães Adultos Frango e Carne Choice por R$ 156,75!',
                'bot'
            );

        // Gato
        } else if (mensagem.includes('gato')) {

            adicionarMensagem(
                '🐱 Recomendo a Ração GoldeN Special Gatos Adultos sabor Frango e Carne por R$ 59,90!',
                'bot'
            );

        // Petisco
        } else if (mensagem.includes('petisco')) {

            adicionarMensagem(
                '🐾 Recomendo o Petisco Dreamies Sabor Queijo para Gatos por R$ 7,90!',
                'bot'
            );


        // Suplemento
        } else if (mensagem.includes('suplemento')) {

            adicionarMensagem(
                '🐾 Recomendo o Suplemento Gatos Nutrifull Organnact por R$ 59,08!',
                'bot'
            );


        // Ração
        } else if (mensagem.includes('ração')) {

            adicionarMensagem(
                '🐾 Temos várias rações! Você procura para cachorro ou gato?',
                'bot'
            );

        // Resposta padrão
        } else {
            adicionarMensagem(
                'Posso recomendar produtos para cachorro, gato, petiscos ou suplementos! 🐾',
                'bot'
            );
        }
    });

    // Adicionar mensagem
    function adicionarMensagem(texto, tipo) {
        const mensagem = document.createElement('div');
        mensagem.classList.add('mensagem');

        if (tipo === 'usuario') {
            mensagem.classList.add('mensagem-usuario');
        } else {
            mensagem.classList.add('mensagem-bot');
        }

        mensagem.innerHTML = `<p>${texto}</p>`;
        mensagens.appendChild(mensagem);
        mensagens.scrollTop = mensagens.scrollHeight;
    }

});