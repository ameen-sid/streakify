import React from "react";
import Link from "next/link";
import { Calendar, Flag, Pencil, Trash2 } from "lucide-react";
import { Discipline, ComputedDisciplineStatus } from "@/app/disciplines/page";
import { getDisciplineState } from "@/utils/getDisciplineStatus";
import { DISCIPLINE_STATUS } from "@/constant";

const DisciplineCard = ({ discipline, onDeleteClick }: { discipline: Discipline, onDeleteClick: (discipline: Discipline) => void }) => {
	
	const computedStatus = getDisciplineState(discipline);
	const getStatusStyles = (status: ComputedDisciplineStatus) => {
		
		switch (status) {
			case DISCIPLINE_STATUS.ACTIVE: return 'bg-green-100 text-green-800';
			case DISCIPLINE_STATUS.UPCOMING: return 'bg-blue-100 text-blue-800';
			case DISCIPLINE_STATUS.COMPLETED: return 'bg-gray-100 text-gray-700';
			case DISCIPLINE_STATUS.FAILED: return 'bg-red-100 text-red-800';
			default: return 'bg-yellow-100 text-yellow-800';
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-black transition-all duration-300">
			<div className="p-6">
				<div className="flex justify-between items-start">
					<div>
						<Link href={`/disciplines/${discipline._id}/tasks`} className="group"><h3 className="text-xl font-bold text-black group-hover:underline">{discipline.name}</h3></Link>
						<p className="mt-1 text-gray-600 text-sm">{discipline.description}</p>
					</div>
					<span className={`flex-shrink-0 ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(computedStatus)}`}>{computedStatus}</span>
				</div>
				<div className="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-2 gap-x-6 text-sm text-gray-500">
						<div className="flex items-center"><Calendar size={16} className="mr-2" /><span>{new Date(discipline.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
						<div className="flex items-center"><Flag size={16} className="mr-2" /><span>{new Date(discipline.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
					</div>
					<div className="flex items-center space-x-2 flex-shrink-0 mt-4 sm:mt-0">
						<Link href={`/disciplines/${discipline._id}/edit`} className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 hover:text-black transition-colors"><Pencil size={14} className="mr-2" />Edit</Link>
						<button onClick={() => onDeleteClick(discipline)} className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 hover:text-red-800 transition-colors"><Trash2 size={14} className="mr-2" />Delete</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DisciplineCard;