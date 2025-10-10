import { APP_NAME, EMAIL_SUBJECTS, ADMIN_EMAIL, HTTP_STATUS } from "@/constant";
import { APIError, mailSender } from "@/utils";

const contactFormNotificationTemplate = (
	fullname: string, 
	email: string, 
	reason: string, 
	message: string
): string => {
	return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>New Contact Message from Streakify</title>
				</head>
				<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #0A0F1F; color: #E0E0E0;">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center" style="padding: 20px;">
								<div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111827; border-radius: 8px; border: 1px solid #374151;">
									<div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #374151;">
										<div style="font-size: 28px; font-weight: bold; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 10px;">
											<span style="color: #3B82F6; display: flex; align-items: center;">
												<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
											</span>
											${APP_NAME}
										</div>
										<h1 style="color: #FFFFFF; font-size: 24px; margin-top: 10px; margin-bottom: 0;">New Contact Message</h1>
									</div>

									<div style="padding: 20px 0; text-align: left;">
										<table width="100%" border="0" cellspacing="0" cellpadding="0">
											<tr>
												<td style="padding-bottom: 15px;">
													<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">From:</strong>
													<p style="margin: 5px 0 0 0; color: #FFFFFF; font-size: 16px;">${fullname}</p>
												</td>
											</tr>
											<tr>
												<td style="padding-bottom: 15px;">
													<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Email:</strong>
													<p style="margin: 5px 0 0 0; font-size: 16px;">
														<a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a>
													</p>
												</td>
											</tr>
											<tr>
												<td style="padding-bottom: 20px;">
													<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Reason for Contact:</strong>
													<p style="margin: 5px 0 0 0; color: #FFFFFF; font-size: 16px; font-weight: bold;">${reason}</p>
												</td>
											</tr>
											<tr>
												<td style="padding-top: 20px; border-top: 1px solid #374151;">
													<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Message:</strong>
													<div style="margin-top: 10px; color: #D1D5DB; font-size: 16px; line-height: 1.6; white-space: pre-wrap; background-color: #1F2937; padding: 15px; border-radius: 8px;">${message}</div>
												</td>
											</tr>
										</table>
									</div>

									<div style="text-align: center; padding-top: 20px; border-top: 1px solid #374151; font-size: 12px; color: #6B7280;">
										<p style="margin:0;">This is an automated notification from your ${APP_NAME} contact form.</p>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</body>
			</html>`
};

const sendContactFormNotificationEmail = async (
	fullname: string, 
	email: string, 
	reason: string, 
	message: string
): Promise<void> => {
	try {

		const title = EMAIL_SUBJECTS.CONTACT_FORM_ADMIN_NOTIFICATION(reason);
		const body = contactFormNotificationTemplate(fullname, email, reason, message);

		await mailSender({
			email: ADMIN_EMAIL,
			title,
			body
		});

		console.log("Contact Form Notification Email sent successfully to: ", ADMIN_EMAIL);
	} catch(error) {

		console.error("Error while sending contact form notification email: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send contact form notification email");
	}
};

export { sendContactFormNotificationEmail };