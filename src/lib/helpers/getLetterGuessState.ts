import { derived } from 'svelte/store'
import type { Readable } from 'svelte/store'
import WordStore from '~/lib/stores/WordStore'
import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
import { normalizeWord } from '~/lib/helpers/utils'

export function getLetterGuessStateFromGuess(
	word: string,
	letter: string,
	letterPosition: number
): LETTER_GUESS_STATES {
	letter = normalizeWord(letter)
	word = normalizeWord(word)

	if (word[letterPosition] === letter) {
		return LETTER_GUESS_STATES.REVEALED_CORRECT
	}
	if (word.includes(letter)) {
		return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	}
	return LETTER_GUESS_STATES.REVEALED_NO_MATCH
}

export function getLetterAbsoluteGuessState(
	letter: string
): Readable<LETTER_GUESS_STATES> {
	return derived(
		[WordStore.pastGuesses, WordStore.word],
		([pastGuesses, word]) => {
			letter = normalizeWord(letter)
			word = normalizeWord(word)
			pastGuesses = pastGuesses.map((guess) => normalizeWord(guess))

			if (!pastGuesses.join('').includes(letter)) {
				return LETTER_GUESS_STATES.NOT_REVEALED
			}

			for (const guess of pastGuesses) {
				for (const letterPosition in guess.split('')) {
					if (guess[letterPosition] === letter) {
						if (
							getLetterGuessStateFromGuess(
								word,
								letter,
								parseInt(letterPosition)
							) === LETTER_GUESS_STATES.REVEALED_CORRECT
						) {
							return LETTER_GUESS_STATES.REVEALED_CORRECT
						}
					}
				}
			}

			if (word.includes(letter) && pastGuesses.join('').includes(letter)) {
				return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
			}

			return LETTER_GUESS_STATES.REVEALED_NO_MATCH
		}
	)
}
