import { vitePreprocess } from "@sveltejs/kit/vite";
import vercel from "@sveltejs/adapter-vercel";

//const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({})],

  kit: {
    adapter: vercel({}),
    paths: {
      base: "",
      assets: "", // dev ? '/Users/peter.organisciak/Documents/projects/organisciak.github.io/static' : '',
    },
    appDir: "internal",
  },
};

export default config;
