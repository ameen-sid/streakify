import React from "react";

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
		viewBox="0 0 200 200"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		{...props}
    >
		<path
			d="M85 145C65 145 50 130 50 110C50 90 65 75 85 75"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M85 75C105 75 115 90 115 110C115 130 105 145 85 145"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M85 110H115"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M100 75V55"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M70 92.5H85"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 92.5H130"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M70 127.5H85"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 127.5H130"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 45L135 65L165 35"
			stroke="black"
			strokeWidth="10"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
		/>
	</svg>
);

export default Logo;