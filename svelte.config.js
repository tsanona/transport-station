import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import fs from "node:fs";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: (() => {
      const nodeAdapter = adapter();
      return {
        ...nodeAdapter,
        adapt: async (builder) => {
          await nodeAdapter.adapt(builder);

          // In the production server we don't need the devDependencies,
          // but currently there is no way to skip them in "deno install"
          // cf. https://github.com/denoland/deno/issues/26121
          // this is a brute force workaround to remove them from package.json
          fs.copyFileSync("deno.lock", "build/deno.lock");
          const packageData = JSON.parse(
            fs.readFileSync("package.json", "utf-8"),
          );
          delete packageData.devDependencies;
          fs.writeFileSync(
            "build/package.json",
            JSON.stringify(packageData),
            "utf-8",
          );
        },
      };
    })(),
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

export default config;
