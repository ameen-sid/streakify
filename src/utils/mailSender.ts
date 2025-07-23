import nodemailer, { SendMailOptions, SentMessageInfo, TransportOptions } from "nodemailer";

interface MailSenderProps {
	email: string;
	title: string;
	body: string;
}

const mailSender = async ({ 
	email, title, body 
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

		mailOptions = await transporter.sendMail({
			from: `Discipline Planner`,
			to: email,
			subject: title,
			html: body,
		});

		const mailResponse = await transporter.sendMail(mailOptions);

		return mailResponse;
	} catch (error) {
		
		console.error("Error while sending mail: ", error);
		return undefined;
	}
};

export { mailSender };