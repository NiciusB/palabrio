import {
	register,
	init,
	getLocaleFromNavigator,
	_ as i18nTranslate,
} from 'svelte-i18n'
import { get } from 'svelte/store'

const languagesImport = import.meta.glob('../../translations/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717
const languagesList = Object.fromEntries(
	Object.entries(languagesImport).map(([file, importFn]) => [
		(/\/(\w*?)\.json/.exec(file) ?? [])[1],
		importFn,
	])
)

Object.keys(languagesList).forEach((lang) => {
	register(lang, languagesList[lang])
})

export const i18nInitialLoadProimse = init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
})

export const _ = i18nTranslate
export const $_ = get(_)
