import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { APP_NAME } from "@/constant";

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: APP_NAME,
	description: `${APP_NAME} Application Designed and Developed by Ameen Sid`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.variable}`}
			>
				<Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 1000, error: { duration: 3000 } }} />
				{children}
			</body>
		</html>
	);
}