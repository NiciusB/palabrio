import { get } from 'svelte/store'
import WordManager from '~/lib/WordManager'
import LETTER_GUESS_STATES from '~/lib/LETTER_GUESS_STATES'

export function getLetterGuessStateFromGuess(
	letter: string,
	letterPosition: number
): LETTER_GUESS_STATES {
	if (get(WordManager.word)[letterPosition] === letter) {
		return LETTER_GUESS_STATES.REVEALED_CORRECT
	}
	if (get(WordManager.word).includes(letter)) {
		return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	}
	return LETTER_GUESS_STATES.REVEALED_NO_MATCH
}

export function getLetterAbsoluteGuessState(
	letter: string
): LETTER_GUESS_STATES {
	const pastGuesses = get(WordManager.pastGuesses)

	if (!pastGuesses.join('').includes(letter)) {
		return LETTER_GUESS_STATES.NOT_REVEALED
	}

	for (const guess of pastGuesses) {
		for (const letterPosition in guess.split('')) {
			if (guess[letterPosition] === letter) {
				if (
					getLetterGuessStateFromGuess(letter, parseInt(letterPosition)) ===
					LETTER_GUESS_STATES.REVEALED_CORRECT
				) {
					return LETTER_GUESS_STATES.REVEALED_CORRECT
				}
			}
		}
	}

	if (
		get(WordManager.word).includes(letter) &&
		pastGuesses.join('').includes(letter)
	) {
		return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	}

	return LETTER_GUESS_STATES.REVEALED_NO_MATCH
}
