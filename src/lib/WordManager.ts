import { writable, get } from 'svelte/store'
import LanguageManager from '~/lib/LanguageManager'
import { randomFromArray } from '~/lib/utils'

const MAX_GUESS_LENGTH = 5

const word = writable('')

function generateWord() {
	const newWord = randomFromArray(get(LanguageManager.dictionaryArray))

	guess.set('')
	pastGuesses.set([])
	word.set(newWord)
}

const guess = writable('')
const pastGuesses = writable([] as string[])

function submitGuess() {
	if (get(guess).length !== MAX_GUESS_LENGTH) {
		return
	}

	if (!LanguageManager.normalizedDictionaryArray.includes(get(guess))) {
		return
	}

	pastGuesses.set([...get(pastGuesses), get(guess)])
	guess.set('')
}
function addLetterToGuess(letter: string) {
	if (get(guess).length === MAX_GUESS_LENGTH) {
		return
	}
	guess.set(get(guess) + letter)
}
function removeLastLetterGuess() {
	if (get(guess).length === 0) {
		return
	}
	guess.set(get(guess).slice(0, -1))
}

const WordManager = {
	word,
	guess,
	pastGuesses,
	submitGuess,
	addLetterToGuess,
	removeLastLetterGuess,
	generateWord,
}
export default WordManager
