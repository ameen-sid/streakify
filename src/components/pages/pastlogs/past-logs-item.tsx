import React from "react";
import { CheckCircle, Circle } from "lucide-react"
import { TaskState } from "@/app/logs/page";

const PastTaskItem = ({ taskState }: { taskState: TaskState }) => {
    const { task, isCompleted } = taskState;
    return (
        <div className={`p-4 rounded-2xl border flex items-start gap-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div>
                {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                    <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                )}
            </div>
            <div className="flex-grow">
                <h3 className={`font-bold text-lg ${isCompleted ? 'text-gray-500 line-through' : 'text-black'}`}>
                    {task.name}
                </h3>
            </div>
        </div>
    );
};

export default PastTaskItem;