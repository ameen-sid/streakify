import crypto from "crypto";

const hashToken = (token: string): string => {

	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
	return hashedToken;
}

export { hashToken };