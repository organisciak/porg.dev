import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// 85% chance for /1 (classic), 15% chance for /2 (SNES)
	const destination = Math.random() < 0.85 ? '/1' : '/2';
	throw redirect(302, destination);
};
