import './Chart.css';

import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartDataLabels.beforeRender = chart => {
    const { ctx } = chart
    ctx.save()
    ctx.globalCompositeOperation = 'hard-light'
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, ChartDataLabels);


function Chart(props) {
    const { ChartProps } = props;

    return (
        <PolarArea options={{
            animation: false,
            scales: {
                r: {
                    suggestedMin: 1, // Set your minimum scale value
                    suggestedMax: 10, // Set your maximum scale value
                    ticks: {
                        stepSize: 1,
                        display: false,
                    },
                    grid: {
                        color: 'white',
                        lineWidth: 2,
                    },
                    angleLines: {
                        color: 'white',
                        lineWidth: 2,
                        display: true,
                    },
                },
            },
            plugins: {
                tooltip: {
                    enabled: false,
                },
                legend: {
                    display: false,
                },
                datalabels: {
                    color: '#1F1F1F',
                    // rotation: 18,
                    clamp: true,
                    font: {
                        weight: 600,
                        size: 16,
                    },
                },
            },
        }}
            data={{
                labels: ChartProps.labels,
                datasets: [
                    {
                        // label: '# of Votes',
                        data: ChartProps.data,
                        backgroundColor: [
                            '#BD93E6',
                            '#D3ACE3',
                            '#F2A6D6',
                            '#FF8F8F',
                            '#F29E6F',
                            '#FFD170',
                            '#DCCD6A',
                            '#9FC65F',
                            '#95C5D3',
                            '#99B2FE',
                        ],
                        borderWidth: 1,
                    },
                ],
            }}
        />
    )
}

export default Chart;