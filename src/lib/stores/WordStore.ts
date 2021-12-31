import { writable, get } from 'svelte/store'
import LanguageStore from '~/lib/stores/LanguageStore'
import { convertWritableToReadable, randomFromArray } from '~/lib/helpers/utils'
import AlertStore from '~/lib/ui/alerts/stores/AlertStore'
import { $_ } from '~/lib/i18n'
import GAME_STATES from '~/lib/enums/GAME_STATES'

const MAX_GUESS_LENGTH = 5
const MAX_GUESSES = 5

const word = writable('')
const gameState = writable(GAME_STATES.IN_PROGRESS)

function generateWord() {
	const newWord = randomFromArray(get(LanguageStore.dictionaryArray))

	guess.set('')
	pastGuesses.set([])
	word.set(newWord)
	gameState.set(GAME_STATES.IN_PROGRESS)
}

const guess = writable('')
const pastGuesses = writable([] as string[])

function submitGuess() {
	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length !== MAX_GUESS_LENGTH) {
		AlertStore.addAlert(
			$_('alert.words_need_to_have_n_letters', {
				values: { n: MAX_GUESS_LENGTH },
			})
		)
		return false
	}

	if (!get(LanguageStore.normalizedDictionaryArray).includes(get(guess))) {
		AlertStore.addAlert($_('alert.word_not_in_our_list'))
		return false
	}

	pastGuesses.set([...get(pastGuesses), get(guess)])
	guess.set('')

	if (get(pastGuesses)[get(pastGuesses).length - 1] === get(word)) {
		gameState.set(GAME_STATES.WON)
	} else if (get(pastGuesses).length >= MAX_GUESSES) {
		gameState.set(GAME_STATES.LOST)
	}

	return true
}

function addLetterToGuess(letter: string) {
	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length === MAX_GUESS_LENGTH) {
		AlertStore.addAlert(
			$_('alert.words_need_to_have_n_letters', {
				values: { n: MAX_GUESS_LENGTH },
			})
		)
		return false
	}

	guess.set(get(guess) + letter)
	return true
}
function removeLastLetterGuess() {
	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length === 0) {
		return false
	}

	guess.set(get(guess).slice(0, -1))
	return true
}

const WordStore = {
	word: convertWritableToReadable(word),
	guess: convertWritableToReadable(guess),
	pastGuesses: convertWritableToReadable(pastGuesses),
	gameState: convertWritableToReadable(gameState),
	submitGuess,
	addLetterToGuess,
	removeLastLetterGuess,
	generateWord,
}

export default WordStore
