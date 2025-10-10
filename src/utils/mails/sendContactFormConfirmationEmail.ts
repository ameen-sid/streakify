import { APP_NAME, EMAIL_SUBJECTS, HTTP_STATUS } from "@/constant";
import { APIError, mailSender } from "@/utils";

const contactFormConfirmationTemplate = (
	fullname: string
): string => {
	return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>We've Received Your Message</title>
				</head>
				<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #0A0F1F; color: #E0E0E0;">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center" style="padding: 20px;">
								<div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111827; border-radius: 8px; border: 1px solid #374151;">
									<div style="text-align: center; padding-bottom: 20px;">
										<div style="font-size: 28px; font-weight: bold; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 10px;">
											<span style="color: #3B82F6; display: flex; align-items: center;">
												<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
											</span>
											${APP_NAME}
										</div>
									</div>

									<div style="padding: 20px 0; text-align: center;">
										<h1 style="color: #FFFFFF; font-size: 24px; margin-top: 0;">We've Received Your Message!</h1>
										<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5;">
											Hello ${fullname},
										</p>
										<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5;">
											Thanks for reaching out. This is an automated confirmation that we have successfully received your message. I'll review it and get back to you as soon as possible.
										</p>
										<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5;">
											Please allow 1-2 business days for a response.
										</p>
									</div>

									<div style="padding: 20px 0; text-align: center;">
										<a href="https://streakifyy.vercel.app" style="background-color: #3B82F6; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit Our Website</a>
									</div>

									<div style="text-align: center; padding-top: 20px; border-top: 1px solid #374151; font-size: 12px; color: #6B7280;">
										<p style="margin:0;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</body>
			</html>`
};

const sendContactFormConfirmationEmail = async (
	fullname: string, 
	email: string
): Promise<void> => {
	try {

		const title = EMAIL_SUBJECTS.CONTACT_FORM_CONFIRMATION;
		const body = contactFormConfirmationTemplate(fullname);

		await mailSender({
			email,
			title,
			body
		});

		console.log("Contact Form Confirmation Email sent successfully to: ", email);
	} catch(error) {

		console.error("Error while sending contact form confirmation email: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send contact form confirmation email");
	}
};

export { sendContactFormConfirmationEmail };