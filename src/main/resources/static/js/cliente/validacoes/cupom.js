const checkboxesCupom = document.querySelectorAll('.checkbox-cupom');
const toastAtencao = document.getElementById('toastAtencao');
const cuponsSelecionados = document.getElementById('cuponsSelecionados');

checkboxesCupom.forEach(checkbox => {
    checkbox.addEventListener('change', function () {

        const promocionaisSelecionados = document.querySelectorAll(
            '.modalCupom[data-tipo="Promocional"] .checkbox-cupom:checked'
        );

        if (promocionaisSelecionados.length > 1) {
            this.checked = false;
            return;
        }

        const selecionados = document.querySelectorAll('.checkbox-cupom:checked');

        const subtotal = pegarValor(document.getElementById('subtotal').textContent);
        const frete = pegarValor(document.getElementById('frete').textContent);
        const valorCompra = subtotal + frete;

        let valorCupons = 0;

        selecionados.forEach(checkbox => {
            const cupom = checkbox.closest('.modalCupom');
            valorCupons += parseFloat(cupom.dataset.valor) || 0;
        });

        // Não permite adicionar outro cupom depois que a compra já foi coberta
        if (this.checked && selecionados.length > 1 && valorCupons >= valorCompra) {

            const outrosCupons = Array.from(selecionados).filter(
                item => item !== this
            );

            let valorOutros = 0;

            outrosCupons.forEach(checkbox => {
                const cupom = checkbox.closest('.modalCupom');
                valorOutros += parseFloat(cupom.dataset.valor) || 0;
            });

            if (valorOutros >= valorCompra) {
                this.checked = false;

                toastAtencao.querySelector('p').textContent =
                    'A compra já pode ser paga com os cupons selecionados.';

                toastAtencao.classList.add('ativo');

                setTimeout(() => {
                    toastAtencao.classList.remove('ativo');
                }, 6000);

                return;
            }
        }

        cuponsSelecionados.innerHTML = '';

        const cuponsAtuais = document.querySelectorAll('.checkbox-cupom:checked');

        cuponsAtuais.forEach(checkbox => {
            const modalCupom = checkbox.closest('.modalCupom');
            const codigo = modalCupom.dataset.codigo;
            const valor = modalCupom.dataset.valor;
            const cupom = document.createElement('div');

            cupom.textContent = codigo + ' - ' + parseFloat(valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            cuponsSelecionados.appendChild(cupom);
        });

        cuponsSelecionados.hidden = cuponsAtuais.length === 0;

        atualizarTotal();
    });
});

const campoCupom = document.getElementById('campoCupom');

campoCupom.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter') {
        return;
    }

    event.preventDefault();

    const codigo = campoCupom.value.trim();
    const cupons = document.querySelectorAll('.modalCupom');

    for (let i = 0; i < cupons.length; i++) {

        if (cupons[i].dataset.codigo === codigo) {

            const checkbox = cupons[i].querySelector('.checkbox-cupom');

            if (checkbox.checked) {
                toastAtencao.querySelector('p').textContent = 'Este cupom já foi selecionado.';
                toastAtencao.classList.add('ativo');

                setTimeout(() => {
                    toastAtencao.classList.remove('ativo');
                }, 6000);

                return;
            }

            checkbox.checked = true;
            campoCupom.value = '';
            checkbox.dispatchEvent(new Event('change'));

            return;
        }
    }

    toastAtencao.querySelector('p').textContent = 'Cupom não encontrado.';
    toastAtencao.classList.add('ativo');

    setTimeout(() => {
        toastAtencao.classList.remove('ativo');
    }, 6000);
});
