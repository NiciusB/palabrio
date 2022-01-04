import { writable, get, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import languageNames from '~/lib/helpers/languageNames.json'
import {
	convertWritableToReadable,
	normalizeWord,
	randomFromArray,
} from '~/lib/helpers/utils'

const dictionariesImport = import.meta.glob('../../dictionaries/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717

const dictionariesList = Object.fromEntries(
	Object.entries(dictionariesImport).map(([file, importFn]) => [
		(/\/(\w*?)\.json/.exec(file) ?? [])[1],
		importFn,
	])
)
const dictionaryLanguagesList = Object.keys(dictionariesList)

const dictionaryLanguage: Writable<string> = writable()
const dictionaryArray: Writable<string[]> = writable([])
const keyboardLetters: Writable<string[]> = writable([])

async function setDictionaryLanguage(newDictionaryLanguage: string) {
	if (!dictionariesList[newDictionaryLanguage]) {
		console.error(`Language not in list: ${newDictionaryLanguage}`)
		if (newDictionaryLanguage !== 'en') {
			await setDictionaryLanguage('en')
		}
		return
	}

	dictionaryArray.set(
		(
			(await dictionariesList[newDictionaryLanguage]()) as {
				default: string[]
			}
		).default
	)
	dictionaryLanguage.set(newDictionaryLanguage)

	let uniqueLetters = [...new Set(get(dictionaryArray).join(''))]
	uniqueLetters = [
		...new Set(uniqueLetters.map((letter) => normalizeWord(letter))),
	]
	keyboardLetters.set(uniqueLetters)
}

export const initialDictionaryLoadPromise = setDictionaryLanguage(
	navigator.language.split('-')[0]
)

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
}
export default LanguageStore
