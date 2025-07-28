import React from "react";
import Link from "next/link";
import { Pencil, Trash2, Star } from "lucide-react"
import { Task } from "@/app/disciplines/[disciplineId]/tasks/page";

const TaskCard = ({ task, disciplineId, onDeleteClick }: { task: Task, disciplineId: string, onDeleteClick: (task: Task) => void }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-black transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div><h3 className="text-xl font-bold text-black">{task.name}</h3><p className="mt-1 text-gray-600 text-sm">{task.description}</p></div>
                    <div className="flex items-center text-yellow-500"><Star size={16} className="mr-1" /><span className="font-bold text-sm">P{task.priority}</span></div>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-end space-x-2">
                    <Link href={`/disciplines/${disciplineId}/tasks/edit/${task._id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 hover:text-black transition-colors">
                        <Pencil size={14} className="mr-2" />Edit
                    </Link>
                    <button onClick={() => onDeleteClick(task)} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 hover:text-red-800 transition-colors">
                        <Trash2 size={14} className="mr-2" />Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;