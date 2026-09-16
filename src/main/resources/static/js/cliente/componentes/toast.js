const toast = document.getElementById('toast');

if (toast) {
    toast.classList.add('ativo');

    setTimeout(() => {
        toast.classList.remove('ativo');
    }, 6000);
}