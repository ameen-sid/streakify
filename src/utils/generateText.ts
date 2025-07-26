"use server";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if(!apiKey) {
	throw new Error("Api key not found");
}

const ai = new GoogleGenAI({ apiKey });

const generateText = async (prompt: string) => {

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
		config: {
			thinkingConfig: {
				thinkingBudget: 0,	// Disables thinking
			},
		},
	});

	return response.text;
};

export { generateText };