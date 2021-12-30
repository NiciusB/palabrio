import { writable, get } from 'svelte/store'
import type { Writable } from 'svelte/store'
import WordManager from '~/lib/WordManager'

const dictionariesImport = import.meta.glob('../dictionaries/*.json') // Does not support alias for now: https://github.com/vitejs/vite/issues/5717

const dictionariesList = Object.fromEntries(
	Object.entries(dictionariesImport).map(([file, importFn]) => [
		(/\/(\w*?)\.json/.exec(file) ?? [])[1],
		importFn,
	])
)

class LanguageManager {
	private _dictionaryLanguage: Writable<string | null> = writable(null)
	private _dictionaryArray: Writable<string[]> = writable([])
	private _keyboardLetters: Writable<string[]> = writable([])

	constructor(dictionaryLanguage: string) {
		this.setDictionaryLanguage(dictionaryLanguage)
	}

	get dictionaryLanguage() {
		return this._dictionaryLanguage
	}
	get dictionaryArray() {
		return this._dictionaryArray
	}
	get normalizedDictionaryArray() {
		return get(this._dictionaryArray).map((word) => normalizeWord(word))
	}
	get keyboardLetters() {
		return this._keyboardLetters
	}

	async setDictionaryLanguage(newDictionaryLanguage: string) {
		if (!dictionariesList[newDictionaryLanguage]) {
			console.error(`Language not in list: ${newDictionaryLanguage}`)
			await this.setDictionaryLanguage('en')
			return
		}

		this._dictionaryLanguage.set(newDictionaryLanguage)
		this._dictionaryArray.set(
			(
				(await dictionariesList[newDictionaryLanguage]()) as {
					default: string[]
				}
			).default
		)

		let uniqueLetters = [...new Set(get(this.dictionaryArray).join(''))]
		uniqueLetters = [
			...new Set(uniqueLetters.map((letter) => normalizeWord(letter))),
		]
		this._keyboardLetters.set(uniqueLetters)

		WordManager.generateWord()
	}

	get dictionaryLanguagesList() {
		return Object.keys(dictionariesList)
	}

	getLanguageName(code: string): string {
		return (
			{
				en: 'English',
				es: 'Español',
				fr: 'Français',
			}[code] ?? code
		)
	}
}

export default new LanguageManager(navigator.language.split('-')[0])

function normalizeWord(string: string): string {
	return (
		string
			.toLowerCase()
			.normalize('NFD')
			// Remove all diactritic, except the tilde from ñ
			.replace(/(?![\u0303])[\u0300-\u036f]/g, '')
			.normalize('NFC')
	)
}
