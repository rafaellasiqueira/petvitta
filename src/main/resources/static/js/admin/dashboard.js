document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graficoVendas');

    const listaCategorias = categorias || [];

    let grafico = null;

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function criarGrafico() {
        if (grafico) {
            grafico.destroy();
        }

        grafico = new Chart(canvas, {
            type: 'line',
            data: {
                labels: meses,
                datasets: categorias.map(categoria => ({
                    label: categoria,
                    data: dadosVendas[categoria],
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
                        position: 'top'
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
