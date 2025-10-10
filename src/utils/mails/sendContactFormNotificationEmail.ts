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
					<title>New Contact Message from ${APP_NAME}</title>
					<style>
						body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
						table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
						img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
						table { border-collapse: collapse !important; }
						body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
					</style>
				</head>
				<body style="margin: 0 !important; padding: 0 !important; background-color: #0A0F1F; color: #E0E0E0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
					<table border="0" cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td align="center" style="background-color: #0A0F1F; padding: 20px;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
									<tr>
										<td align="center" valign="top" style="padding: 30px; background-color: #111827; border-radius: 8px; border: 1px solid #374151;">
											<!-- Header -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #374151;">
												<tr>
													<td align="center" style="padding-bottom: 20px;">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td align="center" style="font-size: 28px; font-weight: bold; color: #FFFFFF;">
																	<img src="https://res.cloudinary.com/dcq0t9ts0/image/upload/v1760066491/brain-circuit_m0k01d.png" alt="${APP_NAME} Logo" width="32" height="32" style="display: inline-block; border: 0; vertical-align: middle; margin-right: 6px;">
																	<span style="vertical-align: middle;">${APP_NAME}</span>
																</td>
															</tr>
														</table>
														<h1 style="color: #FFFFFF; font-size: 24px; margin: 10px 0 0 0; font-weight: bold;">New Contact Message</h1>
													</td>
												</tr>
											</table>

											<!-- Body -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top: 20px;">
												<tr>
													<td align="left" style="font-size: 16px; line-height: 1.5;">
														<p style="margin: 0 0 15px 0;">
															<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">From:</strong><br>
															<span style="color: #FFFFFF; font-size: 16px;">${fullname}</span>
														</p>
														<p style="margin: 0 0 15px 0;">
															<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Email:</strong><br>
															<a href="mailto:${email}" style="color: #3B82F6; text-decoration: none; font-size: 16px;">${email}</a>
														</p>
														<p style="margin: 0 0 20px 0;">
															<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Reason for Contact:</strong><br>
															<span style="color: #FFFFFF; font-size: 16px; font-weight: bold;">${reason}</span>
														</p>
													</td>
												</tr>

												<tr>
													<td align="left" style="padding-top: 20px; border-top: 1px solid #374151;">
														<strong style="color: #9CA3AF; font-size: 14px; text-transform: uppercase;">Message:</strong>
														<div style="margin-top: 10px; color: #D1D5DB; font-size: 16px; line-height: 1.6; white-space: pre-wrap; background-color: #1F2937; padding: 15px; border-radius: 8px;">${message}</div>
													</td>
												</tr>
											</table>

											<!-- Footer -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #374151; margin-top: 20px;">
												<tr>
													<td align="center" style="padding-top: 20px; font-size: 12px; color: #6B7280;">
														<p style="margin:0;">This is an automated notification from your ${APP_NAME} contact form.</p>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
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