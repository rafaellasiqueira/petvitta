document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // ELEMENTOS
    // =========================================================

    const chatbot = document.getElementById('chatbot');
    const btnAbrir = document.getElementById('btnAbrirChatbot');
    const btnFechar = document.getElementById('btnFecharChatbot');
    const form = document.getElementById('formChatbot');
    const input = document.getElementById('inputChatbot');
    const mensagens = document.getElementById('chatbotMensagens');


    // =========================================================
    // ABRIR CHATBOT
    // =========================================================

    btnAbrir?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!chatbot) return;

        // Alterna a classe active (Abre se estiver fechado, fecha se estiver aberto)
        chatbot.classList.toggle('active');

        if (chatbot.classList.contains('active')) {
            input?.focus();
        }
    });


    // =========================================================
    // FECHAR CHATBOT
    // =========================================================

    btnFechar?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!chatbot) return;

        chatbot.classList.remove('active');
    });


    // =========================================================
    // ENVIAR MENSAGEM
    // =========================================================

    form?.addEventListener('submit', (event) => {

        event.preventDefault();

        if (!input || !mensagens) {
            return;
        }

        const texto = input.value.trim();

        // Não envia mensagem vazia
        if (!texto) {
            return;
        }

        // Adiciona mensagem do usuário
        adicionarMensagem(texto, 'usuario');

        // Limpa o campo
        input.value = '';

        // Resposta do chatbot
        setTimeout(() => {
            responderChatbot(texto);
        }, 600);

    });


    // =========================================================
    // ADICIONAR MENSAGEM
    // =========================================================

    function adicionarMensagem(texto, tipo) {

        if (!mensagens) {
            return;
        }

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

        // Scroll para a última mensagem
        mensagens.scrollTop = mensagens.scrollHeight;

    }


    // =========================================================
    // RESPOSTAS DO CHATBOT
    // =========================================================

    function responderChatbot(texto) {

        const mensagem = texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');


        // -----------------------------------------------------
        // RAÇÃO
        // -----------------------------------------------------

        if (mensagem.includes('racao')) {

            adicionarMensagem(
                'Claro! 🐾 Para qual tipo de pet você procura a ração?',
                'bot'
            );

            return;
        }


        // -----------------------------------------------------
        // CACHORRO
        // -----------------------------------------------------

        if (
            mensagem.includes('cachorro') ||
            mensagem.includes('cao') ||
            mensagem.includes('caes')
        ) {

            adicionarMensagem(
                'Encontrei algumas opções para cães! 🐶 Você procura para qual porte?',
                'bot'
            );

            return;
        }


        // -----------------------------------------------------
        // GATO
        // -----------------------------------------------------

        if (
            mensagem.includes('gato') ||
            mensagem.includes('gata') ||
            mensagem.includes('gatos')
        ) {

            adicionarMensagem(
                'Tenho ótimas opções para gatos! 🐱 Você procura uma ração seca ou úmida?',
                'bot'
            );

            return;
        }


        // -----------------------------------------------------
        // RAÇÃO SECA
        // -----------------------------------------------------

        if (mensagem.includes('seca')) {

            mostrarRecomendacoes();

            return;
        }


        // -----------------------------------------------------
        // PETISCO
        // -----------------------------------------------------

        if (mensagem.includes('petisco')) {

            adicionarMensagem(
                'Temos diversos petiscos para cães e gatos! 🐾 Posso recomendar algumas opções de acordo com o porte e a idade do seu pet.',
                'bot'
            );

            return;
        }


        // -----------------------------------------------------
        // SUPLEMENTO
        // -----------------------------------------------------

        if (mensagem.includes('suplemento')) {

            adicionarMensagem(
                'Temos suplementos para diferentes necessidades dos pets. 🐾 Posso ajudar a encontrar uma opção adequada.',
                'bot'
            );

            return;
        }


        // -----------------------------------------------------
        // RESPOSTA PADRÃO
        // -----------------------------------------------------

        adicionarMensagem(
            'Posso ajudar a encontrar rações, petiscos e suplementos. 🐾 Me conte um pouco mais sobre o que você procura!',
            'bot'
        );

    }


    // =========================================================
    // MOSTRAR RECOMENDAÇÕES
    // =========================================================

    function mostrarRecomendacoes() {

        if (!mensagens) {
            return;
        }

        const mensagem = document.createElement('div');

        mensagem.classList.add(
            'mensagem',
            'mensagem-bot'
        );

        mensagem.innerHTML = `
            <p>
                Encontrei algumas opções para você! 🐾
            </p>

            <div class="recomendacoes-chatbot">

                <div class="recomendacao-chatbot">

                    <h4>
                        Ração Cães Adultos
                    </h4>

                    <span>
                        Frango e Carne • 10,1 KG
                    </span>

                    <button
                        type="button"
                        class="btn-recomendacao">
                        Ver produto
                    </button>

                </div>


                <div class="recomendacao-chatbot">

                    <h4>
                        GoldeN Special Gatos
                    </h4>

                    <span>
                        Frango e Carne • 10,1 KG
                    </span>

                    <button
                        type="button"
                        class="btn-recomendacao">
                        Ver produto
                    </button>

                </div>

            </div>
        `;

        mensagens.appendChild(mensagem);

        // Scroll para a última mensagem
        mensagens.scrollTop = mensagens.scrollHeight;

    }

});