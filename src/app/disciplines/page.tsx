"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getDisciplines, deleteDiscipline } from "@/services/discipline.service";
import AppLayout from "@/components/common/app-layout";
import DeleteConfirmationModal from "@/components/pages/disciplines/delete-confirmation-modal";
import DisciplineCard from "@/components/pages/disciplines/discipline-card";

export type StoredDisciplineStatus = 'Active' | 'Completed' | 'Failed';
export type ComputedDisciplineStatus = StoredDisciplineStatus | 'Upcoming' | 'Unknown';

export type Discipline = {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: StoredDisciplineStatus;
};

const MyDisciplinesContent = () => {

    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disciplineToDelete, setDisciplineToDelete] = useState<Discipline | null>(null);

    useEffect(() => {
        const fetchDisciplines = async () => {

            setLoading(true);
            try {
                const fetchedDisciplines = await getDisciplines();

                setDisciplines(fetchedDisciplines);
            } catch (error) {

                if (error instanceof Error) {
                    
				    console.error("Disciplines Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    console.error("Disciplines Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDisciplines();
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

            await deleteDiscipline(disciplineToDelete._id);

            setDisciplines(disciplines.filter(d => d._id !== disciplineToDelete._id));
            toast.success("Discipline deleted.", { id: toastId });
        } catch (error) {
            
            if (error instanceof Error) {
                    
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
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl mx-auto">
                    
                    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">My Disciplines</h1>
                            <p className="mt-1 text-gray-600">Here are all the disciplines you've created.</p>
                        </div>
                        <Link href="/disciplines/create-discipline" className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
                            <PlusCircle size={20} className="mr-2" />Create New
                        </Link>
                    </header>

                    <main>
                        {loading ? (
                            <div className="text-center py-16"><p>Loading...</p></div>
                        ) : disciplines.length > 0 ? (
                            <div className="space-y-6">{disciplines.map(discipline => (<DisciplineCard key={discipline._id} discipline={discipline} onDeleteClick={openDeleteModal} />))}</div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200"><h3 className="text-xl font-semibold text-black">No Disciplines Yet</h3><p className="mt-2 text-gray-500">Click "Create New" to start your first discipline.</p></div>
                        )}
                    </main>

                </div>
            </div>
            <DeleteConfirmationModal isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} disciplineName={disciplineToDelete?.name || ''} />
        </>
    );
};

const FullMyDisciplinesPage = () => {
    return (
        <AppLayout>
            <MyDisciplinesContent />
        </AppLayout>
    );
};

export default FullMyDisciplinesPage;