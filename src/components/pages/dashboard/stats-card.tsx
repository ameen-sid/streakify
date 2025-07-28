import React, { ReactNode } from "react";

const StatsCard = ({ icon, title, value }: { icon: ReactNode, title: string, value: string | number }) => (
	<div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-4">
		<div className="bg-gray-100 p-3 rounded-full">{icon}</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-2xl font-bold text-black">{value}</p>
		</div>
	</div>
);

export default StatsCard;