module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "jest"],
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	ignorePatterns: [
		"out",
		"tmp",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:jest/recommended"
	],
};
