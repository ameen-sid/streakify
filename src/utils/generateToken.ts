import jwt from "jsonwebtoken";

const generateToken = async (userId: string): Promise<string> => {
	try {
		
		if (!process.env.JWT_SECRET) {
			
			console.error("JWT_SECRET environment variable is not defined.");
			process.exit(1);
		}
		
		return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
	} catch (error) {
		
		console.error("Error while generating token: ", error);
		throw new Error("Token generation failed");
	}
};

export { generateToken };