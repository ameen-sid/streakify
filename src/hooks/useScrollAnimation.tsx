const useScrollAnimation = () => {
	return {
		initial: { opacity: 0, y: 50 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.6 },
	};
};

export default useScrollAnimation;