import jwt from "jsonwebtoken";

const generateToken = async (userId: string) => {
	try {
		
		if (!process.env.JWT_SECRET) {
			
			console.error("JWT_SECRET environment variable is not defined.");
			process.exit(1);
		}
		
		return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
	} catch (error: unknown) {
		console.error("Error while generating token: ", error);
	}
};

export { generateToken };