import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const VerificationSuccessModal = ({ isOpen }: { isOpen: boolean }) => {
	
	if (!isOpen) return null;
	const [countdown, setCountdown] = useState(3);

	useEffect(() => {
		if (countdown > 0) {
			
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	return (
		<div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
			<div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 text-center">
				<div className="mx-auto bg-green-100 h-16 w-16 flex items-center justify-center rounded-full">
					<CheckCircle className="h-10 w-10 text-green-600" />
				</div>
				<h2 className="text-2xl font-bold text-black mt-6">You are verified!</h2>
				<p className="mt-2 text-gray-600">
					Redirecting you to your dashboard in {countdown}...
				</p>
			</div>
		</div>
	);
};

export default VerificationSuccessModal;