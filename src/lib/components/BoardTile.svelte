<script lang="ts">
	import { derived } from 'svelte/store'
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

	$: stateClass = {
		[LETTER_GUESS_STATES.NOT_REVEALED]: 'not-revealed',
		[LETTER_GUESS_STATES.REVEALED_CORRECT]: 'revealed-correct',
		[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: 'revealed-incorrect-place',
		[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: 'revealed-no-match',
	}[$state]

	$: hasLetterClass = $letter
		? 'has-letter'
		: hadLetterPreviously
		? 'has-no-letter'
		: ''
</script>

<div class={`${stateClass} ${hasLetterClass}`}>
	{$letter}
</div>

<style lang="scss">
	div {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		width: 4rem;
		height: 4rem;
		line-height: 1;
		border-radius: 0.1rem;
		font-weight: bold;
		text-transform: uppercase;
		transition: background-color ease 300ms, outline ease 300ms;

		&.not-revealed {
			background: transparent;
			outline: 2px solid var(--tile-empty-border);
			outline-offset: -2px;

			&.has-letter {
				animation: scale-yes-letter 300ms ease forwards;
			}
			&.has-no-letter {
				animation: scale-no-letter 300ms ease;
			}
		}

		&.revealed-correct {
			background: var(--tile-bg-correct);
		}

		&.revealed-incorrect-place {
			background: var(--tile-bg-incorrect-place);
		}

		&.revealed-no-match {
			background: var(--tile-bg-no-match);
		}
	}

	@keyframes scale-yes-letter {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			outline-color: var(--tile-empty-border-with-letter);
			transform: scale(1);
		}
	}
	@keyframes scale-no-letter {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
