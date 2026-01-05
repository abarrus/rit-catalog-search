import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    appDir: "app", // Required as the default is _app
    adapter: adapter({
      fallback: "index.html", // this is supposed to make it so you can go to different pages and github pages doesnt get mad that it doesnt have a file for it
    }),
    paths: {
      base: dev ? "" : process.env.BASE_PATH,
    },
  },
  preprocess: vitePreprocess(),
};
export default config;
