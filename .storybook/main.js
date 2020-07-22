module.exports = {
	stories: ['../stories/**/*.(tsx|mdx)'],
	addons: ['@storybook/addon-actions', '@storybook/addon-links',  '@storybook/addon-docs'],
	webpackFinal: async config => {
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
				},
				// Optional
				{
					loader: require.resolve('react-docgen-typescript-loader'),
				},
			],
		});
		config.resolve.extensions.push('.ts', '.tsx');
		return config;
	},
	};

