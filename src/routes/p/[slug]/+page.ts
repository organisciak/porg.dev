import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const { slug, postType } = data;

	const modules = import.meta.glob('/src/posts/*.{md,svx}', { eager: true });
	const path = `/src/posts/${slug}.${postType}`;
	const module = modules[path] as
		| { default: unknown; metadata?: Record<string, unknown> }
		| undefined;

	if (!module) {
		return { ...data, PostComponent: null, postMetadata: {} };
	}

	return {
		...data,
		PostComponent: module.default,
		postMetadata: module.metadata || {}
	};
};
