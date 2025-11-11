import antfu from "@antfu/eslint-config";

export default antfu({
  type: "lib",
  stylistic: {
    semi: true,
    indent: 2,
    quotes: "double",
    overrides: {
      "style/arrow-parens": ["error", "always"],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "ts/consistent-type-definitions": ["error", "type"],
    },
  },
  formatters: true,
  unocss: true,
  vue: false,
  react: true,
  rules: {
    "react-hooks/exhaustive-deps": ["off"],
    // 在本库的实现中，会在渲染阶段读取 ref 的 current 以构造缓存列表，这属于可控行为
    // 关闭 react-hooks/refs 以避免误报
    "react-hooks/refs": ["off"],
  },
  ignores: [
    "archived/**/*",
  ],
});
