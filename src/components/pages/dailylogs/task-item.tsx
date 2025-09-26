import React from "react";
import { CheckCircle, Circle } from "lucide-react"
import { TaskState } from "@/app/logs/today/page";

const TaskItem = ({ taskState, onToggle }: { taskState: TaskState, onToggle: (id: string) => void }) => {

    const { task, isCompleted } = taskState;
    return (
        <div 
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${isCompleted ? 'bg-green-50 border-green-200 cursor-default' : 'bg-white border-gray-200 hover:border-black cursor-pointer'}`}
            onClick={() => !isCompleted && onToggle(task._id)}
        >
            <div>{isCompleted ? <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" /> : <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />}</div>
            <div className="flex-grow">
                <h3 className={`font-bold text-lg ${isCompleted ? 'text-gray-500 line-through' : 'text-black'}`}>{task.name}</h3>
                <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
            </div>
        </div>
    );
};

export default TaskItem;