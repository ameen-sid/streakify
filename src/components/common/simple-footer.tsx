import React from "react";
import { APP_NAME } from "@/constant";

const SimpleFooter = () => (
	<footer className="py-6 text-center text-gray-500 text-sm">
		&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
	</footer>
)

export default SimpleFooter;