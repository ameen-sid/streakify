import { EMAIL_SUBJECTS, HTTP_STATUS } from "@/constant";
import { APIError } from "../APIError";
import { mailSender } from "../mailSender";

const resetPasswordEmailTemplate = (
	username: string,
	resetPasswordLink: string,
): string => {
	return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="X-UA-Compatible" content="ie=edge">
					<title>Reset Your Discipline Planner Password</title>
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
												Discipline Planner
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
															Reset Your Password
														</h2>
													</td>
												</tr>

												<!-- Body Text -->
												<tr>
													<td align="center" style="padding-bottom: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #4b5563;">
														Hi ${username}, we received a request to reset your password. Click the button below to choose a new one.
													</td>
												</tr>

												<!-- Reset Button -->
												<tr>
													<td align="center" style="padding: 20px 0;">
														<table border="0" cellspacing="0" cellpadding="0">
															<tr>
																<td align="center" style="border-radius: 8px;" bgcolor="#111827">
																	<a href="${resetPasswordLink}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 15px 25px; border: 1px solid #111827; display: inline-block; font-weight: bold;">Reset Your Password</a>
																</td>
															</tr>
														</table>
													</td>
												</tr>

												<!-- Expiration Text -->
												<tr>
													<td align="center" style="padding-top: 20px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #6b7280;">
														This link is valid for 30 minutes.
													</td>
												</tr>

												<!-- Security Note -->
												<tr>
													<td align="center" style="padding-top: 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #6b7280;">
														If you did not request a password reset, you can safely ignore this email.
													</td>
												</tr>
											</table>
										</td>
									</tr>

									<!-- Footer -->
									<tr>
										<td align="center" style="padding: 30px 20px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #9ca3af;">
											&copy; 2025 Discipline Planner. All rights reserved.
										</td>
									</tr>

								</table>
							</td>
						</tr>
					</table>

				</body>
			</html>`;
};

const sendResetPasswordEmail = async (
	email: string,
	username: string,
	resetPasswordLink: string,
): Promise<void> => {
	try {

		const title = EMAIL_SUBJECTS.RESET_PASSWORD;
		const body = resetPasswordEmailTemplate(username, resetPasswordLink);

		await mailSender({
			email,
			title,
			body
		});

		console.log("Reset Password Email sent successfully to: ", email);
	} catch(error) {

		console.error("Error while sending reset password email: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send reset password email. Please try again.");
	}
};

export { sendResetPasswordEmail };