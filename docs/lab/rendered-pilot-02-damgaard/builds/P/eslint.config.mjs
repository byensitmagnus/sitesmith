import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // lib/content.js and lib/validation.js are plain CommonJS on purpose: both are
    // `require()`d directly by plain `node` in lib/validation.test.mjs (via
    // createRequire) so the validation logic has a zero-dependency, framework-free
    // self-check, per package.json's "test" script. Converting them to ESM would
    // either need "type":"module" (untested against the Next.js build here) or a
    // .mjs rename that breaks that direct Node import path.
    files: ["lib/content.js", "lib/validation.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
