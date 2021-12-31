<script lang="ts">
	import BoardTile from '~/lib/components/BoardTile.svelte'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
	import { derived } from 'svelte/store'
	import Alerts from '~/lib/ui/alerts/components/Alerts.svelte'
	import GameFinished from '~/lib/components/GameFinished.svelte'

	const ROWS = 5
	const COLUMNS = 5

	const board = derived(
		[WordStore.pastGuesses, WordStore.guess, WordStore.word],
		([pastGuesses, guess, word]) => {
			const board: { letter: string; state: LETTER_GUESS_STATES }[][] = []
			for (let row = 0; row < ROWS; row++) {
				board[row] = []

				const isAlreadyGuessedRow = pastGuesses.length > row
				const isRowWritingRow = pastGuesses.length === row

				for (let column = 0; column < COLUMNS; column++) {
					const letter =
						(isRowWritingRow
							? guess[column]
							: isAlreadyGuessedRow
							? pastGuesses[row][column]
							: null) ?? ''

					let state = isAlreadyGuessedRow
						? getLetterGuessStateFromGuess(word, letter, column)
						: LETTER_GUESS_STATES.NOT_REVEALED

					board[row][column] = {
						letter,
						state,
					}
				}
			}
			return board
		}
	)
</script>

<div class="container">
	<article style="--num-columns: {COLUMNS};">
		{#each $board as row}
			{#each row as tileValue}
				<BoardTile letter={tileValue.letter} state={tileValue.state} />
			{/each}
		{/each}
	</article>
	<Alerts />
	<GameFinished />
</div>

<style>
	.container {
		position: relative;
	}

	article {
		display: grid;
		grid-template-columns: repeat(var(--num-columns), 1fr);
		gap: 0.5rem;
	}
</style>
