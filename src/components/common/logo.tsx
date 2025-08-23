import React from "react";

const Logo = ({ className }: { className: string }) => (
	<svg
		className={className}
		viewBox="0 0 256 256"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
	>
		<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Zm-48-32a32,32,0,1,0,32,32A32.09,32.09,0,0,0,128,96Z" />
		<path
			d="M208,128a80,80,0,1,1-80-80A80.09,80.09,0,0,1,208,128Zm-80-64a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Z"
			opacity="0.2"
		/>
	</svg>
);

export default Logo;