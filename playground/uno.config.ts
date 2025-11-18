import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTypography()],
  shortcuts: {
    btn: "appearance-none px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 hover:shadow-lg transition-all",
    badge: "px-3 py-1 rounded-full bg-slate-100 border border-slate-200",
    card: "p-4 border border-slate-200 rounded-2xl bg-white/85 shadow-lg",
    panel: "my-4 p-4 border border-slate-200 rounded-2xl bg-white/85 shadow-lg",
    container: "max-w-[1120px] mx-auto px-4",
  },
});
