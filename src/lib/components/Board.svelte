<script lang="ts">
	import { get } from 'svelte/store'

	import BoardTile from '~/lib/components/BoardTile.svelte'
	import LETTER_GUESS_STATES from '~/lib/LETTER_GUESS_STATES'
	import WordManager from '~/lib/WordManager'
	import { getLetterGuessStateFromGuess } from '~/lib/getLetterGuessState'

	const ROWS = 5
	const COLUMNS = 5

	let board = [] as { letter: string; state: LETTER_GUESS_STATES }[][]

	function updateBoard() {
		for (let row = 0; row < ROWS; row++) {
			board[row] = []

			const isAlreadyGuessedRow = get(WordManager.pastGuesses).length > row
			const isRowWritingRow = get(WordManager.pastGuesses).length === row

			for (let column = 0; column < COLUMNS; column++) {
				const letter =
					(isRowWritingRow
						? get(WordManager.guess)[column]
						: isAlreadyGuessedRow
						? get(WordManager.pastGuesses)[row][column]
						: null) ?? ''

				let state = isAlreadyGuessedRow
					? getLetterGuessStateFromGuess(letter, column)
					: LETTER_GUESS_STATES.NOT_REVEALED

				board[row][column] = {
					letter,
					state,
				}
			}
		}
	}

	WordManager.pastGuesses.subscribe(updateBoard)
	WordManager.guess.subscribe(updateBoard)
	updateBoard()
</script>

<article style="--num-columns: {COLUMNS};">
	{#each board as row}
		{#each row as tileValue}
			<BoardTile letter={tileValue.letter} state={tileValue.state} />
		{/each}
	{/each}
</article>

<style>
	article {
		display: grid;
		grid-template-columns: repeat(var(--num-columns), 1fr);
		gap: 0.5rem;
	}
</style>
