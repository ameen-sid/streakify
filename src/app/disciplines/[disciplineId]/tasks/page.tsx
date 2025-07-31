"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getTasksForDiscipline, deleteTask } from "@/services/task.service";
import AppLayout from "@/components/common/app-layout";
import DeleteConfirmationModal from "@/components/pages/tasks/delete-confirmation-modal";
import TaskCard from "@/components/pages/tasks/task-card";

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

const DisciplineTasksContent = () => {
    
    const params = useParams();
    const disciplineId = params.disciplineId as string;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [discipline, setDiscipline] = useState<DisciplineInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    useEffect(() => {
        if (!disciplineId) return;

        const getAllTasks = async () => {
        
            setLoading(true);
            try {
        
                const { tasks, discipline } = await getTasksForDiscipline(disciplineId);
        
                tasks.sort((a, b) => a.priority - b.priority);
                setTasks(tasks);
                setDiscipline(discipline);
            } catch (error) {
                
                if (error instanceof Error) {
                    
				    console.error("Tasks Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    console.error("Tasks Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        getAllTasks();
    }, [disciplineId]);

    const openDeleteModal = (task: Task) => {
    
        setTaskToDelete(task);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
    
        setTaskToDelete(null);
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
       
        if (!taskToDelete) return;
        const toastId = toast.loading("Deleting task...");
        try {
       
            await deleteTask(taskToDelete._id);
       
            setTasks(tasks.filter(t => t._id !== taskToDelete._id));
            toast.success("Task Deleted Successfully", { id: toastId });
        } catch (error) {
            
            if (error instanceof Error) {
                    
				console.error("Task Deletion Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
			    console.error("Task Deletion Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            closeDeleteModal();
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><p>Loading tasks...</p></div>;
    }
    
    if (!discipline) {
        return <div className="p-8 text-center"><p>Could not load discipline details.</p></div>;
    }

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl mx-auto">
                    
                    <header className="mb-8">
                        <Link href="/disciplines" className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-black mb-4">
                            <ArrowLeft size={16} className="mr-2" />Back to Disciplines
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-black">{discipline.name}</h1>
                                <p className="mt-1 text-gray-600">These are the tasks for your discipline.</p>
                            </div>
                            <Link href={`/disciplines/${discipline._id}/tasks/create`} className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
                                <PlusCircle size={20} className="mr-2" />Add New Task
                            </Link>
                        </div>
                    </header>

                    <main>
                        {tasks.length > 0 ? (
                            <div className="space-y-6">{tasks.map(task => (<TaskCard key={task._id} task={task} disciplineId={discipline._id} onDeleteClick={openDeleteModal} />))}</div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200"><h3 className="text-xl font-semibold text-black">No Tasks Yet</h3><p className="mt-2 text-gray-500">Click &quot;Add New Task&quot; to set up the tasks for this discipline.</p></div>
                        )}
                    </main>
                    
                </div>
            </div>
            <DeleteConfirmationModal isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} taskName={taskToDelete?.name || ''} />
        </>
    );
};

const FullDisciplineTasksPage = () => {
    return (
        <AppLayout>
            <DisciplineTasksContent />
        </AppLayout>
    );
};

export default FullDisciplineTasksPage;