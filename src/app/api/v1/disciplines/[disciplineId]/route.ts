import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);
	
	const { disciplineId } = params;
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

	const user = await getAuthUser(request);

	const { disciplineId } = params;
	if (!disciplineId) {
        throw new APIError(400, "Discipline ID is required");
    }

	const body = await request.json();
    const { name, description, startDate, endDate } = body;
    if (!name || !description || !startDate || !endDate) {
        throw new APIError(400, "All fields are required");
    }

	const updatedDiscipline = await Discipline.findOneAndUpdate(
		{
			_id: disciplineId,
			owner: user._id
		},
		{
			$set: {
				name,
				description,
				startDate,
				endDate
			}
		},
		{ new: true, runValidators: true }
	);

	if (!updatedDiscipline) {
        throw new APIError(404, "Discipline not found or you do not have permission to edit it.");
    }

	return NextResponse.json(
        new APIResponse(
			200, 
			updatedDiscipline, 
			"Discipline updated successfully"
		),
        { status: 200 }
    );
});

export const DELETE = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { disciplineId } = params;
    if (!disciplineId) {
        throw new APIError(400, "Discipline ID is required");
    }

	const disciplineToDelete = await Discipline.findOne({ 
		_id: disciplineId, 
		owner: user._id 
	});

	if (!disciplineToDelete) {
        throw new APIError(404, "Discipline not found or you do not have permission to delete it.");
    }

	await disciplineToDelete.deleteOne();

	return NextResponse.json(
        new APIResponse(
			200, 
			{}, 
			"Discipline and all its tasks deleted successfully"
		),
        { status: 200 }
    );
});