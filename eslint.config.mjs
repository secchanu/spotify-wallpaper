import { fixupConfigRules, includeIgnoreFile } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
	includeIgnoreFile(gitignorePath),
	{
		files: ["**/*.ts", "**/*.tsx"],
	},
	...fixupConfigRules(
		compat.extends("plugin:react-hooks/recommended", "prettier"),
	),
	{
		languageOptions: {
			parser: tsParser,
		},
	},
];
