import React from "react";
import { BrainCircuit } from "lucide-react";

const SimpleHeader = () => (
	<header className="py-6">
		<div className="container mx-auto px-6 flex justify-center">
			<div className="flex items-center gap-3">
				<BrainCircuit className="w-8 h-8 text-blue-400" />
				<span className="text-2xl font-bold tracking-tight">Streakify</span>
			</div>
		</div>
	</header>
);

export default SimpleHeader;