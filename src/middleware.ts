import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  '/',
  '/signup',
  '/signup/confirmation',
  '/verify-email',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/reset-password/success',
  '/recover-account',
];

const isPublicRoute = (path: string): boolean => {

	if(PUBLIC_PATHS.includes(path))	return true;

	return (
		path.startsWith('/verify-email/') ||
		path.startsWith('/reset-password/') ||
		path.startsWith('/recover-account/')
	);
}

export const middleware = async (request: NextRequest) => {
	
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("accessToken")?.value;

	const userLoggedIn = !!token;
	const publicRoute = isPublicRoute(pathname);

	// if user is logged in and tries to access public pages, redirect to home
	if(userLoggedIn && publicRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// if user is not logged in and tries to access private pages, redirect to login
	if(!userLoggedIn && !publicRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/profile/:path*',
		'/disciplines/:path*',
		'/logs/:path*',
	],
};