import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
	'/auth',
	'/verify-email/token',
	'/forgot-password',
	'/reset-password/token',
	'/reset-password/success',
	'/recover-account/token',
];

const isPublicRoute = (path: string): boolean => {

	if(PUBLIC_PATHS.includes(path))	return true;
	return (
		path.startsWith('/verify-email/') ||
		path.startsWith('/reset-password/') ||
		path.startsWith('/recover-account/')
	);
}

const isPrivateRoute = (path: string): boolean => {
	return (
		path.startsWith('/logs/') ||
		path.startsWith('/disciplines/') ||
		path.startsWith('/dashboard/')
	);
}

const isOldRoute = (path: string): boolean => {

	const oldRoutes = ['/signup', '/signup/confirmation', '/login'];
	if(oldRoutes.includes(path))	return true;
	return false;
}

export const middleware = async (request: NextRequest) => {

	const { pathname } = request.nextUrl;
	const token = request.cookies.get("authjs.session-token")?.value || request.cookies.get("__Secure-authjs.session-token")?.value;

	// if user try to go old pages then redirect to home
	if(isOldRoute(pathname)) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	const userLoggedIn = !!token;
	const publicRoute = isPublicRoute(pathname);
	const privateRoute = isPrivateRoute(pathname);

	// if user is logged in and tries to access public pages, redirect to home
	if(userLoggedIn && publicRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// if user is not logged in and tries to access private pages, redirect to login
	if(!userLoggedIn && privateRoute) {
		return NextResponse.redirect(new URL("/auth", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Neutral Paths (neurtal paths are those, in which user can go irrespective of login)
		'/',
		'/contact-us',
		'/about-us',

		// Public Paths (public paths are those, in which user can go after login)
		'/auth',
		'/verify-email/:path*',
		'/forgot-password',
		'/reset-password/:path*',
		'/recover-account/:path*',
		
		// Private Paths (private paths are those, in which user can go after login)
		'/logs/:path*',
		'/disciplines/:path*',
		'/dashboard/:path*',
		
		// Old paths
		'/signup/:path*',
		'/login',
	],
};