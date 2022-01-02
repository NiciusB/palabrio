<script lang="ts">
	import { derived } from 'svelte/store'
	import BoardTileUi from '~/lib/components/BoardTileUi.svelte'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
	import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
	import WordStore from '~/lib/stores/WordStore'

	export let column: number
	export let row: number

	const letter = derived(
		[WordStore.pastGuesses, WordStore.guess],
		([pastGuesses, guess]) => {
			const isAlreadyGuessedRow = pastGuesses.length > row
			const isRowWritingRow = pastGuesses.length === row

			return (
				(isRowWritingRow
					? guess[column]
					: isAlreadyGuessedRow
					? pastGuesses[row][column]
					: null) ?? ''
			)
		}
	)

	$: word = WordStore.word

	const state = derived(WordStore.pastGuesses, (pastGuesses) =>
		pastGuesses.length > row
			? getLetterGuessStateFromGuess($word, pastGuesses[row], column)
			: LETTER_GUESS_STATES.NOT_REVEALED
	)

	let hadLetterPreviously = false
	$: {
		if ($letter) hadLetterPreviously = true
	}
</script>

<BoardTileUi
	letter={$letter}
	state={$state}
	shouldAnimateNoLetter={hadLetterPreviously}
/>
