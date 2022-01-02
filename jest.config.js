export default {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true,
			},
		],
		'^.+\\.js$': 'babel-jest',
		'^.+\\.ts$': 'babel-jest',
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
