"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type Task = {
	name: string;
	description: string;
	priority: number;
};

const EditTaskPage = () => {

	const router = useRouter();

	const params = useParams();
	const taskId = params.taskId;

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

	const getTaskDetails = async () => {

		setLoading(true);
		try {

			const response = await axios.get(`/api/v1/tasks/${taskId}`);
			console.log("Task Fetch Status: ", response);

			setLoading(false);
			setTask(response.data.data);
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Task Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch task");
			} else if (error instanceof Error) {
                    
				console.error("Task Fetch Failed: ", error.message);
                toast.error(error.message);
            } else {
                    
				console.error("Task Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
		}
	}

    useEffect(() => {
        
		getTaskDetails();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;
        setTask(prev => ({ ...prev!, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Updating task...");
        try {

			const response = await axios.patch(`/api/v1/tasks/${taskId}`, task);
			console.log("Task Updation Status: ", response);
            
			setLoading(false);
            toast.success("Task updated successfully!", { id: toastId });

			router.back();
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Task Updation Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to update task", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Task Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Task Updation Failed: ", String(error));
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
                            <a href="/disciplines/1" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </a>
                            <h1 className="text-3xl font-bold text-black">Edit Task</h1>
                        </div>
                        
                        {loading && !task?.name ? (
                             <div className="text-center py-12">
                                <p>Loading task data...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                                        <input 
                                            type="text" 
                                            id="name"
                                            name="name" 
                                            value={task?.name} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            placeholder="e.g., 6 AM workout"
                                            required 
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea 
                                            id="description"
                                            name="description" 
                                            value={task?.description} 
                                            onChange={handleInputChange} 
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Describe the task in more detail."
                                            required 
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <input 
                                            type="number" 
                                            id="priority"
                                            name="priority" 
                                            value={task?.priority} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            placeholder="e.g., 1"
                                            min="1"
                                            required 
                                        />
                                         <p className="text-xs text-gray-500 mt-1">A lower number means a higher priority.</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
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

export default EditTaskPage;