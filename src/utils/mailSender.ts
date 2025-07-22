import nodemailer from "nodemailer";
import User from "@/models/user.model";
import { MAIL_TYPES } from "@/constant";
import { generateToken } from "./generateToken";

interface props {
	email: string;
	emailType: string;
	body?: string;
	userId?: string;
};

const mailSender = async ({ email, emailType, body, userId }: props) => {
	try {

		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			// secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		} as nodemailer.TransportOptions );

		let mailOptions = {};

		if (emailType === MAIL_TYPES.otp) {

			mailOptions = {
				from: "Discipline Planner",
				to: email,
				subject: "One Time Password",
				html: `<p>Your One Time Password is <strong>${body}</strong>!</p>`,
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

			const token = await generateToken(userId!);

			if (emailType === MAIL_TYPES.reset) {

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
		}

		const mailResponse = await transporter.sendMail(mailOptions);

		return mailResponse;
	} catch (error: unknown) {
		console.error("Error while sending mail: ", error);
	}
};

export { mailSender };