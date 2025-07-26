"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft, Pencil, Trash2, Star, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskName: string;
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskName }: DeleteConfirmationModalProps) => {

	if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Delete Task?</h2>
                </div>
                <p className="mt-4 text-gray-600">
                    Are you sure you want to delete the task <span className="font-bold">"{taskName}"</span>? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    discipline: Discipline;
    onDeleteClick: (task: Task) => void;
};

const TaskCard = ({ task, discipline, onDeleteClick }: TaskCardProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-black transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-black">{task.name}</h3>
                        <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
                    </div>
                    <div className="flex items-center text-yellow-500">
                        <Star size={16} className="mr-1" />
                        <span className="font-bold text-sm">P{task.priority}</span>
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-end space-x-2">
                    <Link 
                        href={`/disciplines/${discipline._id}/tasks/edit/${task._id}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 hover:text-black transition-colors"
                    >
                        <Pencil size={14} className="mr-2" />
                        Edit
                    </Link>
                    <button
                        onClick={() => onDeleteClick(task)}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 hover:text-red-800 transition-colors"
                    >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

type Task = {
    _id: string;
	name: string;
	description: string;
	priority: string;
};

type Discipline = {
    _id: string;
    name: string;
};

const DisciplineTasksPage = () => {

    const params = useParams();
    const disciplineId = params.disciplineId;

    const [tasks, setTasks] = useState<Task[]>([]);
	const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

	const getAllTasks = async () => {
        
        setLoading(true);
		try {

			const response = await axios.get(`/api/v1/disciplines/${disciplineId}/tasks`);
			console.log("Tasks Fetch Status: ", response);

			setTasks(response.data.data.tasks);
            setDiscipline(response.data.data.discipline);
            setLoading(false);
		} catch(error) {

            if (axios.isAxiosError(error)) {
                
				console.error("Tasks Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch tasks");
			} else if (error instanceof Error) {
                    
				console.error("Tasks Fetch Failed: ", error.message);
                toast.error(error.message);
            } else {
                    
				console.error("Tasks Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
        } finally {   
            setLoading(false);
        }
	}

    useEffect(() => {
        
		getAllTasks();
    }, []);

    const openDeleteModal = (task: Task) => {

        setTaskToDelete(task);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {

        setTaskToDelete(null);
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {

        if (taskToDelete) {

            const toastId = toast.loading("Deleting task...");
            try {

                const response = await axios.delete(`/api/v1/tasks/${taskToDelete._id}`);
                console.log("Task Deletion Status: ", response);
                
                setTasks(tasks.filter(t => t._id !== taskToDelete._id));
                closeDeleteModal();

                toast.success("Task Deleted Successfully", { id: toastId });
            } catch(error) {
                
                if (axios.isAxiosError(error)) {
                
				    console.error("Task Deletion Failed: ", error.message); 
                    toast.error(error.response?.data?.message || "Failed to delete task", { id: toastId });
			    } else if (error instanceof Error) {
                    
				    console.error("Task Deletion Failed: ", error.message);
                    toast.error(error.message, { id: toastId });
                } else {
                    
				    console.error("Task Deletion Failed: ", String(error));
                    toast.error("An unexpected error occurred", { id: toastId });
                }
            } finally {
                closeDeleteModal();
            }
        }
    };
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading tasks...</p></div>
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
                <div className="w-full max-w-4xl mx-auto">

                    {/* Header */}
                    <header className="mb-8">
                        <Link href="/disciplines" className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-black mb-4">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Disciplines
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-black">{discipline?.name}</h1>
                                <p className="mt-1 text-gray-600">These are the tasks for your discipline.</p>
                            </div>
                            <Link
                                href={`/disciplines/${discipline?._id}/tasks/create`}
                                className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Add New Task
                            </Link>
                        </div>
                    </header>

                    {/* Tasks List */}
                    <main>
                        {tasks.length > 0 ? (
                            <div className="space-y-6">
                                {tasks.map(task => (
                                    <TaskCard 
                                        key={task._id} 
                                        task={task} 
                                        discipline={discipline!}
                                        onDeleteClick={openDeleteModal} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200">
                                <h3 className="text-xl font-semibold text-black">No Tasks Yet</h3>
                                <p className="mt-2 text-gray-500">Click "Add New Task" to set up the tasks for this discipline.</p>
                            </div>
                        )}
                    </main>

                </div>
            </div>

            <DeleteConfirmationModal 
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                taskName={taskToDelete?.name!}
            />
        </>
    );
};

export default DisciplineTasksPage;