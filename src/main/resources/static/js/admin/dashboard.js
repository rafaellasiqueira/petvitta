document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graficoVendas');

    const listaCategorias = categorias || [];

    let grafico = null;

    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    function gerarMeses(inicio, fim) {
        const meses = [];
        const dataAtual = new Date(inicio + 'T12:00:00');
        const dataFinal = new Date(fim + 'T12:00:00');

        const nomesMeses = [
            'Jan', 'Fev', 'Mar', 'Abr',
            'Mai', 'Jun', 'Jul', 'Ago',
            'Set', 'Out', 'Nov', 'Dez'
        ];

        while (dataAtual <= dataFinal) {
            meses.push([
                nomesMeses[dataAtual.getMonth()],
                dataAtual.getFullYear().toString()
            ]);

            dataAtual.setMonth(dataAtual.getMonth() + 1);
        }

        return meses;
    }

    function criarGrafico() {
        if (grafico) {
            grafico.destroy();
        }

        const meses = gerarMeses(dataInicio, dataFim);

        grafico = new Chart(canvas, {
            type: 'line',
            data: {
                labels: meses,
                datasets: listaCategorias.map(categoria => ({
                    label: categoria,
                    data: dadosVendas[categoria] || [],
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: valor =>
                                Number(valor).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })
                        }
                    }
                }
            }
        });
    }

    criarGrafico();
});
