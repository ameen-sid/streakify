"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { MessageSquareQuote } from "lucide-react";
import toast from "react-hot-toast";
import { getHighlightsForMonth } from "@/services/dashboard.service";
import AppLayout from "@/components/common/app-layout";
import HighlightCard from "@/components/pages/dashboard-highlights/highlight-card";
import { AxiosError } from "axios";

export type HighlightLog = {
    date: string;
    highlight: string;
};

const MonthlyHighlightsContent = () => {

    const [selectedMonth, setSelectedMonth] = useState(() => {
    
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    });
    const [highlights, setHighlights] = useState<HighlightLog[]>([]);
    const [loading, setLoading] = useState(true);

    const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
    };

    useEffect(() => {
        const fetchHighlights = async () => {
           
            setLoading(true);
            try {
           
                const data = await getHighlightsForMonth(selectedMonth);
           
                setHighlights(data);
            } catch (error) {
                
                if(error instanceof AxiosError) {

                    // console.error("Highlights Fetch Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                }
                else if (error instanceof Error) {
                    
				    // console.error("Highlights Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    // console.error("Highlights Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHighlights();
    }, [selectedMonth]);

    const displayDate = new Date(selectedMonth + '-02').toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Monthly Highlights</h1>
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

                <section>
                    {loading ? (
                        <div className="text-center py-16"><p className="text-gray-500">Loading highlights...</p></div>
                    ) : highlights?.length > 0 ? (
                        <div className="space-y-4">{highlights.map(log => (<HighlightCard key={log.date} log={log} />))}</div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200">
                            <MessageSquareQuote className="h-12 w-12 mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-black">No Highlights Found</h3>
                            <p className="mt-2 text-gray-500">There are no saved highlights for the selected month.</p>
                        </div>
                    )}
                </section>
                
            </div>
        </div>
    );
};

const FullMonthlyHighlightsPage = () => {
    return (
        <AppLayout>
            <MonthlyHighlightsContent />
        </AppLayout>
    );
};

export default FullMonthlyHighlightsPage;