import React from "react";
import { Zap } from "lucide-react";

const AiTag = () => (
    <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 ring-1 ring-inset ring-purple-200 mt-2 sm:mt-0">
		<Zap className="h-4 w-4 mr-2 text-purple-600" />
		AI-Powered
	</div>
);

export default AiTag;