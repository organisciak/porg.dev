import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import vercel from "@sveltejs/adapter-vercel";
import { mdsvex } from "mdsvex";

//const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [
    vitePreprocess({}),
    mdsvex({
      extensions: ['.svx', '.md']
      // Remove layout for now to simplify
    })
  ],

  kit: {
    adapter: vercel({}),
    paths: {
      base: "",
      assets: "", // dev ? '/Users/peter.organisciak/Documents/projects/organisciak.github.io/static' : '',
    },
    appDir: "internal",
    alias: {
      $posts: 'src/posts'
    }
  },
};

export default config;
