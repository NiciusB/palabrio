import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
import { normalizeWord } from '~/lib/helpers/utils'

export function getLetterGuessStateFromGuess(
	word: string,
	guess: string,
	letterPosition: number
): LETTER_GUESS_STATES {
	word = normalizeWord(word)
	guess = normalizeWord(guess)

	if (word[letterPosition] === guess[letterPosition]) {
		return LETTER_GUESS_STATES.REVEALED_CORRECT
	}

	if (!word.includes(guess[letterPosition])) {
		return LETTER_GUESS_STATES.REVEALED_NO_MATCH
	}

	const letterCountInWord = (
		word.match(new RegExp(guess[letterPosition], 'g')) || []
	).length

	const correctLetterGuessesCount = [...guess]
		.map(
			(_, index) =>
				guess[index] === word[index] && guess[index] === guess[letterPosition]
		)
		.reduce((prev, curr) => prev + (curr ? 1 : 0), 0)

	const letterCountInGuessBeforeThisLetter = (
		guess
			.slice(0, letterPosition)
			.match(new RegExp(guess[letterPosition], 'g')) || []
	).length

	if (
		letterCountInWord <= correctLetterGuessesCount ||
		letterCountInWord <= letterCountInGuessBeforeThisLetter
	) {
		return LETTER_GUESS_STATES.REVEALED_NO_MATCH
	}

	return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
}

export function getLetterAbsoluteGuessState(
	pastGuesses: string[],
	word: string,
	letter: string
): LETTER_GUESS_STATES {
	letter = normalizeWord(letter)
	word = normalizeWord(word)
	pastGuesses = pastGuesses.map((guess) => normalizeWord(guess))

	if (!pastGuesses.join('').includes(letter)) {
		return LETTER_GUESS_STATES.NOT_REVEALED
	}

	for (const guess of pastGuesses) {
		for (const letterPosition in guess.split('')) {
			if (
				guess[letterPosition] === letter &&
				getLetterGuessStateFromGuess(word, guess, parseInt(letterPosition)) ===
					LETTER_GUESS_STATES.REVEALED_CORRECT
			) {
				return LETTER_GUESS_STATES.REVEALED_CORRECT
			}
		}
	}

	if (word.includes(letter) && pastGuesses.join('').includes(letter)) {
		return LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	}

	return LETTER_GUESS_STATES.REVEALED_NO_MATCH
}
