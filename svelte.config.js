import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
		  pages: 'docs',
		  assets: 'docs',
		  fallback: null,
		  precompress: false,
		}),
		paths: {
			base: '',
			assets: dev ? '/Users/peter.organisciak/Documents/projects/organisciak.github.io/static' : '',
		},
		appDir: 'internal',
	  }
};

export default config;