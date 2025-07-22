import { MAIL_TYPES } from "@/constant";
import { mailSender } from "./mailSender";

const sendVerificationEmail = async (email: string, otp: string) => {
	try {

		const mailResponse = await mailSender({
			email,
			emailType: MAIL_TYPES.otp,
			body: otp
		});

		console.log("Mail Response: ", mailResponse);
	} catch (error: unknown) {
		
		console.error("Error while sending verification mail: ", error);
		throw error;
	}
};

export { sendVerificationEmail };