module.exports = {
	apps: [
		{
			name: "backend",
			script: "dist/index.js",
			env: {
				NODE_ENV: "development",
			},
		},
	],
};
