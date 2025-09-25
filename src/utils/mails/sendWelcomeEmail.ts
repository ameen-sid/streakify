import { APP_NAME, EMAIL_SUBJECTS, HTTP_STATUS } from "@/constant";
import { APIError, mailSender } from "@/utils";

const welcomeEmailTemplate = (
	username: string,
	disciplinePageLink: string,
): string => {
	return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="X-UA-Compatible" content="ie=edge">
					<title>Welcome to ${APP_NAME}!</title>
					<style>
						/* Basic Resets */
						body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
						table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
						img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
						table { border-collapse: collapse !important; }
						body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

						/* Main Styles */
						@media screen and (max-width: 600px) {
							.container {
								width: 100% !important;
								max-width: 100% !important;
							}
						}
					</style>
				</head>
				<body style="margin: 0 !important; padding: 0 !important; background-color: #f7fafc;">

					<!-- Main Table -->
					<table border="0" cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td align="center" style="background-color: #f7fafc;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="container">
									
									<!-- Header -->
									<tr>
										<td align="center" style="padding: 40px 20px 20px 20px;">
											<h1 style="font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: #111827; margin: 0;">
												${APP_NAME}
											</h1>
										</td>
									</tr>

									<!-- Main Content -->
									<tr>
										<td align="center" style="padding: 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
												
												<!-- Title -->
												<tr>
													<td align="center" style="padding-bottom: 20px;">
														<h2 style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #111827; margin: 0;">
															Welcome, ${username}!
														</h2>
													</td>
												</tr>

												<!-- Body Text -->
												<tr>
													<td align="center" style="padding-bottom: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #4b5563;">
														We're thrilled to have you on board. You've taken the first step towards building lasting disciplines and achieving your goals. Let's get you started.
													</td>
												</tr>

												<!-- CTA Button -->
												<tr>
													<td align="center" style="padding: 20px 0;">
														<table border="0" cellspacing="0" cellpadding="0">
															<tr>
																<td align="center" style="border-radius: 8px;" bgcolor="#111827">
																	<a href="${disciplinePageLink}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 15px 25px; border: 1px solid #111827; display: inline-block; font-weight: bold;">Set Up Your First Discipline</a>
																</td>
															</tr>
														</table>
													</td>
												</tr>

												<!-- Info Text -->
												<tr>
													<td align="center" style="padding-top: 20px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #6b7280;">
														If you have any questions, just reply to this email — we're always happy to help out.
													</td>
												</tr>
											</table>
										</td>
									</tr>

									<!-- Footer -->
									<tr>
										<td align="center" style="padding: 30px 20px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #9ca3af;">
											&copy; 2025 ${APP_NAME}. All rights reserved.
										</td>
									</tr>

								</table>
							</td>
						</tr>
					</table>

				</body>
			</html>`;
};

const sendWelcomeEmail = async (
	email: string,
	username: string,
	disciplinePageLink: string,
): Promise<void> => {
	try {

		const title = EMAIL_SUBJECTS.WELCOME;
		const body = welcomeEmailTemplate(username, disciplinePageLink);

		await mailSender({
			email,
			title,
			body
		});

		console.log("Welcome Email sent successfully to: ", email);
	} catch(error) {

		console.error("Error while sending welcome email: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send welcome email. Please try again.");
	}
};

export { sendWelcomeEmail };