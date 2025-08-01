"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Zap, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { getDailyLog, updateTaskStatus, saveHighlight } from "@/services/dailylog.service";
import { generateText } from "@/utils/generateText";
import TaskItem from "@/components/pages/dailylogs/task-item";
import AppLayout from "@/components/common/app-layout";
import { AxiosError } from "axios";

type Task = {
    _id: string;
    name: string;
    description: string;
    priority: number;
};

export type TaskState = {
    _id: string; 
    task: Task; 
    isCompleted: boolean;
};

type Day = {
    _id: string;
    date: string;
    taskState: TaskState[];
    highlight: string;
}

type Discipline = {
    _id: string;
    currentStreak: number;
};

type DailyLog = {
    day: Day,
    discipline: Discipline
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
            try {
           
                const data = await getDailyLog();
               
                const logData = data.day;
                const disciplineData = data.discipline;
                
                if (logData && logData.taskState) {
                    logData.taskState.sort((a, b) => a.task.priority - b.task.priority);
                }
                if(logData && disciplineData)   setDailyLog(data);
                setDiscipline(disciplineData);
                
                if (logData && logData.taskState.length > 0) {
                    
                    const completedCount = logData.taskState.filter(ts => ts.isCompleted).length;
                    const totalCount = logData.taskState.length;
                    const completionRate = (completedCount / totalCount) * 100;
                    if (completionRate >= 75) {
                        setShowStreak(true);
                    }
                }
            } catch (error) {
                
                if(error instanceof AxiosError) {

                    // console.error("Today's Log Fetch Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                }
                else if (error instanceof Error) {
                    
				    // console.error("Today's Log Fetch Failed: ", error);
                    toast.error(error.message);
                } else {
                    
				    // console.error("Today's Log Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleToggleTask = async (taskId: string) => {
       
        if (!dailyLog) return;

        const taskStateToToggle = dailyLog.day.taskState.find(ts => ts.task._id === taskId);
        if (!taskStateToToggle || taskStateToToggle.isCompleted) return;

        const logBeforeToggle = JSON.parse(JSON.stringify(dailyLog));
        const completedBefore = logBeforeToggle.day.taskState.filter((ts: TaskState) => ts.isCompleted).length;

        const newtaskState = dailyLog.day.taskState.map(ts => ts.task._id === taskId ? { ...ts, isCompleted: true } : ts);
        setDailyLog(prev => {
            if (!prev) return null;
            return { ...prev, day: { ...prev.day, taskState: newtaskState } };
        });

        const completedAfter = newtaskState.filter(ts => ts.isCompleted).length;
        const totalTasks = newtaskState.length;
        const completionRate = totalTasks > 0 ? (completedAfter / totalTasks) * 100 : 0;

        if (completionRate >= 75) {
            setShowStreak(true);
        }

        try {
       
            await updateTaskStatus(taskId);
       
            toast.success("Task completed!");
        } catch (error) {
       
            if(error instanceof AxiosError) {

                // console.error("Task Mark as Completed Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message);
            }
            else if (error instanceof Error) {
                    
				// console.error("Task Mark as Completed Failed: ", error.message);
                toast.error(error.message);
            } else {
                    
			    // console.error("Task Mark as Completed Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
            setDailyLog(logBeforeToggle);
            if (completedBefore === 0) setShowStreak(false);
        }
    };

    const handleSaveHighlight = async () => {
        
        if (!dailyLog) {
            
            toast.error("Add tasks to add highlight!");
            return;
        }
        setIsSaving(true);
        const toastId = toast.loading("Saving highlight...");
        try {
        
            await saveHighlight(dailyLog.day.highlight);
        
            toast.success("Highlight saved!", { id: toastId });
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Highlight Updation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
            else if (error instanceof Error) {
                    
				// console.error("Highlight Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				// console.error("Highlight Updation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleGenerateHighlight = async () => {
        
        if (!dailyLog) {
            
            toast.error("Add tasks to generate a highlights!");
            return;
        }
        const completedTasks = dailyLog.day.taskState.filter(ts => ts.isCompleted).map(ts => ts.task.name);
        if (completedTasks.length === 0) {
        
            toast.error("Complete at least one task to generate a highlight!");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Generating highlight...");
        try {
        
            const prompt = `Based on completing these tasks today: ${completedTasks.join(', ')}. Write a one-sentence, encouraging summary of the day from a first-person perspective.`;
            const generatedText = await generateText(prompt);
        
            setDailyLog(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    day: {
                        ...prev.day,
                        highlight: generatedText || ''
                    }
                };
            });
            toast.success("Highlight generated!", { id: toastId });
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Highlight Generation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message);
            }
            else if (error instanceof Error) {
                    
				// console.error("Highlight Generation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				// console.error("Highlight Generation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><p>Loading your plan...</p></div>;
    }

    // if (!dailyLog) {
    //     return <div className="p-8 text-center"><p>Could not load your daily log. Please try again.</p></div>;
    // }

    const completedCount = dailyLog && dailyLog.day.taskState.filter(ts => ts.isCompleted).length;
    const totalCount = dailyLog && dailyLog.day.taskState.length;
    const progressPercentage = totalCount && totalCount > 0 ? (completedCount! / totalCount) * 100 : 0;
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <style>{`@keyframes fadeInPop { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } } .animate-fade-in-pop { animation: fadeInPop 0.5s ease-out forwards; }`}</style>
            <div className="w-full max-w-2xl mx-auto">
               
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Today&apos;s Plan</h1>
                        <p className="mt-1 text-gray-600 flex items-center"><Calendar size={16} className="mr-2" />{currentDate}</p>
                    </div>
                    {showStreak && discipline && (
                        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 font-bold px-4 py-2 rounded-full animate-fade-in-pop">
                            <Flame size={20} className="text-orange-500" />
                            <span>{discipline.currentStreak == 0 ? 1 : discipline.currentStreak} Day Streak!</span>
                        </div>
                    )}
                </header>

                {totalCount && totalCount > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-gray-700">Daily Progress</span><span className="text-sm font-bold text-black">{completedCount} / {totalCount} Completed</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-black h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                )}

                <main>
                    {totalCount && totalCount > 0 ? (
                        <div className="space-y-4">{dailyLog.day.taskState.map(ts => (<TaskItem key={ts._id} taskState={ts} onToggle={handleToggleTask}/>))}</div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-gray-200"><h3 className="text-xl font-semibold text-black">No Tasks for Today</h3><p className="mt-2 text-gray-500">Enjoy your day or add tasks to your active discipline.</p></div>
                    )}
                    <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div><h2 className="text-xl font-bold text-black">Highlight of the Day</h2><p className="text-sm text-gray-500">Add a short, memorable description of your day.</p></div>
                            <button onClick={handleGenerateHighlight} disabled={isGenerating} className="flex-shrink-0 flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait"><Zap className="h-4 w-4 mr-1" />{isGenerating ? 'Generating...' : 'Generate with AI'}</button>
                        </div>
                        <textarea 
                            value={dailyLog?.day.highlight ?? ""}
                            onChange={(e) => setDailyLog(prev => {
                                if (!prev) return null;
                                return {
                                    ...prev,
                                    day: {
                                        ...prev.day,
                                        highlight: e.target.value
                                    }
                                };
                            })} 
                            rows={3} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                            placeholder="What was a win for you today?"
                        />
                        <button onClick={handleSaveHighlight} disabled={isSaving} className="mt-4 w-full sm:w-auto px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">{isSaving ? 'Saving...' : 'Save Highlight'}</button>
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
}

export default FullDailyTasksPage;