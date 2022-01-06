import { writable, get, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import languageNames from '~/lib/helpers/languageNames.json'
import {
	convertWritableToReadable,
	normalizeWord,
	randomFromArray,
} from '~/lib/helpers/utils'

const dictionariesImport = import.meta.glob('../../dictionaries/**/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717

const dictionaryLanguagesList = new Set<string>()
const dictionariesList = Object.fromEntries(
	Object.entries(dictionariesImport).map(([file, importFn]) => {
		const [, letterCount, lang] = /\/(\d+)\/(\w+)\.json/.exec(file) ?? []
		dictionaryLanguagesList.add(lang)
		return [`${letterCount}-${lang}`, importFn]
	})
)

const navigationLang = navigator.language.split('-')[0]
const dictionaryLanguage: Writable<string> = writable(navigationLang)
const dictionaryArray: Writable<string[]> = writable([])
const keyboardLetters: Writable<string[]> = writable([])

let lastDictLetterCount: number
let lastDictLang: string
async function loadDictionary(letterCount: number): Promise<undefined> {
	const lang = get(dictionaryLanguage)

	if (lastDictLetterCount === letterCount && lastDictLang === lang) {
		// Dictionary already loaded
		return
	}
	lastDictLetterCount = letterCount
	lastDictLang = lang

	if (!dictionariesList[`${letterCount}-${lang}`]) {
		console.error(
			`Dictionary not available: ${lang} with ${letterCount} letters`
		)
		if (lang !== 'en') {
			setDictionaryLanguage('en')
			return await loadDictionary(letterCount)
		}
		return
	}

	dictionaryArray.set(
		(await dictionariesList[`${letterCount}-${lang}`]()).default
	)

	let uniqueLetters = [...new Set(get(dictionaryArray).join(''))]
	uniqueLetters = [
		...new Set(uniqueLetters.map((letter) => normalizeWord(letter))),
	]
	keyboardLetters.set(uniqueLetters)
}

function setDictionaryLanguage(newDictionaryLanguage: string) {
	dictionaryLanguage.set(newDictionaryLanguage)
}

function getLanguageName(code: string): string {
	return (languageNames as { [key: string]: string })[code] ?? code
}

const normalizedDictionaryArray = derived(dictionaryArray, (arr) =>
	arr.map((word) => normalizeWord(word))
)

function generateRandomWord(
	prng: (() => number) | undefined = undefined
): string {
	return randomFromArray(get(LanguageStore.dictionaryArray), prng)
}

const LanguageStore = {
	normalizedDictionaryArray,
	dictionaryLanguage: convertWritableToReadable(dictionaryLanguage),
	dictionaryArray: convertWritableToReadable(dictionaryArray),
	keyboardLetters: convertWritableToReadable(keyboardLetters),
	dictionaryLanguagesList,
	setDictionaryLanguage,
	getLanguageName,
	generateRandomWord,
	loadDictionary,
}
export default LanguageStore
