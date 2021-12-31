import { register, init, getLocaleFromNavigator, _ } from 'svelte-i18n'
import { get } from 'svelte/store'

const languagesImport = import.meta.glob('../translations/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717
const languagesList = Object.fromEntries(
	Object.entries(languagesImport).map(([file, importFn]) => [
		(/\/(\w*?)\.json/.exec(file) ?? [])[1],
		importFn,
	])
)

Object.keys(languagesList).forEach((lang) => {
	register(lang, languagesList[lang])
})

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
})

export const $_ = get(_)
