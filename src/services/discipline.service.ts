import axios from "axios";
import { DISCIPLINE_ROUTES } from "@/constant";

// --- GET DISCIPLINES ---
export type Discipline = {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Completed' | 'Failed';
};

export const getDisciplines = async (): Promise<Discipline[]> => {

	const response = await axios.get(DISCIPLINE_ROUTES.GET_ALL);
	return response.data.data;
};

// --- DELETE DISCIPLINE ---
export const deleteDiscipline = async (id: string) => {

	const response = await axios.delete(DISCIPLINE_ROUTES.DELETE(id));
	return response.data;
};

// --- CREATE DISCIPLINE ---
type DisciplineData = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
};

export const createDiscipline = async (data: DisciplineData) => {

    const response = await axios.post(DISCIPLINE_ROUTES.CREATE, data);
    return response.data;
};

// --- GET DISCIPLINE BY ID ---
// type DisciplineData = {
//     name: string;
//     description: string;
//     startDate: string;
//     endDate: string;
// };

export const getDisciplineById = async (id: string): Promise<DisciplineData> => {
    
    const response = await axios.get(DISCIPLINE_ROUTES.GET_BY_ID(id));
    return response.data.data;
};

// --- UPDATE DISCIPLINE ---
export const updateDiscipline = async (id: string, data: DisciplineData) => {
   
    const response = await axios.patch(DISCIPLINE_ROUTES.UPDATE(id), data);
    return response.data;
};