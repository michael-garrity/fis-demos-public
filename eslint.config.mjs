import json from "@eslint/json";
import markdown from "@eslint/markdown";
import nextTs from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    extends: ["markdown/recommended"],
  },
  {
    rules: {
      "eol-last": ["error", "always"],
    },
  },
  globalIgnores([
    ".next/**",
    "build/**",
    "coverage/**",
    "html/**",
    "next-env.d.ts",
    "out/**",
    "**/*.spec.tsx",
  ]),
]);

export default eslintConfig;
