"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Zap, TrendingUp, Target, BarChart } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	ChartOptions,
} from "chart.js";
import toast from "react-hot-toast";
import axios from "axios";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

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

interface StatsCardProps {
	icon: ReactNode;
	title: string;
	value: string | number;
}

const StatsCard = ({ icon, title, value }: StatsCardProps) => (
	<div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-4">
		<div className="bg-gray-100 p-3 rounded-full">{icon}</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-2xl font-bold text-black">{value}</p>
		</div>
	</div>
);

// Define a more specific type for our dashboard data
type DashboardData = {
 	monthlyStats: {
      	completionRate: string;
      	longestStreak: string;
      	mostConsistentTask: string;
  	};
  	taskBreakdown: {
      	labels: string[];
      	data: number[];
  	};
};

const DashboardPage = () => {

	const [selectedMonth, setSelectedMonth] = useState("2025-07");
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedMonth(e.target.value);
	};

	const fetchDashboardData = async () => {

		setLoading(true);
        setDashboardData(null); // Clear previous data
        const toastId = toast.loading(`Fetching data for ${selectedMonth}...`);
		try {
			const response = await axios.get(`/api/v1/dashboard?month=${selectedMonth}`);
			console.log("Dashboard Data Status: ", response);

			// Check if the returned data object is empty
            if (Object.keys(response.data.data).length === 0)	setDashboardData(null);
			else	setDashboardData(response.data.data);

			toast.success("Data Fetched Successfully", { id: toastId });
		} catch (error: unknown) {
			
            setDashboardData(null); // Ensure no data is shown on error
            if (axios.isAxiosError(error)) {
                
				console.error("Dashboard Data Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch data", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Dashboard Data Fetch Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Dashboard Data Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {        
			setLoading(false);
        }
	};

	useEffect(() => {
		// e.g., fetchDashboardData(selectedMonth);
		fetchDashboardData();
	}, [selectedMonth]);

	const displayDate = new Date(selectedMonth + "-02").toLocaleDateString(
		"en-US",
		{
			month: "long",
			year: "numeric",
		}
	);

	return (
        <div className="min-h-screen bg-gray-100 text-black p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                
				<header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Monthly Summary</h1>
                        <p className="text-gray-600 mt-1">{displayDate}</p>
                    </div>
                    <div>
                        <label htmlFor="month-select" className="sr-only">Select Month</label>
                        <input
                            type="month"
                            id="month-select"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="bg-white border-2 border-gray-200 rounded-lg py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Loading data...</p>
                    </div>
                ) : dashboardData ? (
                    <>
                        {/* Section 1: Monthly Stats */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-black mb-4">Monthly Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsCard
                                    icon={<Target className="h-6 w-6 text-black" />}
                                    title="Completion Rate"
                                    value={dashboardData.monthlyStats.completionRate}
                                />
                                <StatsCard
                                    icon={<TrendingUp className="h-6 w-6 text-black" />}
                                    title="Longest Streak"
                                    value={dashboardData.monthlyStats.longestStreak}
                                />
                                <StatsCard
                                    icon={<Zap className="h-6 w-6 text-black" />}
                                    title="Most Consistent"
                                    value={
                                        dashboardData.monthlyStats.mostConsistentTask
                                    }
                                />
                            </div>
                        </section>

                        {/* Section 2: Task Breakdown & AI Coach */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl font-semibold text-black mb-4">Task Breakdown</h2>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 h-96">
                                    <TaskBreakdownChart
                                        labels={dashboardData.taskBreakdown.labels}
                                        data={dashboardData.taskBreakdown.data}
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-black mb-4">AI Coach Summary</h2>
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Zap className="h-6 w-6 text-black" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-black">This Month's Insight</p>
                                            <p className="mt-2 text-gray-600">
                                                You've shown incredible consistency in
                                                'Development' and 'Sleep'—great job
                                                prioritizing core habits! To take it to
                                                the next level, try focusing a bit more
                                                on 'DSA' on your less busy days. Keep up
                                                the momentum!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                        <BarChart className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-xl font-semibold text-black">No Data Found</h3>
                        <p className="mt-2 text-gray-500">There is no activity recorded for this month.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DashboardPage;
