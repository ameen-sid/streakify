import axios from "axios";
import { DAILYLOG_ROUTES, HEADERS } from "@/constant";

// --- GET DAILY LOG ---
type Task = { 
	_id: string; 
	name: string; 
	description: string; 
	priority: number; 
};

type TaskState = { 
	_id: string; 
	task: Task; 
	isCompleted: boolean; 
};

type DailyLog = { 
	day: {
		_id: string;
		date: string;
		taskState: [ TaskState ],
		highlight: string;
	},
	discipline: {
		_id: string;
		name: string;
		currentStreak: number;
		longestStreak: number;
	}
};

export const getDailyLog = async (): Promise<DailyLog> => {
   
	const response = await axios.get(
		DAILYLOG_ROUTES.GET_TODAY,
		{ headers: HEADERS }
	);
    return response.data.data;
};

// --- SAVE HIGHLIGHT ---
export const saveHighlight = async (highlight: string) => {
  
	const response = await axios.post(
		DAILYLOG_ROUTES.SAVE_HIGHLIGHT, 
		{ highlight },
		{ headers: HEADERS }
	);
    return response.data;
};

// --- UPDATE TASK STATUS ---
export const updateTaskStatus = async (taskId: string) => {
    
	const response = await axios.patch(
		DAILYLOG_ROUTES.UPDATE_TASK(taskId),
		{ headers: HEADERS }
	);
    return response.data;
};

// --- GET LOGS BY DATE ---
type PastLog = { 
	_id: string; 
	date: string; 
	taskState: TaskState[]; 
	highlight: string; 
};

export const getLogByDate = async (date: string): Promise<PastLog | null> => {
  
	const response = await axios.get(
		DAILYLOG_ROUTES.GET_BY_DATE(date),
		{ headers: HEADERS }
	);
    return response.data.data;
};