import nodemailer, { SendMailOptions, SentMessageInfo, TransportOptions } from "nodemailer";
import User from "@/models/user.model";
import { MAIL_TYPES } from "@/constant";
import { generateToken } from "./generateToken";
import mongoose from "mongoose";

interface MailSenderProps {
	email: string;
	emailType: string;
	body?: string;
	userId?: mongoose.Types.ObjectId;
};

const mailSender = async ({ 
	email, emailType, body, userId 
}: MailSenderProps): Promise<SentMessageInfo | undefined> => {
	try {

		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: Number(process.env.MAIL_PORT),
			// secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		} as TransportOptions );

		let mailOptions: SendMailOptions;

		if (emailType === MAIL_TYPES.welcome) {

			mailOptions = {
				from: "Discipline Planner",
				to: email,
				subject: "Welcome to Discipline Planner",
				html: `<p>Welcome to Discipline Planner</p>`
			};
		}
		else if (emailType === MAIL_TYPES.recover) {

			mailOptions = {
				from: "Discipline Planner",
				to: email,
				subject: "Recovery Confirmation",
				html: `<p>Your account is <strong>recovered</strong> successfully.</p>`,
			};
		}
		else {

			if(!userId)	throw new Error("User ID is required for this mail type");
			
			const token = await generateToken(userId!);

			if (emailType === MAIL_TYPES.verify) {

				const updatedUser = await User.findByIdAndUpdate(userId, {
					$set: {
						verifyEmailToken: token,
						isVerified: false,
					}
				});

				mailOptions = {
					from: "Discipline Planner",
					to: email,
					subject: "Verify Your Email",
					html: `<p>To verify your email <a href="http://localhost:3000/verify-email/${token}">Clicl</a> on this.</p>`
				};
			}
			else if (emailType === MAIL_TYPES.reset) {

				const updatedUser = await User.findByIdAndUpdate(userId, {
					$set: {
						resetPasswordToken: token,
						resetPasswordExpires: Date.now() + 3600000, // 1 Hour
					}
				});

				mailOptions = {
					from: "Discipline Planner",
					to: email,
					subject: "Reset Your Password",
					html: `<p>Click <a href="${process.env.DOMAIN}/reset-password?token=${token}">here</a> to "Reset your password" or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/reset-password?token=${token}</p>`,
				};
			}
			else if (emailType === MAIL_TYPES.delete) {

				const updateUser = await User.findByIdAndUpdate(userId, {
					$set: {
						deleteAccountToken: token
					}
				});

				mailOptions = {
					from: "Discipline Planner",
					to: email,
					subject: "Delete Your Account",
					html: `<p>Your account is scheduled to delete after next 30 days if you want to recover your account <strong><a href="${token}">click</a></strong> on this to recover your account.<br/><strong>token: </strong>${token}</p> `,
				}
			}
			else {
				throw new Error("Invalid email type");
			}
		}

		const mailResponse = await transporter.sendMail(mailOptions);

		return mailResponse;
	} catch (error) {
		
		console.error("Error while sending mail: ", error);
		return undefined;
	}
};

export { mailSender };