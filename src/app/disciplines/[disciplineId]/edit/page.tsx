"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { getDisciplineById, updateDiscipline } from "@/services/discipline.service";
import { generateText } from "@/utils/generateText";
import { formatDateForInput } from "@/utils/formatDateForInput";
import AppLayout from "@/components/common/app-layout";
import FormField from "@/components/pages/edit-discipline/form-field";
import { AxiosError } from "axios";

export type DisciplineData = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
};

const initialState: DisciplineData = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
};

const UpdateDisciplineContent = () => {
    
    const router = useRouter();
    const params = useParams();
    const disciplineId = params.disciplineId as string;

    const [discipline, setDiscipline] = useState<DisciplineData>(initialState);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!disciplineId) return;

        const fetchDiscipline = async () => {
    
            setLoading(true);
            try {
    
                const data = await getDisciplineById(disciplineId);
    
                setDiscipline({
                    name: data.name,
                    description: data.description,
                    startDate: formatDateForInput(data.startDate),
                    endDate: formatDateForInput(data.endDate),
                });
            } catch (error) {
                
                if(error instanceof AxiosError) {

                    // console.error("Discipline Details Fetch Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                }
                else if (error instanceof Error) {
                    
				    // console.error("Discipline Details Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    // console.error("Discipline Details Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDiscipline();
    }, [disciplineId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        
        const { name, value } = e.target;
        setDiscipline(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = async () => {
        
        if (!discipline.name) {
        
            toast.error("Please enter a discipline name first.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Generating...");
        try {
        
            const prompt = `Write a brief, one-sentence description for a personal discipline named "${discipline.name}". The description should be encouraging and clear.`;
            const generatedDescription = await generateText(prompt);
        
            setDiscipline(prev => ({ ...prev, description: generatedDescription }));
            toast.success("Description generated!", { id: toastId });
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Description Generation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message);
            }
            else if (error instanceof Error) {
                    
				// console.error("Description Generation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                
			    // console.error("Description Generation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Updating discipline...");
        try {
        
            await updateDiscipline(disciplineId, discipline);
        
            toast.success("Discipline updated successfully!", { id: toastId });
            router.push("/disciplines");
        } catch (error) {

            if(error instanceof AxiosError) {

                // console.error("Discipline Updation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message);
            }
            else if (error instanceof Error) {
                    
				// console.error("Discipline Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
			    // console.error("Discipline Updation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/disciplines" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </Link>
                            <h1 className="text-3xl font-bold text-black">Update Discipline</h1>
                        </div>
                        {loading ? (
                            <div className="text-center py-12"><p>Loading discipline data...</p></div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField label="Discipline Name" name="name" value={discipline.name} onChange={handleInputChange} placeholder="e.g., Morning Growth Routine" />
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-wait">
                                                <Zap className="h-4 w-4 mr-1" />
                                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                                            </button>
                                        </div>
                                        <FormField as="textarea" label="" name="description" value={discipline.description} onChange={handleInputChange} placeholder="What is the main goal of this discipline?" rows={4} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormField label="Start Date" name="startDate" value={discipline.startDate} onChange={handleInputChange} type="date" />
                                        <FormField label="End Date" name="endDate" value={discipline.endDate} onChange={handleInputChange} type="date" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button type="submit" disabled={loading || isGenerating} className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

const FullUpdateDisciplinePage = () => {
    return (
        <AppLayout>
            <UpdateDisciplineContent />
        </AppLayout>
    );
};

export default FullUpdateDisciplinePage;