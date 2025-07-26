"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Calendar, CheckCircle, Circle, Zap, Flame, Menu, X, BrainCircuit, ListTodo, Settings, LayoutDashboard, BarChart3, Star, UserCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import AppLayout from "@/components/common/app-layout";
import { generateText } from "@/utils/generateText";

type Task = {
    _id: string;
    name: string;
    description: string;
    priority: number;
};

type TaskState = {
    _id: string; 
    task: Task; 
    isCompleted: boolean;
};

type DailyLog = {
    _id: string;
    date: string;
    taskState: TaskState[];
    highlight: string;
};

type Discipline = {
    _id: string;
    currentStreak: number;
};

const TaskItem = ({ taskState, onToggle }: { taskState: TaskState, onToggle: (id: string) => void }) => {

	const { task, isCompleted } = taskState;

	return (
        <div 
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${isCompleted ? 'bg-green-50 border-green-200 cursor-default' : 'bg-white border-gray-200 hover:border-black cursor-pointer'}`}
            onClick={() => !isCompleted && onToggle(task._id)}
        >
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
                <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                </p>
            </div>
        </div>
    );
};

const DailyContent = () => {

    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showStreak, setShowStreak] = useState(false);

    useEffect(() => {
        
		const loadData = async () => {
            
			setLoading(true);
            const toastId = toast.loading("Fetching today's plan...");
            try {
				
				const response = await axios.get("/api/v1/dailylogs/today");
				console.log("Today's Log Fetch Status: ", response);
				
				const logData = response.data.data.day;
				const disciplineData = response.data.data.discipline;

                if (logData && logData.taskState) {
                    logData.taskState.sort((a: TaskState, b: TaskState) => a.task.priority - b.task.priority);
                }
                
                setDailyLog(logData);
                setDiscipline(disciplineData);

                if (logData && logData.taskState.some((ts: TaskState) => ts.isCompleted)) {
                    setShowStreak(true);
                }
                toast.success("Plan loaded!", { id: toastId });
            } catch (error) {

                toast.error("Failed to load today's log.", { id: toastId });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleMarkCompleteTask = async (taskId: string) => {
        
		if (!dailyLog) return;

        const taskStateToToggle = dailyLog.taskState.find(ts => ts.task._id === taskId);
        if (!taskStateToToggle || taskStateToToggle.isCompleted) return;

        const logBeforeToggle = JSON.parse(JSON.stringify(dailyLog));
        const completedBefore = logBeforeToggle.taskState.filter((ts: TaskState) => ts.isCompleted).length;

        const newtaskState = dailyLog.taskState.map(ts => 
            ts.task._id === taskId ? { ...ts, isCompleted: true } : ts
        );
        setDailyLog(prev => prev ? { ...prev, taskState: newtaskState } : null);

        if (completedBefore === 0) setShowStreak(true);

        try {
            
			const response = await axios.patch(`/api/v1/dailylogs/today/tasks/${taskId}`);
			console.log("Task Complete Status: ", response);

            toast.success("Task completed!");
        } catch (error) {

            toast.error("Failed to update task. Please try again.");
            setDailyLog(logBeforeToggle); // Revert UI on error
            if (completedBefore === 0) setShowStreak(false);
        }
    };

    const handleSaveHighlight = async () => {
        
		if (!dailyLog) return;

        setIsSaving(true);
        const toastId = toast.loading("Saving highlight...");
        try {

			const completedTasks = dailyLog.taskState.filter(ts => ts.isCompleted).map(ts => ts.task.name);
        	if (completedTasks.length === 0) {
	
				toast.error("Complete at least one task to save highlight!", { id: toastId });
            	return;
        	}
			
			const response = await axios.post("/api/v1/dailylogs/today/highlight", { highlight: dailyLog.highlight });
        	console.log("Highlight Saving Status: ", response);

            toast.success("Highlight saved!", { id: toastId });
        } catch (error) {
            toast.error("Failed to save highlight.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleGenerateHighlight = async () => {

        if (!dailyLog) return;

        const completedTasks = dailyLog.taskState.filter(ts => ts.isCompleted).map(ts => ts.task.name);
        if (completedTasks.length === 0) {
            
			toast.error("Complete at least one task to generate a highlight!");
            return;
        }

        setIsGenerating(true);
		const prompt = `Based on completing these tasks today: ${completedTasks.join(', ')}. Write a one-sentence, encouraging summary of the day from a first-person perspective.`;
        const toastId = toast.loading("Generating highlight...");
        try {
            
			const response = await generateText(prompt);
            setDailyLog(prev => prev ? { ...prev, highlight: response! } : null);
            toast.success("Highlight generated!", { id: toastId });
        } catch (error) {
            toast.error("Failed to generate highlight.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><p>Loading your plan...</p></div>;
    }

    if (!dailyLog) {
        return <div className="p-8 text-center"><p>Could not load your daily log. Please try again.</p></div>;
    }

    const completedCount = dailyLog.taskState.filter(ts => ts.isCompleted).length;
    const totalCount = dailyLog.taskState.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <style>{`@keyframes fadeInPop { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } } .animate-fade-in-pop { animation: fadeInPop 0.5s ease-out forwards; }`}</style>
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Today's Plan</h1>
                        <p className="mt-1 text-gray-600 flex items-center"><Calendar size={16} className="mr-2" />{currentDate}</p>
                    </div>
                    {showStreak && discipline && (
                        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 font-bold px-4 py-2 rounded-full animate-fade-in-pop">
                            <Flame size={20} className="text-orange-500" />
                            <span>{discipline.currentStreak} Day Streak!</span>
                        </div>
                    )}
                </header>

                {totalCount > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-gray-700">Daily Progress</span><span className="text-sm font-bold text-black">{completedCount} / {totalCount} Completed</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-black h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                )}

                <main>
                    {totalCount > 0 ? (
                        <div className="space-y-4">{dailyLog.taskState.map(ts => (<TaskItem key={ts._id} taskState={ts} onToggle={handleMarkCompleteTask}/>))}</div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200"><h3 className="text-xl font-semibold text-black">No Tasks for Today</h3><p className="mt-2 text-gray-500">Enjoy your day or add tasks to your active discipline.</p></div>
                    )}
                    <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div><h2 className="text-xl font-bold text-black">Highlight of the Day</h2><p className="text-sm text-gray-500">Add a short, memorable description of your day.</p></div>
                            <button onClick={handleGenerateHighlight} disabled={isGenerating} className="flex-shrink-0 flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-wait"><Zap className="h-4 w-4 mr-1" />{isGenerating ? 'Generating...' : 'Generate with AI'}</button>
                        </div>
                        <textarea value={dailyLog.highlight} onChange={(e) => setDailyLog(prev => prev ? { ...prev, highlight: e.target.value } : null)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="What was a win for you today?"/>
                        <button onClick={handleSaveHighlight} disabled={isSaving} className="mt-4 w-full sm:w-auto px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400">{isSaving ? 'Saving...' : 'Save Highlight'}</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

const FullDailyTasksPage = () => {
    return (
        <AppLayout>
            <DailyContent />
        </AppLayout>
    );
};

export default FullDailyTasksPage;