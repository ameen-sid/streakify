import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_OPTIONS } from "./constant";

interface JWTPayload {
  _id: string;
  email: string;
  username: string;
  avatar: string;
}

export const middleware = async (request: NextRequest) => {
	
	// const path = request.nextUrl.pathname;
	// const isPublicPath = path === '/signup' || path === '/verify-email' || path === '/login' || path === '/reset-password-email' || path === '/reset-password' || path === '/player-profile/:path*' || path === '/leaderboard' || path === '/achievements' || path === '/join-team' || path === '/all-players';
	
	const token = request.cookies.get("accessToken")?.value;
	if(!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {

		const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
		const { payload } = await jwtVerify(token, secret);
    	const user = payload as unknown as JWTPayload;

		const response = NextResponse.next();
		response.cookies.set("user-id", user._id, COOKIE_OPTIONS);
		response.cookies.set("user-avatar", user.avatar, COOKIE_OPTIONS);

		return response;
	} catch(error: any) {

		console.error("JWT verification failed", error.message);
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// if(isPublicPath && token) {
		// return NextResponse.redirect(new URL('/', request.url));
	// }

	// if(!isPublicPath && !token) {
		// return NextResponse.redirect(new URL('/login', request.url));
	// }
}

export const config = {
	matcher: [
		'/dashboard/:path*',
	]
}