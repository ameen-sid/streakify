import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

interface TaskBreakdownChartProps {
	labels: string[];
	data: number[];	// Data should be numbers for the chart
}

const TaskBreakdownChart = ({ labels, data }: TaskBreakdownChartProps) => {
	
	const chartData = {
		labels: labels,
		datasets: [
			{
				data: data,
				backgroundColor: [
					"#111827",
					"#1F2937",
					"#374151",
					"#4B5563",
					"#6B7280",
					"#9CA3AF",
					"#D1D5DB",
				],
				borderColor: "#ffffff", // white
				borderWidth: 2,
			},
		],
	};

	const chartOptions: ChartOptions<"doughnut"> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: {
					color: "#1F2937", // gray-800
					boxWidth: 20,
				},
			},
		},
	};

	return <Doughnut data={chartData} options={chartOptions} />;
};

export default TaskBreakdownChart;