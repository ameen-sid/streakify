import React from "react";

export interface Log {
	date: string;
	highlight: string;
}

const HighlightCard = ({ log }: { log: Log }) => (
	<div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4">
		<div className="bg-gray-100 text-black font-bold rounded-md h-12 w-12 flex flex-col items-center justify-center text-center leading-none flex-shrink-0">
			<span className="text-xs uppercase">{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
			<span className="text-xl">{new Date(log.date + 'T00:00:00').getDate()}</span>
		</div>
		<div>
			<p className="text-gray-700 italic">"{log.highlight}"</p>
		</div>
	</div>
);

export default HighlightCard;