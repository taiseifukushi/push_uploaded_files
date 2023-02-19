module.exports = {
	root: true,
	extends: ["eslint:recommended"],
	plugins: ["jest"],
	ignorePatterns: ["out", "tmp"],
	extends: [
		"plugin:jest/recommended",
	],
	rules: {},
	overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
      ],
      rules: {},
    },
    {
      files: ['*.js'],
      rules: {},
    },
	]
};
