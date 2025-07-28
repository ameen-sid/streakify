import axios from "axios";
import { DASHBOARD_ROUTES } from "@/constant";

// --- GET HIGHLIGHTS FOR MONTH ---
export type HighlightLog = {
    date: string;
    highlight: string;
};

export const getHighlightsForMonth = async (month: string): Promise<HighlightLog[]> => {
    
	const response = await axios.get(DASHBOARD_ROUTES.GET_HIGHLIGHTS(month));
    return response.data.data;
};

// --- GET DASHBOARD DATA FOR MONTH ---
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

export const getDashboardData = async (month: string): Promise<DashboardData> => {
  
    const response = await axios.get(DASHBOARD_ROUTES.GET_SUMMARY(month));
    return response.data.data;
};