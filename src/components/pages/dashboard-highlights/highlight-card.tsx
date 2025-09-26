import React from "react";
import { HighlightLog } from "@/app/dashboard/highlights/page";

const HighlightCard = ({ log }: { log: HighlightLog }) => (
	<div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4">
		<div className="bg-gray-100 text-black font-bold rounded-md h-12 w-12 flex flex-col items-center justify-center text-center leading-none flex-shrink-0">
			<span className="text-xs uppercase">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}</span>
			<span className="text-xl">{new Date(log.date).getUTCDate()}</span>
		</div>
		<div>
			<p className="text-gray-700 italic">&quot;{log.highlight}&quot;</p>
		</div>
	</div>
);

export default HighlightCard;