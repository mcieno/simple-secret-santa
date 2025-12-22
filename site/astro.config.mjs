import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  base: process.env.PUBLIC_BASE_URL || "/",
  integrations: [solidJs()],
  server: {
    allowedHosts: true,
  },
});
