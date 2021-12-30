import fs from 'fs'
import path from 'path'
import { HunspellReader } from 'hunspell-reader'
import { workerData } from 'worker_threads'

const MIN_DICTIONARY_WORDS = 5000
const MIN_LETTER_COUNT = 5
const FILTER_WORD_LENGTH = 5

const lang = workerData.lang
const distDir = workerData.distDir
const dictionariesSourceDir = workerData.dictionariesSourceDir
const shouldSkipExisting = workerData.shouldSkipExisting

async function main() {
	if (shouldSkipExisting && doesDictionaryFileAlreadyExist(lang)) {
		console.log(`✨ Skipping ${lang} since it already exists`)
		return
	}

	console.log(`✨ Processing ${lang}`)
	const affFile = path.join(dictionariesSourceDir, lang, 'index.aff')
	const dicFile = path.join(dictionariesSourceDir, lang, 'index.dic')

	let words: string[]
	try {
		const reader = await HunspellReader.createFromFiles(affFile, dicFile)

		words = reader
			.wholeWords()
			.filter((word) => filterWord(word))
			.toArray()
		words = filterOutUncommonLetters(words)
	} catch (error) {
		console.error(new Error(`👎 ${lang} Something went wrong: \n` + error))
		words = []
	}

	if (words.length < MIN_DICTIONARY_WORDS) {
		console.log(
			`💥 ${lang} has not enough words ${words.length} / ${MIN_DICTIONARY_WORDS}`
		)
		return
	}

	saveDictionary(lang, words)
	console.log(`📝 ${lang} processed and saved, with ${words.length} words`)
}

main()

const LETTER_BLACKLIST = new RegExp(
	'[' +
		'1234567890\\-+ \'"`’.,:;\\\\·!' +
		'₁₂₃₄₅₆₇₈₉₀₊₋₌₍₎' +
		'⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾' +
		'ᴬᴭᴮᴯᴰᴱᴲᴳᴴᴵᴶᴷᴸᴹᴺᴻᴼᴽᴾᴿᵀᵁᵂᵃᵄᵅᵆᵇᵈᵉᵊᵋᵌᵍᵎᵏᵐᵑᵒᵓᵔᵕᵖᵗᵘᵙᵚᵛᵜ' +
		']'
)

function filterOutUncommonLetters(words: string[]): string[] {
	const letterDistribution: { [key: string]: number } = {}
	for (let word of words) {
		word = normalizeWord(word)
		for (const letter of word) {
			letterDistribution[letter] = (letterDistribution[letter] ?? 0) + 1
		}
	}

	const blackListedLetters = []
	for (const letter in letterDistribution) {
		if ('abcdefghijklmnopqrstuvwxyz'.includes(letter)) {
			continue
		}
		if (letterDistribution[letter] < MIN_LETTER_COUNT) {
			blackListedLetters.push(letter)
		}
	}

	if (blackListedLetters.length) {
		console.log(
			`🔧 ${lang} Removing words with these letters since they are too uncommon: ${blackListedLetters.join(
				', '
			)}`
		)

		const filter = new RegExp(`[${blackListedLetters.join('')}]`, 'i')
		return words.filter((word) => !filter.test(word))
	}

	return words
}

function filterWord(word: string): boolean {
	if (word.length !== FILTER_WORD_LENGTH) {
		return false
	}
	if (LETTER_BLACKLIST.test(word)) {
		return false
	}
	return true
}

function doesDictionaryFileAlreadyExist(lang: string) {
	const filePath = path.join(distDir, lang + '.json')
	return fs.existsSync(filePath)
}

function saveDictionary(lang: string, words: string[]) {
	fs.mkdirSync(distDir, { recursive: true })
	const filePath = path.join(distDir, lang + '.json')
	fs.writeFileSync(filePath, JSON.stringify(words))
}

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
