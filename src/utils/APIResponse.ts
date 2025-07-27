import { DEFAULT_SUCCESS_MESSAGE } from "@/constant";

class APIResponse<T> {
	
	statusCode: number;
	data: T;
	message: string;
	success: boolean;

	constructor(
		statusCode: number, 
		data: T, 
		message: string = DEFAULT_SUCCESS_MESSAGE
	) {

		this.statusCode = statusCode;
		this.data = data;
		this.message = message;
		this.success = statusCode < 400;
	}
};

export { APIResponse };