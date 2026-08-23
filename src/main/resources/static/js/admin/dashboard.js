document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graficoVendas');
    const dataInicio = document.getElementById('dataInicio');
    const dataFim = document.getElementById('dataFim');
    const btnAplicar = document.getElementById('btnAplicar');
    const mensagemErro = document.getElementById('mensagemErro');
    let grafico = null;

    const dadosVendas = {
        petiscos: {
            nome: 'Petiscos',
            valores: [
                8500,
                10200,
                9800,
                12500,
                14300,
                13700,
                15900,
                17200,
                16500,
                18100,
                19400,
                21000
            ]
        },
        racoes: {
            nome: 'Rações',
            valores: [
                18500,
                20100,
                22400,
                21700,
                24500,
                26300,
                28100,
                29500,
                30200,
                32100,
                34700,
                36500
            ]
        },
        suplementos: {
            nome: 'Suplementos',
            valores: [
                6200,
                7100,
                6800,
                7900,
                8500,
                9200,
                10100,
                9800,
                11200,
                12100,
                13500,
                14800
            ]
        }
    };

    const meses = [
        'Jan/2026',
        'Fev/2026',
        'Mar/2026',
        'Abr/2026',
        'Mai/2026',
        'Jun/2026',
        'Jul/2026',
        'Ago/2026',
        'Set/2026',
        'Out/2026',
        'Nov/2026',
        'Dez/2026'
    ];

    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.hidden = false;
    }

    function esconderErro() {
        mensagemErro.textContent = '';
        mensagemErro.hidden = true;
    }

    function validarDatas() {
        esconderErro();

        const inicio = new Date(dataInicio.value + 'T00:00:00');
        const fim = new Date(dataFim.value + 'T00:00:00');

        if (fim < inicio) {
            mostrarErro(
                'A data de fim não pode ser anterior à data de início.'
            );
            return false;
        }

        const mesesDiferenca =
            (fim.getFullYear() - inicio.getFullYear()) * 12 +
            (fim.getMonth() - inicio.getMonth());

        if (mesesDiferenca < 1) {
            mostrarErro(
                'O período de análise deve possuir no mínimo 1 mês.'
            );
            return false;
        }

        if (mesesDiferenca > 24) {
            mostrarErro(
                'O período de análise pode possuir no máximo 24 meses.'
            );
            return false;
        }

        return true;
    }

    function criarDataset(categoria) {
        const configuracao = dadosVendas[categoria];

        return {
            label: configuracao.nome,
            data: configuracao.valores,
            borderWidth: 2,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6
        };
    }

    function criarGrafico() {
        esconderErro();

        if (grafico) {
            grafico.destroy();
        }

        const datasets = [
            criarDataset('petiscos'),
            criarDataset('racoes'),
            criarDataset('suplementos')
        ];

        grafico = new Chart(canvas, {
            type: 'line',
            data: {
                labels: meses,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, /* Preenche 100% da altura e largura do container */
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Nunito',
                                size: 14
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;

                                return `${context.dataset.label}: ${formatarMoeda(valor)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Período',
                            font: {
                                family: 'Nunito',
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor de vendas',
                            font: {
                                family: 'Nunito',
                                size: 14
                            },
                            padding: 20
                        },
                        ticks: {
                            callback: function(value) {
                                return formatarMoeda(value);
                            },
                            font: {
                                family: 'Nunito'
                            }
                        }
                    }
                }
            }
        });
    }

    btnAplicar.addEventListener('click', () => {
        if (!validarDatas()) {
            return;
        }

        criarGrafico();
    });

    dataInicio.value = '2026-01-01';
    dataFim.value = '2026-12-31';

    criarGrafico();
});