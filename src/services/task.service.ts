import axios from "axios";
import { HEADERS, TASK_ROUTES } from "@/constant";

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

	const response = await axios.get(
        TASK_ROUTES.GET_BY_DISCIPLINE(disciplineId),
        { headers: HEADERS }
    );
    return response.data.data;
};

// --- CREATE TASK ---
export type TaskData = {
    name: string;
    description: string;
    priority: number;
};

export const createTask = async (disciplineId: string, data: TaskData) => {

	const response = await axios.post(
        TASK_ROUTES.CREATE(disciplineId), 
        data,
        { headers: HEADERS }
    );
    return response.data;
};

// --- GET TASK BY ID ---
export const getTaskById = async (taskId: string): Promise<Task> => {

	const response = await axios.get(
        TASK_ROUTES.GET_BY_ID(taskId),
        { headers: HEADERS }
    );
    return response.data.data;
};

// --- UPDATE TASK ---
export const updateTask = async (taskId: string, data: TaskData) => {

	const response = await axios.patch(
        TASK_ROUTES.UPDATE(taskId), 
        data,
        { headers: HEADERS }
    );
    return response.data;
};

// --- DELETE TASK ---
export const deleteTask = async (taskId: string) => {

	const response = await axios.delete(TASK_ROUTES.DELETE(taskId));
    return response.data;
};