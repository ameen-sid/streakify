import React from "react";

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		{...props}
    >
		<path
			d="M12 2L9.44 9.44 2 12l7.44 2.56L12 22l2.56-7.44L22 12l-7.44-2.56L12 2z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18 8L16.5 5.5 14 4l2.5-1.5L18 0l1.5 2.5L22 4l-2.5 1.5L18 8z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default SparkleIcon;