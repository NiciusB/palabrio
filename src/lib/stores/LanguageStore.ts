import { writable, get, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import languageNames from '~/lib/helpers/languageNames.json'
import {
	convertWritableToReadable,
	normalizeWord,
	randomFromArray,
} from '~/lib/helpers/utils'
import { COLUMNS } from '~/lib/stores/GameStore'
import _dictionariesMap from '~/assets/dictionariesMap.json'

const dictionariesMap: {[key: string]: string[]}  = _dictionariesMap

const dictionariesList = Object.keys(dictionariesMap)

let initialDictionaryLanguage = navigator.language.split('-')[0]
if (!dictionariesList.includes(initialDictionaryLanguage)) {
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

	if (!dictionariesList.includes(language)) {
		throw Error(`Dictionary not available: ${language}`)
	}

	COLUMNS.set(letterCount)

	const dictionaryFiles: string[][] = await Promise.all(
		dictionariesMap[language]
		.filter(dictFile => dictFile.startsWith(`${letterCount}_`))
		.map(dictFile => fetch(
			`/dictionaries/${language}/${dictFile}.json`
		).then((res) => res.json()))
		)
	const newDict = dictionaryFiles.flat()
	
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
	dictionariesList,
	getLanguageName,
	generateRandomWord,
	loadDictionary,
}
export default LanguageStore
