import axios from "axios";
import { TASK_ROUTES } from "@/constant";

// --- GET TASKS ---
export type Task = {
    _id: string;
    name: string;
    description: string;
    priority: number;
};

export type DisciplineInfo = {
    _id: string;
    name: string;
};

export const getTasksForDiscipline = async (disciplineId: string): Promise<{ tasks: Task[], discipline: DisciplineInfo }> => {
    
	const response = await axios.get(TASK_ROUTES.GET_BY_DISCIPLINE(disciplineId));
    return response.data.data;
};

// --- DELETE TASK ---
export const deleteTask = async (taskId: string) => {
  
	const response = await axios.delete(TASK_ROUTES.DELETE(taskId));
    return response.data;
};

// --- CREATE TASK ---
export type TaskData = {
    name: string;
    description: string;
    priority: number;
};

export const createTask = async (disciplineId: string, data: TaskData) => {
  
	const response = await axios.post(TASK_ROUTES.CREATE(disciplineId), data);
    return response.data;
};

// --- GET TASK BY ID ---
// export type TaskData = {
//     name: string;
//     description: string;
//     priority: number;
// };

export const getTaskById = async (taskId: string): Promise<TaskData> => {
  
	const response = await axios.get(TASK_ROUTES.GET_BY_ID(taskId));
    return response.data.data;
};

// --- UPDATE TASK ---
export const updateTask = async (taskId: string, data: TaskData) => {
  
	const response = await axios.patch(TASK_ROUTES.UPDATE(taskId), data);
    return response.data;
};