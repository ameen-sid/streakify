"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { generateText } from "@/utils/generateText";

type Discipline = {
	name: string;
	description: string;
	startDate: string | Date;
	endDate: string | Date;
};

const UpdateDisciplinePage = () => {

	const params = useParams();
    
	const [discipline, setDiscipline] = useState<Discipline | null>(null);   
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

	const getDiscipline = async () => {

        setLoading(true);
		try {

			const disciplineId = params.disciplineId;

			const response = await axios.get(`/api/v1/disciplines/${disciplineId}`);
			console.log("Discipline Fetch Status: ", response);

        	setDiscipline(response.data.data);
			setLoading(false);
		} catch(error) {
			
			setLoading(false);
			if (axios.isAxiosError(error)) {
                
				console.error("Discipline Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch discipline");
			} else if (error instanceof Error) {
                    
				console.error("Discipline Fetch Failed: ", error.message);
                toast.error(error.message);
            } else {
                    
				console.error("Discipline Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
		}

	}

	useEffect(() => {
        
        getDiscipline();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		
        const { name, value } = e.target;
        setDiscipline(prev => {
			if (!prev) return null;
			return { ...prev, [name]: value };
		});
    };

    const handleGenerateDescription = async () => {

        if (!discipline?.name) {
            
			toast.error("Please enter a discipline name first.");
            return;
        }

		const toastId = toast.loading("Generating...");
		try {

			setIsGenerating(true);
			const prompt = `Write a brief, one-sentence description for a personal discipline named "${discipline.name}". The description should be encouraging and clear. Do not include any formatting, quotation marks, or Markdown. Respond with plain text only.`;

			const generatedDescription = await generateText(prompt);
			setDiscipline(prev => ({ ...prev!, description: generatedDescription! }));
			setIsGenerating(false);

			toast.success("Generated", { id: toastId });
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Description Generation Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to generate description", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Description Generation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Description Generation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
		}
        
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Updating discipline...");
		try {

			const disciplineId = params.disciplineId;

			const response = await axios.patch(`/api/v1/disciplines/${disciplineId}`, discipline);
			console.log("Discipline Updation Status: ", response);
			
			setLoading(false);
			toast.success("Discipline updated successfully!", { id: toastId });
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Discipline Updation Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to update discipline", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Discipline Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Discipline Updation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
		}
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <a href="/disciplines" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </a>
                            <h1 className="text-3xl font-bold text-black">Update Discipline</h1>
                        </div>

                        {loading && !discipline?.name ? (
                            <div className="text-center py-12">
                                <p>Loading discipline data...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Discipline Name</label>
                                        <input 
                                            type="text" 
                                            id="name"
                                            name="name" 
                                            value={discipline?.name} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            placeholder="e.g., Morning Growth Routine"
                                            required 
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                            <button 
                                                type="button"
                                                onClick={handleGenerateDescription}
                                                disabled={isGenerating}
                                                className="flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                            >
                                                <Zap className="h-4 w-4 mr-1" />
                                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                                            </button>
                                        </div>
                                        <textarea 
                                            id="description"
                                            name="description" 
                                            value={discipline?.description} 
                                            onChange={handleInputChange} 
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="What is the main goal of this discipline?"
                                            required 
                                        />
                                    </div>

                                    {/* Date Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Start Date */}
                                        <div>
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input 
                                                type="date" 
                                                id="startDate"
                                                name="startDate" 
                                                value={discipline?.startDate ? new Date(discipline.startDate).toISOString().split('T')[0] : ''}
                                                onChange={handleInputChange} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                                required 
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div>
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input 
                                                type="date" 
                                                id="endDate"
                                                name="endDate"
                                                value={discipline?.endDate ? new Date(discipline.endDate).toISOString().split('T')[0] : ''}
                                                onChange={handleInputChange} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={loading || isGenerating}
                                        className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                                    >
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

export default UpdateDisciplinePage;