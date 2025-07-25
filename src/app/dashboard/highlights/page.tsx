"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareQuote } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Log {
    date: string;
    highlight: string;
}

const HighlightCard = ({ log }: { log: Log }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4">
        <div className="bg-gray-100 text-black font-bold rounded-md h-12 w-12 flex flex-col items-center justify-center text-center leading-none flex-shrink-0">
            <span className="text-xs uppercase">{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-xl">{new Date(log.date + 'T00:00:00').getDate()}</span>
        </div>
        <div>
            <p className="text-gray-700 italic">"{log.highlight}"</p>
        </div>
    </div>
);

const MonthlyHighlightsPage = () => {
    
    const [selectedMonth, setSelectedMonth] = useState('2025-07');
    const [highlights, setHighlights] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
    };

    const fetchHighlights = async () => {
        
        setLoading(true);
        const toastId = toast.loading(`Fetching highlights for ${selectedMonth}...`);
            
        try {
            
            const response = await axios.get(`/api/v1/dashboard/highlights?month=${selectedMonth}`);
            console.log("Dashboard Highlights Status: ", response);
			
			setHighlights(response.data.highlights);
                
            toast.success("Highlights fetched!", { id: toastId });
        } catch (error) {
                
                console.error("Failed to fetch highlights:", error);
                toast.error("Could not fetch highlights.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        
        fetchHighlights();
    }, [selectedMonth]);

    const displayDate = new Date(selectedMonth + '-02').toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-gray-100 text-black p-4 sm:p-6 lg:p-8 font-sans">
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

                {/* Section: Highlights List */}
                <section>
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500">Loading highlights...</p>
                        </div>
                    ) : highlights && highlights.length > 0 ? (
                        <div className="space-y-4">
                            {highlights.map(log => (
                                <HighlightCard key={log.date} log={log} />
                            ))}
                        </div>
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

export default MonthlyHighlightsPage;