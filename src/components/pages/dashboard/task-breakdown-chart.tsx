import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

const TaskBreakdownChart = ({ labels, data }: { labels: string[], data: number[] }) => {
	const chartData = {
		labels,
		datasets: [{ data, backgroundColor: ["#111827", "#1F2937", "#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"], borderColor: "#ffffff", borderWidth: 2 }],
	};
	const chartOptions: ChartOptions<"doughnut"> = {
		responsive: true, maintainAspectRatio: false,
		plugins: { legend: { position: "right", labels: { color: "#1F2937", boxWidth: 20 } } },
	};
	return <Doughnut data={chartData} options={chartOptions} />;
};

export default TaskBreakdownChart;