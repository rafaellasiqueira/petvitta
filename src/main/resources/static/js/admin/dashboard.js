document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // ELEMENTOS
    // =========================================================

    const canvas = document.getElementById('graficoVendas');

    const filtroPetiscos = document.getElementById('filtroPetiscos');
    const filtroRacoes = document.getElementById('filtroRacoes');
    const filtroSuplementos = document.getElementById('filtroSuplementos');

    const dataInicio = document.getElementById('dataInicio');
    const dataFim = document.getElementById('dataFim');

    const btnAplicar = document.getElementById('btnAplicar');
    const btnExportar = document.getElementById('btnExportar');

    const mensagemErro = document.getElementById('mensagemErro');

    let grafico = null;


    // =========================================================
    // DADOS DE EXEMPLO
    // =========================================================
    //
    // Depois você poderá substituir esses dados pelo retorno
    // do Spring Boot.
    //
    // =========================================================

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


    // =========================================================
    // MESES
    // =========================================================

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


    // =========================================================
    // FORMATAÇÃO DE MOEDA
    // =========================================================

    function formatarMoeda(valor) {

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);

    }


    // =========================================================
    // MENSAGEM DE ERRO
    // =========================================================

    function mostrarErro(mensagem) {

        mensagemErro.textContent = mensagem;
        mensagemErro.hidden = false;

    }


    function esconderErro() {

        mensagemErro.textContent = '';
        mensagemErro.hidden = true;

    }


    // =========================================================
    // VALIDAÇÃO DAS DATAS
    // =========================================================

    function validarDatas() {

        esconderErro();

        if (!dataInicio.value || !dataFim.value) {

            mostrarErro(
                'Informe a data de início e a data de fim.'
            );

            return false;
        }


        const inicio = new Date(dataInicio.value + 'T00:00:00');
        const fim = new Date(dataFim.value + 'T00:00:00');


        // Data final não pode ser menor
        if (fim < inicio) {

            mostrarErro(
                'A data de fim não pode ser anterior à data de início.'
            );

            return false;
        }


        // Calcula diferença aproximada em meses
        const mesesDiferenca =
            (fim.getFullYear() - inicio.getFullYear()) * 12 +
            (fim.getMonth() - inicio.getMonth());


        // Mínimo de 1 mês
        if (mesesDiferenca < 1) {

            mostrarErro(
                'O período de análise deve possuir no mínimo 1 mês.'
            );

            return false;
        }


        // Máximo de 24 meses
        if (mesesDiferenca > 24) {

            mostrarErro(
                'O período de análise pode possuir no máximo 24 meses.'
            );

            return false;
        }


        return true;
    }


    // =========================================================
    // VERIFICA CATEGORIAS
    // =========================================================

    function obterCategoriasSelecionadas() {

        const categorias = [];

        if (filtroPetiscos.checked) {
            categorias.push('petiscos');
        }

        if (filtroRacoes.checked) {
            categorias.push('racoes');
        }

        if (filtroSuplementos.checked) {
            categorias.push('suplementos');
        }

        return categorias;
    }


    // =========================================================
    // CRIA DATASET
    // =========================================================

    function criarDataset(categoria) {

        const configuracao = dadosVendas[categoria];

        return {

            label: configuracao.nome,

            data: configuracao.valores,

            borderWidth: 2,

            tension: 0.3,

            fill: false,

            pointRadius: 4,

            pointHoverRadius: 6

        };

    }


    // =========================================================
    // CRIAR GRÁFICO
    // =========================================================

    function criarGrafico() {

        const categorias = obterCategoriasSelecionadas();


        if (categorias.length === 0) {

            mostrarErro(
                'Selecione pelo menos uma categoria para exibir no gráfico.'
            );

            if (grafico) {
                grafico.destroy();
                grafico = null;
            }

            return;
        }


        esconderErro();


        // Se já existir gráfico, destrói antes de criar outro
        if (grafico) {
            grafico.destroy();
        }


        const datasets = categorias.map(categoria => {
            return criarDataset(categoria);
        });


        grafico = new Chart(canvas, {

            type: 'line',

            data: {

                labels: meses,

                datasets: datasets

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

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
                            }

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


    // =========================================================
    // EXPORTAR CSV
    // =========================================================

    function exportarCSV() {

        const categorias = obterCategoriasSelecionadas();


        if (categorias.length === 0) {

            mostrarErro(
                'Selecione pelo menos uma categoria para exportar.'
            );

            return;
        }


        let csv = 'Período;Categoria;Valor de venda\n';


        meses.forEach((mes, indice) => {

            categorias.forEach(categoria => {

                const dados = dadosVendas[categoria];

                const valor = dados.valores[indice] ?? 0;

                csv +=
                    `${mes};${dados.nome};${valor.toFixed(2).replace('.', ',')}\n`;

            });

        });


        const blob = new Blob(
            ['\ufeff' + csv],
            {
                type: 'text/csv;charset=utf-8;'
            }
        );


        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = 'historico-vendas.csv';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }


    // =========================================================
    // EVENTOS
    // =========================================================

    btnAplicar.addEventListener('click', () => {

        if (!validarDatas()) {
            return;
        }

        criarGrafico();

    });


    btnExportar.addEventListener('click', () => {

        exportarCSV();

    });


    filtroPetiscos.addEventListener('change', () => {

        criarGrafico();

    });


    filtroRacoes.addEventListener('change', () => {

        criarGrafico();

    });


    filtroSuplementos.addEventListener('change', () => {

        criarGrafico();

    });


    // =========================================================
    // DATAS INICIAIS
    // =========================================================

    dataInicio.value = '2026-01-01';

    dataFim.value = '2026-12-31';


    // =========================================================
    // INICIA GRÁFICO
    // =========================================================

    criarGrafico();

});