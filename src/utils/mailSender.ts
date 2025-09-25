import nodemailer, { SendMailOptions, SentMessageInfo, TransportOptions } from "nodemailer";
import { APP_NAME, EMAIL_USERNAME, HTTP_STATUS } from "@/constant";
import { APIError } from "@/utils";

interface MailSenderProps {
	email: string;
	title: string;
	body: string;
}

const mailSender = async ({ 
	email, title, body 
}: MailSenderProps): Promise<SentMessageInfo> => {
	try {

		if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
            throw new Error("Mail server environment variables are not fully defined.");
        }

		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			// port: Number(process.env.MAIL_PORT),
			// secure: true, // Use 'true' for port 465, 'false' for other ports
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		} as TransportOptions );

		const mailOptions: SendMailOptions = {
			from: `"${APP_NAME}" <${EMAIL_USERNAME}>`,
			to: email,
			subject: title,
			html: body,
		};

		const mailResponse = await transporter.sendMail(mailOptions);

		return mailResponse;
	} catch (error) {

		console.error("Error while sending mail: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send the email.");
	}
};

export { mailSender };