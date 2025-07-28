import React, { ReactNode } from "react";

const AuthCard = ({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) => (
	<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
		<div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
			<div className="bg-black text-white p-4 rounded-full mb-6">
				{icon}
			</div>
			<main className="flex-grow flex flex-col items-center w-full">
				<h1 className="text-3xl font-bold text-black">{title}</h1>
				{children}
			</main>
		</div>
	</div>
);

export default AuthCard;