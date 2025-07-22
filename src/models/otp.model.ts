import { Schema, model, models } from "mongoose";
import { OTPDocument, OTPModel } from "./otp.types";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

const otpSchema = new Schema<OTPDocument>({
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 5 * 60,
	},
});


otpSchema.pre<OTPDocument>('save', async function (next) {

	if(this.isNew)	await sendVerificationEmail(this.email, this.otp);
	next();
});


const OTP = (models.OTP as OTPModel) || model<OTPDocument, OTPModel>('OTP', otpSchema);

export default OTP;