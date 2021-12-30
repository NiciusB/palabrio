import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { svelteSVG } from 'rollup-plugin-svelte-svg'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		svelteSVG({
			// optional SVGO options
			// pass empty object to enable defaults
			svgo: {},
			// vite-specific
			// https://vitejs.dev/guide/api-plugin.html#plugin-ordering
			// enforce: 'pre' | 'post'
			enforce: 'pre',
		}),
	],
	resolve: {
		alias: {
			'~': path.resolve(_dirname, './src'),
		},
	},
})
