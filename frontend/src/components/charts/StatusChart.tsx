import { ChartOptions } from "chart.js";
import "chart.js/auto";
import React from "react";
import { Bar } from "react-chartjs-2";
import { StatusData } from "../../types";

interface StatusChartProps {
    data: StatusData;
    options?: ChartOptions<"bar">;
}

const StatusChart: React.FC<StatusChartProps> = ({ data, options }) => {
    const defaultOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: '#333',
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#f5f5f5',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.parsed.y || 0;
                        return `${label}: ${value.toLocaleString()} Trials`;
                    },
                },
            },
            title: {
                display: true,
                text: "Number of Trials by Status",
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Trials" },
                ticks: {
                    callback: (value) => value.toLocaleString(),
                },
            },
            x: {
                title: { display: true, text: "Trial Status" },
                ticks: {
                    color: '#333',
                    font: {
                        size: 12,
                    },
                },
            },
        },
        interaction: { mode: "index", intersect: false },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return <Bar data={data} options={mergedOptions} redraw datasetIdKey="statusBar" />;
};

export default StatusChart;