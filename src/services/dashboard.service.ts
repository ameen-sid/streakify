import axios from "axios";
import { DASHBOARD_ROUTES, HEADERS } from "@/constant";

// --- GET DASHBOARD DATA ---
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
  
    const response = await axios.get(
        DASHBOARD_ROUTES.GET_SUMMARY(month),
        { headers: HEADERS }
    );
    return response.data.data;
};

// --- GET HIGHLIGHTS ---
export type HighlightLog = {
    date: string;
    highlight: string;
};

export const getHighlightsForMonth = async (month: string): Promise<HighlightLog[]> => {
    
	const response = await axios.get(
        DASHBOARD_ROUTES.GET_HIGHLIGHTS(month),
        { headers: HEADERS }
    );
    return response.data.data.highlights;
};