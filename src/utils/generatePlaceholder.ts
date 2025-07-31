const generatePlaceholder = (fullname: string): string => {
	
	const parts = fullname.trim().split(' ');
	const first = parts[0]?.[0] ?? '';
	const second = parts[1]?.[0] ?? '';
	const initials = second ? `${first}${second}` : first;

	return `https://placehold.co/100x100/E2E8F0/4A5568?text=${initials}`;
};

export { generatePlaceholder };