"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Calendar, Flag, Pencil, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import AppLayout from "@/components/common/app-layout";
import { getDisciplineState } from "@/utils/getDisciplineStatus";

type Discipline = {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Completed' | 'Failed';
};

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    disciplineName: string;
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, disciplineName }: DeleteConfirmationModalProps) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Delete Discipline?</h2>
                </div>
                <p className="mt-4 text-gray-600">
                    Are you sure you want to delete the discipline <span className="font-bold">"{disciplineName}"</span>? This action cannot be undone.
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

interface DisciplineCardProps {
  discipline: Discipline;
  onDeleteClick: (discipline: Discipline) => void;
};

type DisciplineStatus = 'Active' | 'Completed' | 'Failed' | 'Unknown' | 'Upcoming';

const DisciplineCard = ({ discipline, onDeleteClick }: DisciplineCardProps) => {

    const getStatusStyles = (status: DisciplineStatus) => {
        
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Upcoming': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-gray-100 text-gray-700';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-black transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <a href={`/disciplines/${discipline._id}`} className="group">
                            <h3 className="text-xl font-bold text-black group-hover:underline">{discipline.name}</h3>
                        </a>
                        <p className="mt-1 text-gray-600 text-sm">{discipline.description}</p>
                    </div>
                    <span className={`flex-shrink-0 ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(getDisciplineState({ startDate: discipline.startDate, endDate: discipline.endDate, status: discipline.status }))}`}>
                        {getDisciplineState({ startDate: discipline.startDate, endDate: discipline.endDate, status: discipline.status })}
                    </span>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span>{new Date(discipline.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                            <Flag size={16} className="mr-2" />
                            <span>{new Date(discipline.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 mt-4 sm:mt-0">
                        <a 
                            href={`/disciplines/edit/${discipline._id}`}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 hover:text-black transition-colors"
                        >
                            <Pencil size={14} className="mr-2" />
                            Edit
                        </a>
                        <button
                            onClick={() => onDeleteClick(discipline)}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 hover:text-red-800 transition-colors"
                        >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyDisciplinesPage = () => {

    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disciplineToDelete, setDisciplineToDelete] = useState<Discipline | null>(null);

    const getDisciplines = async () => {

        setLoading(true);
        const toastId = toast.loading("Fetching disciplines...");
        try {
            
            const response = await axios.get("/api/v1/disciplines");
            console.log("Disciplines Fetch Status: ", response);

            setDisciplines(response.data.data);
            toast.success("Disciplines fetched!", { id: toastId });
        } catch (error) {

            if (axios.isAxiosError(error)) {
                
				console.error("Disciplines Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch disciplines", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Disciplines Fetch Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Disciplines Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        getDisciplines();
    }, []);

    const openDeleteModal = (discipline: Discipline) => {

        setDisciplineToDelete(discipline);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {

        setDisciplineToDelete(null);
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {

        if (!disciplineToDelete) return;

        const toastId = toast.loading("Deleting discipline...");
        try {
            
            const response = await axios.delete(`/api/v1/disciplines/${disciplineToDelete._id}`);
            console.log("Discipline Delete Status: ", response);

            setDisciplines(disciplines.filter(d => d._id !== disciplineToDelete._id));
            toast.success("Discipline deleted.", { id: toastId });
        } catch (error) {

            if (axios.isAxiosError(error)) {
                
				console.error("Discipline Deletion Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to delete discipline.", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Discipline Deletion Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Discipline Deletion Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <>  
            <AppLayout>
                <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
                    <div className="w-full max-w-4xl mx-auto">
                        {/* Header */}
                        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-black">My Disciplines</h1>
                                <p className="mt-1 text-gray-600">Here are all the disciplines you've created.</p>
                            </div>
                            <Link
                                href="/disciplines/create-discipline"
                                className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Create New
                            </Link>
                        </header>

                        {/* Disciplines List */}
                        <main>
                            {loading ? (
                                <div className="text-center py-16"><p>Loading...</p></div>
                            ) : disciplines.length > 0 ? (
                                <div className="space-y-6">
                                    {disciplines.map(discipline => (
                                        <DisciplineCard 
                                            key={discipline._id} 
                                            discipline={discipline} 
                                            onDeleteClick={openDeleteModal} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200">
                                    <h3 className="text-xl font-semibold text-black">No Disciplines Yet</h3>
                                    <p className="mt-2 text-gray-500">Click "Create New" to start your first discipline.</p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
                <DeleteConfirmationModal 
                    isOpen={isModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                    disciplineName={disciplineToDelete?.name || ''}
                />
            </AppLayout>
        </>
    );
};

export default MyDisciplinesPage;