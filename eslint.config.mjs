import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([{
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
        globals: globals.browser,
    },
    plugins: {
        js,
    },
    extends: ["js/recommended"],
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-console": ["warn", { "allow": ["error", "table"] }],
        "eqeqeq": "error",
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
        "space-infix-ops": "error",
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "newline-before-return": "error",
        "prefer-const": "error",
        "no-var": "error",
        "camelcase": ["error", { "properties": "never" }],
        "no-trailing-spaces": "error",
        "curly": ["error", "multi-line", "consistent"],
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "*", "next": "return" },
            { "blankLine": "any", "prev": "if", "next": "return" },
            { "blankLine": "any", "prev": "block", "next": "return" },

            { "blankLine": "always", "prev": ["const", "let"], "next": "for" },
            { "blankLine": "always", "prev": ["const", "let"], "next": "if" },
        ],
        "max-depth": ["error", { "max": 2 }],
        "no-lonely-if": "error",
    },
},
{
    files: ["src/assets/js/config.js"],
    rules: {
        "no-unused-vars": "off",
    },
},
]);