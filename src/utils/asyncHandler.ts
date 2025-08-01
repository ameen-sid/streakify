import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError } from "./APIError";
import { APIResponse } from "./APIResponse";

const asyncHandler = <
	TParams extends Record<string, string> = Record<string, string>
>(
	fn: (
		req: NextRequest, 
		context: { params: TParams }
	) => Promise<NextResponse>
): (req: NextRequest, context: { params: Record<string, string> }) => Promise<NextResponse> => {
	return async (req: NextRequest, context: { params: Record<string, string> }): Promise<NextResponse> => {
		try {

			return await fn(req, { params: context.params as TParams });
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