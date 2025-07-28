import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { APP_NAME } from "@/constant";

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: APP_NAME,
	description: "Discipline Planner Application Designed and Developed by Ameen Sid",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.variable}`}>
				<Toaster position="top-center" reverseOrder={false} />
				{children}
			</body>
		</html>
	);
}