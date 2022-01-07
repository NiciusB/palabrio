import { writable, get } from 'svelte/store'
import LanguageStore from '~/lib/stores/LanguageStore'
import { convertWritableToReadable, normalizeWord } from '~/lib/helpers/utils'
import AlertStore from '~/lib/ui/alerts/stores/AlertStore'
import { $_ } from '~/lib/helpers/i18n'
import GAME_STATES from '~/lib/enums/GAME_STATES'
import { COLUMNS, gameState, ROWS } from '~/lib/stores/GameStore'

const word = writable('')
const guess = writable('')
const pastGuesses = writable([] as string[])

function setWord(newWord: string, maxTries = 6) {
	guess.set('')
	pastGuesses.set([])
	word.set(newWord)
	gameState.set(GAME_STATES.IN_PROGRESS)
	COLUMNS.set(newWord.length)
	ROWS.set(maxTries)
}

function submitGuess() {
	const maxGuessLength = get(COLUMNS)
	const maxGuesses = get(ROWS)

	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length !== maxGuessLength) {
		AlertStore.addAlert(
			$_('alert.words_need_to_have_n_letters', {
				values: { n: maxGuessLength },
			})
		)
		return false
	}

	if (!get(LanguageStore.normalizedDictionary).includes(get(guess))) {
		AlertStore.addAlert($_('alert.word_not_in_our_list'))
		return false
	}

	pastGuesses.set([...get(pastGuesses), get(guess)])
	guess.set('')

	const lastGuess = get(pastGuesses)[get(pastGuesses).length - 1]
	if (normalizeWord(lastGuess) === normalizeWord(get(word))) {
		gameState.set(GAME_STATES.WON)
	} else if (get(pastGuesses).length >= maxGuesses) {
		gameState.set(GAME_STATES.LOST)
	}

	return true
}

function addLetterToGuess(letter: string) {
	const maxGuessLength = get(COLUMNS)

	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length === maxGuessLength) {
		AlertStore.addAlert(
			$_('alert.words_need_to_have_n_letters', {
				values: { n: maxGuessLength },
			})
		)
		return false
	}

	guess.update((oldGuess) => oldGuess + letter)
	return true
}
function removeLastLetterGuess() {
	if (get(gameState) !== GAME_STATES.IN_PROGRESS) {
		return false
	}

	if (get(guess).length === 0) {
		return false
	}

	guess.update((oldGuess) => oldGuess.slice(0, -1))
	return true
}

const WordStore = {
	word: convertWritableToReadable(word),
	guess: convertWritableToReadable(guess),
	pastGuesses: convertWritableToReadable(pastGuesses),
	submitGuess,
	addLetterToGuess,
	removeLastLetterGuess,
	setWord,
}

export default WordStore
