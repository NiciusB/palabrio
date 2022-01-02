import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
import { normalizeWord } from '~/lib/helpers/utils'

export function getLetterGuessStateFromGuess(
	word: string,
	guess: string,
	letterPosition: number
): LETTER_GUESS_STATES {
	word = normalizeWord(word)
	guess = normalizeWord(guess)
	const guessLetter = guess[letterPosition]

	if (word[letterPosition] === guessLetter) {
		return LETTER_GUESS_STATES.REVEALED_CORRECT
	}

	if (!word.includes(guessLetter)) {
		return LETTER_GUESS_STATES.REVEALED_NO_MATCH
	}

	const letterCountInWord = (word.match(new RegExp(guessLetter, 'g')) || [])
		.length

	const letterCountInGuess = (
		guess.slice(0, letterPosition).match(new RegExp(guessLetter, 'g')) || []
	).length

	const correctLetterGuessesCount = [...guess]
		.map(
			(_, index) => guess[index] === word[index] && guess[index] === guessLetter
		)
		.reduce((prev, curr) => prev + (curr ? 1 : 0), 0)

	if (letterCountInWord <= correctLetterGuessesCount) {
		return LETTER_GUESS_STATES.REVEALED_NO_MATCH
	}

	if (letterCountInWord <= letterCountInGuess) {
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
			if (guess[letterPosition] === letter) {
				if (
					getLetterGuessStateFromGuess(
						word,
						guess,
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
