import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import connectDB from "@/database";
import { User } from "@/models";
import { UserDocument } from "@/models/types";
import { generatePlaceholder, generateToken, hashToken, sanitizeUser } from "@/utils";
import { sendVerificationEmail, sendWelcomeEmail } from "@/utils/mails";

export const authOptions: NextAuthConfig = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				action: { label: "Action", type: "text" },
			},
			async authorize(credentials, request) {

				await connectDB();
				try {

					let globalUser: UserDocument;
					if(credentials.action === "signup") {

						const { username, email, password } = credentials as {
							username?: string;
							email?: string;
							password?: string;
						};

						if(!username?.trim() || !email?.trim() || !password?.trim()) {
							throw new Error("All fields are required");
						}

						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if(!emailRegex.test(email)) {
							throw new Error("Invalid email format");
						}

						const existedUser = await User.findOne({ $or: [ { username }, { email } ]});
						if(existedUser) {
							throw new Error("User with this email or username already exists");
						}

						const avatar = generatePlaceholder(username);
						const user = new User({
							username: username.toLowerCase().trim(),
							email: email.trim(),
							avatar,
							password,
						});

						const verificationToken = generateToken(user._id);
						const hashedToken = hashToken(verificationToken);
						user.verifyEmailToken = hashedToken;

						// const accessToken = user.generateAccessToken();
						// const refreshToken = user.generateRefreshToken();
						// const hashedRefreshToken = hashToken(refreshToken);
						// user.refreshToken = hashedRefreshToken;

						const createdUser = await user.save();
						if(!createdUser) {
							throw new Error("Failed to create user");
						}

						const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
						const verificationUrl = `${baseUrl}/verify-email/${verificationToken}`;

						await sendVerificationEmail(
							createdUser.email,
							createdUser.username,
							verificationUrl
						);

						// const cookieStore = await cookies();
						// cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
						// cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS);

						globalUser = user;
					}
					else {

						const { email, password } = credentials as {
							email?: string;
							password?: string;
						};

						if(!email?.trim() || !password?.trim()) {
							throw new Error("All fields are required");
						}

						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if(!emailRegex.test(email)) {
							throw new Error("Invalid email format");
						}

						const user = await User.findOne({ email });
						if(!user) {
							throw new Error("No user found with this email");
						}

						if(!(await user.isPasswordCorrect(password))) {
							throw new Error("Invalid user credentials");
						}

						if (user.isDeleted) {
							throw new Error("Account is scheduled for deletion. Please recover it from your email.");
						}
						if (user.isDeactivated) {
							throw new Error("This account has been permanently deactivated. Please contact support.");
						}

						// const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

						// const cookieStore = await cookies();
						// cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
						// cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS);

						globalUser = user;
					}

					// update login info
					const ip = request?.headers.get("x-forwarded-for") || "";
					const userAgent = request?.headers.get("user-agent") || "";
					await User.updateOne(
						{ _id: globalUser._id },
						{ 
							$set: { lastLoginAt: new Date(), lastActiveAt: new Date(), ipAddress: ip, userAgent },
							$inc: { loginCount: 1 } 
						}
					);
					return sanitizeUser(globalUser);
				} catch(error) {
					return null;
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		}),
		GithubProvider({
			clientId: process.env.AUTH_GITHUB_ID!,
			clientSecret: process.env.AUTH_GITHUB_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 7,	// 7 days
	},
	secret: process.env.JWT_SECRET as string,
	pages: {
		signIn: '/auth',
		error: '/error',
	},
	callbacks: {
		async jwt({ token, user, account }) {

			await connectDB();
			try {
				if(user) {

					const existingUser = await User.findOne({ email: user.email });
					if(!existingUser) {
						if(account?.provider !== "credentials") {

							const { name, email, image } = user as {
								name?: string;
								email?: string;
								image?: string;
							};

							if(!name?.trim() || !email?.trim()) {
								throw new Error("All fields are required");
							}

							// OAuth's signup flow
							const newUser = new User({
								username: name?.trim(),
								email: email,
								avatar: image ? image : generatePlaceholder(name),
								authProvider: account?.provider,
								providerId: account?.providerAccountId,
								isVerified: true,
								emailVerifiedAt: new Date(),
							});

							const createdUser = await newUser.save();
							if(!createdUser) {
								throw new Error("Failed to create user");
							}

							const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
							const disciplinePageLink = `${baseUrl}/disciplines`;

							await sendWelcomeEmail(
								email,
								name,
								disciplinePageLink
							);

							// I assumed that the token's means the login flow handle by the auth.js

							const sanitizedUser = sanitizeUser(createdUser);
							token.id = sanitizedUser.id;
							token.username = sanitizedUser.username;
							token.email = sanitizedUser.email;
							token.role = sanitizedUser.role;
							token.authProvider = sanitizedUser.authProvider;
							token.avatar = sanitizedUser.avatar;
							token.isVerified = sanitizedUser.isVerified;
						}
					}
					else {

						if(account?.provider !== "credentials") {

							// OAuth's login flow
							const sanitizedUser = sanitizeUser(existingUser);
							token.id = sanitizedUser.id;
							token.username = sanitizedUser.username;
							token.email = sanitizedUser.email;
							token.role = sanitizedUser.role;
							token.authProvider = sanitizedUser.authProvider;
							token.avatar = sanitizedUser.avatar;
							token.isVerified = sanitizedUser.isVerified;
						}
						else {

							// credential's login/signup flow
							token.id = user.id;
							token.username = user.username;
							token.email = user.email;
							token.role = user.role;
							token.authProvider = user.authProvider;
							token.avatar = user.avatar;
							token.isVerified = user.isVerified;
						}
					}
				}
				return token;
			} catch(error) {
				return token;
			}
		},
		async session({ session, token }) {

			if(token) {

				session.user.id = token.id;
				session.user.username = token.username;
				session.user.email = token.email;
				session.user.role = token.role;
				session.user.authProvider = token.authProvider;
				session.user.avatar = token.avatar;
				session.user.isVerified = token.isVerified;
			}
			return session;
		},
	},
	events: {
		signIn: async(message) => {

			await connectDB();
			try {

				// For OAuth signins, we may want to update lastLogin info (no IP available here).
				const email = (message.user?.email || "").toString().toLowerCase();
				if (!email) return;

				if(message.account?.provider !== "credentials") {

					const found = await User.findOne({ email });
					if(found) {

						await found.updateOne({
							$set: {
								lastLoginAt: new Date(), lastActiveAt: new Date()
							},
							$inc: {
								loginCount: 1
							},
						});
					}
				}
			} catch(error) {
				return;
			}
		},
		signOut: async(message) => {

			await connectDB();
			try {
				if("token" in message && message.token?.id) {

					await User.findByIdAndUpdate(
						message.token?.id,
						{
							logoutAt: new Date(),
							lastActiveAt: new Date(),
							$unset: { refreshToken: "" },
						}
					);
				}
			} catch(error) {
				return;
			}
		},
	},
};