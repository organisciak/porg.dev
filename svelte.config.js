import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		
		adapter: vercel({

		}),
		paths: {
			base: '',
			assets: '', // dev ? '/Users/peter.organisciak/Documents/projects/organisciak.github.io/static' : '',
		},
		appDir: 'internal',
	  }
};

export default config;
