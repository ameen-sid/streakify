"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createTask } from "@/services";
import { AppLayout } from "@/components/common";
import { AxiosError } from "axios";

type TaskData = {
    name: string;
    description: string;
    priority: number | string;
};

const initialState: TaskData = {
    name: "",
    description: "",
    priority: "",
};

const CreateTaskContent = () => {

    const router = useRouter();
    const params = useParams();
    const disciplineId = params.disciplineId as string;

    const [task, setTask] = useState<TaskData>(initialState);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Creating new task...");
        try {
            // Convert priority to a number before sending
            const dataToSend = {
                ...task,
                priority: Number(task.priority)
            };

            await createTask(disciplineId, dataToSend);

            toast.success("Task created successfully!", { id: toastId });
            router.back();
        } catch (error) {

            if(error instanceof AxiosError) {

                // console.error("Task Creation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
            else if (error instanceof Error) {

			    // console.error("Task Creation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {

			    // console.error("Task Creation Failed: ", String(error));
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
                            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </button>
                            <h1 className="text-3xl font-bold text-black">Create a New Task</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                                    <input type="text" id="name" name="name" value={task.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="e.g., 6 AM workout" required />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea id="description" name="description" value={task.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Describe the task in more detail." required />
                                </div>
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <input type="number" id="priority" name="priority" value={task.priority} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="e.g., 1" min="1" required />
                                    <p className="text-xs text-gray-500 mt-1">A lower number means a higher priority.</p>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="submit" disabled={loading} className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
                                    {loading ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FullCreateTaskPage = () => {
    return (
        <AppLayout>
            <CreateTaskContent />
        </AppLayout>
    );
};

export default FullCreateTaskPage;