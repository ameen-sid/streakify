"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Zap, TrendingUp, Target, BarChart } from "lucide-react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import toast from "react-hot-toast";
import { getDashboardData } from "@/services/dashboard.service";
import { generateText } from "@/utils/generateText";
import TaskBreakdownChart from "@/components/pages/dashboard/task-breakdown-chart";
import StatsCard from "@/components/pages/dashboard/stats-card";
import AppLayout from "@/components/common/app-layout";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

type MonthlyStats = {
    completionRate: string;
    longestStreak: string;
    mostConsistentTask: string;
};

type TaskBreakdown = {
    labels: string[];
    data: number[];
};

type DashboardData = {
    monthlyStats: MonthlyStats;
    taskBreakdown: TaskBreakdown;
};

const DashboardContent = () => {
   
    const [aiInsight, setAiInsight] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("2025-07");
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
       
            setLoading(true);
            setDashboardData(null);
            setAiInsight("");
            try {
       
                const data = await getDashboardData(selectedMonth);
       
                if (Object.keys(data).length === 0) {
                    setDashboardData(null);
                } else {
                    setDashboardData(data);

                    const { monthlyStats } = data;
                    const prompt = `Based on the following user performance for the month - Completion Rate: ${monthlyStats.completionRate}, Longest Streak: ${monthlyStats.longestStreak}, Most Consistent Task: '${monthlyStats.mostConsistentTask}' - write a short, encouraging, and actionable insight as an AI Coach.`;

                    await generateText(prompt)
                    .then(generatedText => {
                        
                        setAiInsight(generatedText);
                    }).catch(err => {
                        
                        console.error("AI Insight Generation Failed:", err);
                        setAiInsight("Could not generate an insight at this time."); // Fallback message
                    });

                }
            } catch (error) {
                
                if (error instanceof Error) {
                    
				    console.error("Data Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    console.error("Data Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedMonth]);

    const displayDate = new Date(selectedMonth + "-02").toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto">
                
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Monthly Summary</h1>
                        <p className="text-gray-600 mt-1">{displayDate}</p>
                    </div>
                    <div>
                        <label htmlFor="month-select" className="sr-only">Select Month</label>
                        <input type="month" id="month-select" value={selectedMonth} onChange={handleMonthChange} className="bg-white border-2 border-gray-200 rounded-lg py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-black" />
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20"><p className="text-gray-500">Loading data...</p></div>
                ) : dashboardData ? (
                    <>
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-black mb-4">Monthly Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsCard icon={<Target className="h-6 w-6 text-black" />} title="Completion Rate" value={dashboardData.monthlyStats.completionRate} />
                                <StatsCard icon={<TrendingUp className="h-6 w-6 text-black" />} title="Longest Streak" value={dashboardData.monthlyStats.longestStreak} />
                                <StatsCard icon={<Zap className="h-6 w-6 text-black" />} title="Most Consistent" value={dashboardData.monthlyStats.mostConsistentTask} />
                            </div>
                        </section>
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl font-semibold text-black mb-4">Task Breakdown</h2>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 h-96">
                                    <TaskBreakdownChart labels={dashboardData.taskBreakdown.labels} data={dashboardData.taskBreakdown.data} />
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
                                                {aiInsight ? (
                                                    <span className="italic">"{aiInsight}"</span>
                                                ) : (
                                                    <span>Generating insight...</span>
                                                )}
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

const FullDashboardPage = () => {
    return (
        <AppLayout>
            <DashboardContent />
        </AppLayout>
    );
};

export default FullDashboardPage;