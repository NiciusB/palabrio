import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
import { HunspellReader } from 'hunspell-reader'
import fse from 'fs-extra'

const MIN_DICTIONARY_WORDS = 5000
const FILTER_WORD_LENGTH = 5

const distDir = path.join(__dirname, 'dist')
const appSrcDictionariesDir = path.join(__dirname, '..', 'src', 'dictionaries')
const dictionariesSourceDir = path.join(
	__dirname,
	'node_modules',
	'dictionaries',
	'dictionaries'
)

const shouldSkipExisting = argv.skipExisting

const allLangs = fs
	.readdirSync(dictionariesSourceDir)
	.filter((locale) => !locale.includes('-')) // Skip varieties for now, maybe we could include and merge the new words them in the future
	.filter((locale) => locale !== 'cs') // Disable CS for now, since affix is broken: https://github.com/wooorm/nspell/issues/5
	.filter((locale) => locale !== 'eu') // Disable EU for now, since it seems to be stuck in an infinite loop
	.filter((locale) => locale !== 'rw') // Disable RW for now, since it seems to be stuck in an infinite loop
	.filter((locale) => locale !== 'hu') // Disable HU for now, since it seems to consume too much memory and crash
	.filter((locale) => locale !== 'ko') // Disable KO for now, since it seems to consume too much memory and crash
	.filter((locale) => locale !== 'hyw') // Disable HYW since it's repeated for HY

async function main() {
	console.log(`🤠 Starting...`)

	for (const index in allLangs) {
		const lang = allLangs[index]
		if (shouldSkipExisting && doesDictionaryFileAlreadyExist(lang)) {
			console.log(
				`✨ (${index}/${allLangs.length}) Skipping ${lang} since it already exists`
			)
			continue
		}

		console.log(`✨ (${index}/${allLangs.length}) Processing ${lang}`)
		const affFile = path.join(dictionariesSourceDir, lang, 'index.aff')
		const dicFile = path.join(dictionariesSourceDir, lang, 'index.dic')

		let words: string[]
		try {
			const reader = await HunspellReader.createFromFiles(affFile, dicFile)

			words = reader
				.wholeWords()
				.filter((word) => filterWord(word))
				.toArray()
		} catch (error) {
			console.error(
				new Error(`👎 Something went wrong with ${lang}: \n` + error)
			)
			words = []
		}
		const wordsCount = words.length

		if (wordsCount < MIN_DICTIONARY_WORDS) {
			console.log(
				`💥 ${lang} has not enough words ${wordsCount} / ${MIN_DICTIONARY_WORDS}`
			)
			continue
		}

		saveDictionary(lang, words)
		console.log(`📝 ${lang} processed and saved, with ${wordsCount} words`)
	}

	console.log(`🤠 All languages processed!`)

	await fse.copy(distDir, appSrcDictionariesDir)

	console.log(`🤠 Copied all dictionaries to app dictionaries folder`)
}

main()

const LETTER_BLACKLIST = new RegExp(
	'[' +
		'1234567890\\- \'"’.' +
		'₁₂₃₄₅₆₇₈₉₀₊₋₌₍₎' +
		'⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾' +
		'ᴬᴭᴮᴯᴰᴱᴲᴳᴴᴵᴶᴷᴸᴹᴺᴻᴼᴽᴾᴿᵀᵁᵂᵃᵄᵅᵆᵇᵈᵉᵊᵋᵌᵍᵎᵏᵐᵑᵒᵓᵔᵕᵖᵗᵘᵙᵚᵛᵜ' +
		']'
)

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
