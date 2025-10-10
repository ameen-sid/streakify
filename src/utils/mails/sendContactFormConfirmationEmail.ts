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
					<style>
						/* Bulletproof Resets */
						body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
						table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
						img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
						table { border-collapse: collapse !important; }
						body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

						/* Responsive Styles */
						@media screen and (max-width: 600px) {
							.container {
								width: 100% !important;
								max-width: 100% !important;
							}
						}
					</style>
				</head>
				<body style="margin: 0 !important; padding: 0 !important; background-color: #0A0F1F; color: #E0E0E0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
					<table border="0" cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td align="center" style="background-color: #0A0F1F; padding: 20px;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="container">
									<tr>
										<td align="center" valign="top" style="padding: 30px; background-color: #111827; border-radius: 8px; border: 1px solid #374151;">
											<!-- Header -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
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
													</td>
												</tr>
											</table>

											<!-- Body -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top: 20px;">
												<tr>
													<td align="center" style="text-align: center;">
														<h1 style="color: #FFFFFF; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;">We've Received Your Message!</h1>
														<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5; margin: 0 0 15px 0;">
															Hello ${fullname},
														</p>
														<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5; margin: 0 0 15px 0;">
															Thanks for reaching out. This is an automated confirmation that we have successfully received your message. I'll review it and get back to you as soon as possible.
														</p>
														<p style="color: #9CA3AF; font-size: 16px; line-height: 1.5; margin: 0;">
															Please allow 1-2 business days for a response.
														</p>
													</td>
												</tr>
											</table>

											<!-- CTA Button -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
												<tr>
													<td align="center" style="padding: 30px 0;">
														<table border="0" cellspacing="0" cellpadding="0">
															<tr>
																<td align="center" style="border-radius: 8px;" bgcolor="#3B82F6">
																	<a href="https://streakifyy.vercel.app" target="_blank" style="font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 8px; padding: 12px 24px; border: 1px solid #3B82F6; display: inline-block; font-weight: bold;">Visit Our Website</a>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>

											<!-- Footer -->
											<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #374151;">
												<tr>
													<td align="center" style="padding-top: 20px; font-size: 12px; color: #6B7280;">
														<p style="margin:0;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
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