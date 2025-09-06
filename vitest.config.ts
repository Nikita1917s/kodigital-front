import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
    },
  })
);
