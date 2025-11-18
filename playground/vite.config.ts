import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/react-keep-alive/" : "/", // 替换为你的仓库名称
  plugins: [react(), UnoCSS()],
}));
