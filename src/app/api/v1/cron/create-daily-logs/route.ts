import connectDB from "@/database";
import { Discipline, Task, Day } from "@/models";
import { ITask } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";

export const POST = asyncHandler(async (request: NextRequest) => {

    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activeDisciplines = await Discipline.find({ 
        status: DISCIPLINE_STATUS.ACTIVE,
        startDate: { $lte: today },
        endDate: { $gte: today }
    })
    .select('_id owner');

    if (activeDisciplines.length === 0) {
        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK, 
                { 
                    created: 0, 
                    skipped: 0, 
                    failed: 0 
                }, 
                "No active disciplines found."
            ),
            { status: HTTP_STATUS.OK }
        );
    }

    const disciplineIds = activeDisciplines.map(d => d._id);
    const allTasks = await Task.find({ 
        discipline: { $in: disciplineIds } 
    });

    type TasksByDiscipline = Record<string, ITask[]>;

    const tasksByDiscipline = allTasks.reduce((acc: TasksByDiscipline, task) => {

        const key = task.discipline.toString();
        if (!acc[key])  acc[key] = [];
        acc[key].push(task);
        return acc;
    }, {});

    const dayCreationPromises = activeDisciplines.map(async (discipline) => {

        const userId = discipline.owner;
        const disciplineId = discipline._id;
        const tasks = tasksByDiscipline[disciplineId.toString()] || [];

        try {

            if (tasks.length === 0) {
                return { status: 'skipped', reason: 'No tasks', userId };
            }

            const existingDay = await Day.findOne({ user: userId, date: today });
            if (existingDay) {
                return { status: 'skipped', reason: 'Already exists', userId };
            }

            const taskStateData = tasks.map(task => ({
                task: task._id,
                isCompleted: false,
            }));

            await Day.create({
                date: today,
                user: userId,
                discipline: disciplineId,
                taskState: taskStateData,
            });

            return { status: 'created', userId };

        } catch (error) {

            console.error(`Failed to create day for user ${userId}:`, error);
            return Promise.reject({ reason: `DB error for user ${userId}`, error });
        }
    });

    const results = await Promise.allSettled(dayCreationPromises);

    const summary = {
        totalActiveDisciplines: activeDisciplines.length,
        created: results.filter(r => r.status === 'fulfilled' && r.value.status === 'created').length,
        skipped: results.filter(r => r.status === 'fulfilled' && r.value.status === 'skipped').length,
        failed: results.filter(r => r.status === 'rejected').length,
    };

    console.log("Daily log creation job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Daily log creation job completed successfully.",
        ),
        { status: HTTP_STATUS.OK }
    );
});