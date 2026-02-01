// frontend/src/components/Dashboard/ActivityChart.tsx
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
} from 'chart.js';
import { DailyStats } from '../../types';
import { format, parseISO } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface ActivityChartProps {
    data: DailyStats[];
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
    const chartData = {
        labels: data.map(d => format(parseISO(d.date), 'dd')),
        datasets: [
            {
                label: 'Efficiency',
                data: data.map(d => d.completionRate),
                borderColor: '#4F46E5', // Indigo 600
                borderWidth: 5,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#4F46E5',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 4,
                fill: true,
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)'); // Visible indigo tint
                    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)'); // Fade to transparent
                    return gradient;
                },
                tension: 0.4, // Smooth curve
            }
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: '#312E81',
                titleFont: { size: 10, weight: 'bold' },
                bodyFont: { size: 12, weight: '900' },
                padding: 16,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `${context.parsed.y}% Efficiency`
                }
            },
        },
        scales: {
            x: {
                display: true,
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#94A3B8',
                    font: { size: 10, weight: 'bold' },
                    maxRotation: 0,
                    autoSkip: true,
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 25,
                    color: '#94A3B8',
                    font: { size: 10, weight: 'bold' },
                    callback: (value: any) => `${value}%`
                },
                grid: {
                    display: true,
                    color: '#F1F5F9',
                    borderDash: [5, 5],
                    drawTicks: false,
                    drawBorder: false,
                },
                border: { display: false }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="w-full h-full p-2">
            <Line data={chartData} options={options} />
        </div>
    );
};
