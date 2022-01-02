import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
import {
	getLetterGuessStateFromGuess,
	getLetterAbsoluteGuessState,
} from './getLetterGuessState'

test('getLetterGuessStateFromGuess: No match', () => {
	expect(getLetterGuessStateFromGuess('abc', 'dfe', 0)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('abc', 'dfe', 1)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('abc', 'dfe', 2)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('ababab', 'abxxxx', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('aboooo', 'abxxxb', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('aboooo', 'abxxbb', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)

	expect(getLetterGuessStateFromGuess('boobo', 'bxxbb', 4)).toBe(
		LETTER_GUESS_STATES.REVEALED_NO_MATCH
	)
})

test('getLetterGuessStateFromGuess: Exact match', () => {
	expect(getLetterGuessStateFromGuess('abc', 'axx', 0)).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)

	expect(getLetterGuessStateFromGuess('abc', 'xbx', 1)).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)

	expect(getLetterGuessStateFromGuess('abc', 'xxc', 2)).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)

	expect(getLetterGuessStateFromGuess('ababab', 'xbxxxb', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)
})

test('getLetterGuessStateFromGuess: Incorrect place', () => {
	expect(getLetterGuessStateFromGuess('abc', 'bxx', 0)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('abc', 'xax', 1)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('abc', 'xxa', 2)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('ababab', 'xaxxxx', 1)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('ababab', 'xxxxxa', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('ababab', 'xaxxxa', 1)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('aboooo', 'axxxbb', 4)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('aboooo', 'axxxxb', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('bboooo', 'bxxxxb', 5)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterGuessStateFromGuess('oboboo', 'bxxxxb', 0)).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)
})

test('getLetterAbsoluteGuessState', () => {
	expect(getLetterAbsoluteGuessState(['a'], 'a', 'a')).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)

	expect(getLetterAbsoluteGuessState(['2guess', 'guess2'], 'guess2', '2')).toBe(
		LETTER_GUESS_STATES.REVEALED_CORRECT
	)

	expect(getLetterAbsoluteGuessState(['ab'], 'ba', 'b')).toBe(
		LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE
	)

	expect(getLetterAbsoluteGuessState(['ab'], 'ab', 'c')).toBe(
		LETTER_GUESS_STATES.NOT_REVEALED
	)
})
