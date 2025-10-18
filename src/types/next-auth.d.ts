import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username?: string;
			email?: string;
			role?: string;
			authProvider?: string;
			avatar?: string;
			isVerified?: boolean;
		} & DefaultSession['user'];
	}

	interface User {
		id?: string;
		username?: string;
		email?: string;
		role?: string;
		authProvider?: string;
		avatar?: string;
		isVerified?: boolean;

		providerId?: string;
		fullname?: string;
		dateOfBirth?: Date;
		gender?: string;
		socialLinks?: {
			github?: string;
			linkedIn?: string;
			twitter?: string;
		}
		emailVerifiedAt?: Date;
	}

	interface JWT {
		id?: string;
		username?: string;
		email?: string;
		role?: string;
		authProvider?: string;
		avatar?: string;
		isVerified?: boolean;
	}
};