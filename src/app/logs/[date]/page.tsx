"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { getLogByDate } from "@/services/dailylog.service";
import PastTaskItem from "@/components/pages/pastlogs/past-logs-item";
import AppLayout from "@/components/common/app-layout";

type Task = {
    _id: string;
    name: string;
    description: string;
    priority: number;
};

export type TaskState = {
    _id: string;
    task: Task;
    isCompleted: boolean;
};

type DailyLog = {
    _id: string;
    date: string;
    taskState: TaskState[];
    highlight: string;
};

const PastLogsContent = () => {

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [logData, setLogData] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLogForDate = async (date: string) => {
            
            setLoading(true);
            setLogData(null);
            const toastId = toast.loading(`Fetching log for ${date}...`);
            try {
            
                const data = await getLogByDate(date);
            
                if (data) {
                    data.taskState.sort((a,b) => a.task.priority - b.task.priority);
                    setLogData(data);
                } else {
                    setLogData(null);
                }
                toast.success("Log fetched!", { id: toastId });
            } catch (error) {
                
                if (error instanceof Error) {
                    
				    console.error("Log Fetch Failed: ", error.message);
                    toast.error(error.message, { id: toastId });
                } else {
                    
				    console.error("Log Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred", { id: toastId });
                }
            } finally {
                setLoading(false);
            }
        };

        if (selectedDate) {
            fetchLogForDate(selectedDate);
        }
    }, [selectedDate]);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto">
               
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Past Logs</h1>
                        <p className="mt-1 text-gray-600">Review your progress from previous days.</p>
                    </div>
                    <div className="relative">
                        <label htmlFor="log-date" className="sr-only">Select a Date</label>
                        <input
                            type="date"
                            id="log-date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="bg-white border-2 border-gray-200 rounded-lg py-2 pl-3 pr-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </header>

                <main>
                    {loading ? (
                        <div className="text-center py-16"><p>Loading log...</p></div>
                    ) : logData ? (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-black mb-4">Tasks for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
                                <div className="space-y-4">
                                    {logData.taskState.map(ts => (
                                        <PastTaskItem key={ts._id} taskState={ts} />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-black">Highlight of the Day</h2>
                                {logData.highlight ? (
                                    <p className="mt-2 text-gray-700 italic">&quot;{logData.highlight}&quot;</p>
                                ) : (
                                    <p className="mt-2 text-gray-500">No highlight was saved for this day.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200">
                            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-black">No Log Found</h3>
                            <p className="mt-2 text-gray-500">There is no saved log for the selected date.</p>
                        </div>
                    )}
                </main>
                
            </div>
        </div>
    );
};

const FullPastLogsPage = () => {
    return (
        <AppLayout>
            <PastLogsContent />
        </AppLayout>
    );
};

export default FullPastLogsPage;