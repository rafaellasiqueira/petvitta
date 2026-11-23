
const toast = document.getElementById('toast');

let tempoToast;

// Exibe o toast
function mostrarToast(tipo, texto) {

    if (!toast) {
        return;
    }

    const icone = toast.querySelector('i');
    const mensagem = toast.querySelector('p');

    clearTimeout(tempoToast);

    mensagem.textContent = texto;

    if (tipo === 'erro') {
        icone.className = 'fa-solid fa-circle-xmark';
    } else {
        icone.className = 'fa-solid fa-check';
    }

    toast.classList.add('ativo');

    tempoToast = setTimeout(() => {
        toast.classList.remove('ativo');
    }, 6000);
}

// Exibe o toast enviado pelo Controller através do Thymeleaf
if (toast && toast.textContent.trim()) {

    toast.classList.add('ativo');

    tempoToast = setTimeout(() => {
        toast.classList.remove('ativo');
    }, 6000);

}
