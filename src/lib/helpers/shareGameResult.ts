import { isFunctionNative } from '~/lib/helpers/utils'
import GAME_STATES from '~/lib/enums/GAME_STATES'
import WordStore from '~/lib/stores/WordStore'
import { COLUMNS, gameState, ROWS } from '~/lib/stores/GameStore'
import { _ } from '~/lib/helpers/i18n'
import { get } from 'svelte/store'
import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'

export default function shareGameResult() {
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

	const tries =
		get(gameState) === GAME_STATES.WON
			? `${pastGuesses.length}/${get(ROWS)}`
			: `X/${get(ROWS)}`

	const board = pastGuesses.map((guess) => guessToEmojis(guess)).join('\n')

	const text = `Palabrio ${tries}\n${board}\n${window.location.href}`

	navigator.share({
		title: 'Palabrio',
		text: isFunctionNative(navigator.share) ? text : encodeURIComponent(text), // Needed for our navigator.share polyfill library to accept newlines
		url: '',
	})
}
