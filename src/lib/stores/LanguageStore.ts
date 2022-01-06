import { writable, get, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import languageNames from '~/lib/helpers/languageNames.json'
import {
	convertWritableToReadable,
	normalizeWord,
	randomFromArray,
} from '~/lib/helpers/utils'
import { COLUMNS } from '~/lib/stores/GameStore'

const dictionariesImport = import.meta.glob('../../dictionaries/**/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717

const dictionaryLanguagesList = new Set<string>()
const dictionariesList = Object.fromEntries(
	Object.entries(dictionariesImport).map(([file, importFn]) => {
		const [, letterCount, lang] = /\/(\d+)\/(\w+)\.json/.exec(file) ?? []
		dictionaryLanguagesList.add(lang)
		return [`${letterCount}-${lang}`, importFn]
	})
)

let initialDictionaryLanguage = navigator.language.split('-')[0]
if (!dictionariesList[`${5}-${initialDictionaryLanguage}`]) {
	initialDictionaryLanguage = 'en'
}

const dictionaryLanguage: Writable<string> = writable(initialDictionaryLanguage)
const dictionary: Writable<string[]> = writable([])
const keyboardLetters: Writable<string[]> = writable([])

let lastDictLetterCount: number
let lastDictLang: string
async function loadDictionary(letterCount: number, language?: string) {
	language = language ?? get(dictionaryLanguage)

	if (lastDictLetterCount === letterCount && lastDictLang === language) {
		// Same dictionary already loaded
		return
	}
	lastDictLetterCount = letterCount
	lastDictLang = language

	if (!dictionariesList[`${letterCount}-${language}`]) {
		throw Error(
			`Dictionary not available: ${language} with ${letterCount} letters`
		)
	}

	COLUMNS.set(letterCount)
	const newDict = (await dictionariesList[`${letterCount}-${language}`]())
		.default
	dictionary.set(newDict)
	dictionaryLanguage.set(language)
	recalculateKeyboardLetters()
}

function recalculateKeyboardLetters() {
	let uniqueLetters = [...new Set(get(dictionary).join(''))]
	uniqueLetters = [
		...new Set(uniqueLetters.map((letter) => normalizeWord(letter))),
	]
	keyboardLetters.set(uniqueLetters)
}

function getLanguageName(code: string): string {
	return (languageNames as { [key: string]: string })[code] ?? code
}

const normalizedDictionary = derived(dictionary, (arr) =>
	arr.map((word) => normalizeWord(word))
)

function generateRandomWord(
	prng: (() => number) | undefined = undefined
): string {
	return randomFromArray(get(LanguageStore.dictionary), prng)
}

const LanguageStore = {
	normalizedDictionary,
	dictionaryLanguage: convertWritableToReadable(dictionaryLanguage),
	dictionary: convertWritableToReadable(dictionary),
	keyboardLetters: convertWritableToReadable(keyboardLetters),
	dictionaryLanguagesList,
	getLanguageName,
	generateRandomWord,
	loadDictionary,
}
export default LanguageStore
