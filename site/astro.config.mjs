import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  server: {
    allowedHosts: true,
  },
  base: process.env.SITE_BASE_PATH,
});
