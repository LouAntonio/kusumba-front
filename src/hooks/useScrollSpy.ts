import { useEffect, useState } from 'react';

export function useScrollSpy(ids: string[], rootMargin = '-20% 0px -70% 0px') {
	const [active, setActive] = useState<string>(ids[0] ?? '');

	useEffect(() => {
		if (ids.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				}
			},
			{ rootMargin },
		);

		for (const id of ids) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		const onScrollEnd = () => {
			const scrollY = window.scrollY + 120;
			let current = ids[0];
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.offsetTop <= scrollY) {
					current = id;
				}
			}
			setActive(current);
		};
		onScrollEnd();
		window.addEventListener('scroll', onScrollEnd, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScrollEnd);
		};
	}, [ids.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

	return active;
}
