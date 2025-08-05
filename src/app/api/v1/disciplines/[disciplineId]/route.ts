import mongoose from "mongoose";
import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);
	
	const { disciplineId } = await params;
	if (!disciplineId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
    }

	const discipline = await Discipline.findOne({ _id: disciplineId, owner: user._id });
    if (!discipline) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found");
    }

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			discipline, 
			"Discipline fetched successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});

export const PATCH = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const session = await mongoose.startSession();
	try {

		session.startTransaction();

		const user = await getAuthUser(request);

		const { disciplineId } = await params;
		if (!disciplineId) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
		}

		const body = await request.json();
		const { name, description, startDate, endDate } = body;
		if (!name?.trim() || !description?.trim() || !startDate?.trim() || !endDate?.trim()) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
		}

		const originalDiscipline = await Discipline.findOne({
			_id: disciplineId,
			owner: user._id,
		})
		.session(session);

		if(!originalDiscipline) {
			throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found or you do not have permission to edit it.");
		}

		// prevent to edit finished discipline
		if (originalDiscipline.status !== DISCIPLINE_STATUS.ACTIVE) {
			throw new APIError(HTTP_STATUS.FORBIDDEN, "Cannot edit a discipline that has already been finished.");
		}

		const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const newStartDate = new Date(startDate);
        newStartDate.setUTCHours(0, 0, 0, 0);
        const newEndDate = new Date(endDate);
        newEndDate.setUTCHours(0, 0, 0, 0);
        const originalStartDate = new Date(originalDiscipline.startDate);
        originalStartDate.setUTCHours(0, 0, 0, 0);

		if(newStartDate < originalStartDate) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Start date cannot be moved to an earlier date.");
		}
		if(newStartDate > today) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Start date cannot be moved to a future date.");
		}

		if(newEndDate < newStartDate) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "End date cannot be before the start date.");
		}
		if (newEndDate < today) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "End date cannot be set to a date in the past.");
		}

		// handle the side effects of date changes
		
		// cleanup: if start date was moved forward, delete the now-irrelevant day logs
		if(newStartDate > originalStartDate) {

			await Day.deleteMany({
				discipline: disciplineId,
				date: {
					$gte: originalStartDate,
					$lt: newStartDate
				}
			})
			.session(session);
		}

		const updatedDiscipline = await Discipline.findByIdAndUpdate(
			disciplineId,
			{
				$set: {
					name: name.trim(),
					description: description.trim(),
					startDate: newStartDate,
					endDate: newEndDate
				}
			},
			{ new: true, runValidators: true, session }
		);

		if(!updatedDiscipline) {
			throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update the discipline");
		}

		await session.commitTransaction();

		return NextResponse.json(
			new APIResponse(
				HTTP_STATUS.OK, 
				updatedDiscipline, 
				"Discipline Updated Successfully"
			),
			{ status: HTTP_STATUS.OK }
		);
	} catch(error) {

		await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
	}
});

export const DELETE = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { disciplineId } = await params;
    if (!disciplineId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
    }

	const disciplineToDelete = await Discipline.findOne({ 
		_id: disciplineId, 
		owner: user._id 
	});

	if (!disciplineToDelete) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found or you do not have permission to delete it.");
    }

	if(disciplineToDelete.status === DISCIPLINE_STATUS.ACTIVE) {
		throw new APIError(HTTP_STATUS.BAD_REQUEST, "Active discipline cannot be deleted. Please mark it as 'Completed' or 'Failed' first.");
	}

	await disciplineToDelete.deleteOne();

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			null, 
			"Discipline and all its tasks deleted successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});