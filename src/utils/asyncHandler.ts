import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError } from "./APIError";
import { APIResponse } from "./APIResponse";

type AsyncFunction = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

const asyncHandler = (fn: AsyncFunction) => {
	return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
		try {

			return await fn(req, ...args);
		} catch (error) {

			console.error("API Error Caught: ", error);
			
			if(error instanceof APIError) {

				return NextResponse.json(
					new APIResponse(error.statusCode, null, error.message),
					{ status: error.statusCode }
				);
			}

			return NextResponse.json(
				new APIResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, null, "An internal server error occurred."),
				{ status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
			);
		}
	};
};

export { asyncHandler };