import WordStore from '~/lib/stores/WordStore'
import { COLUMNS } from '~/lib/stores/GameStore'
import { get } from 'svelte/store'
import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
import share from '~/lib/helpers/share'

export default function shareGameResult(guessResultText: string, url: string) {
	const word = get(WordStore.word)
	const pastGuesses = get(WordStore.pastGuesses)

	function guessToEmojis(guess: string): string {
		let result = ''
		for (let column = 0; column < get(COLUMNS); column++) {
			result =
				result +
				{
					[LETTER_GUESS_STATES.NOT_REVEALED]: '',
					[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: '⬛',
					[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: '🟨',
					[LETTER_GUESS_STATES.REVEALED_CORRECT]: '🟩',
				}[getLetterGuessStateFromGuess(word, guess, column)]
		}

		return result
	}

	const board = pastGuesses.map((guess) => guessToEmojis(guess)).join('\n')

	const text = `${guessResultText}\n\n${board}\n\n${url}`

	share({
		text: text,
	})
}
