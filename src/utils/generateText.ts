"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODEL_NAME, HTTP_STATUS } from "@/constant";
import { APIError } from "@/utils";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generateText = async (prompt: string): Promise<string> => {
	try {

		const result = await model.generateContent(prompt);

		const response = result.response;
		const text = response.text();

		return text;
	} catch(error) {

		console.error("Error generating text with Gemini API: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to generate AI text. Please try again");
	}
};

export { generateText };