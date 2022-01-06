<script lang="ts">
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'

	export let state: LETTER_GUESS_STATES
	export let letter: string
	export let shouldAnimateNoLetter: boolean

	$: stateClass = {
		[LETTER_GUESS_STATES.NOT_REVEALED]: 'not-revealed',
		[LETTER_GUESS_STATES.REVEALED_CORRECT]: 'revealed-correct',
		[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: 'revealed-incorrect-place',
		[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: 'revealed-no-match',
	}[state]

	$: hasLetterClass = letter
		? 'has-letter'
		: shouldAnimateNoLetter
		? 'has-no-letter'
		: ''
</script>

<div class={`${stateClass} ${hasLetterClass}`}>
	{letter}
</div>

<style lang="scss">
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		width: 4rem;
		height: 4rem;
		max-width: min(7vh, 15vw);
		max-height: min(7vh, 15vw);
		line-height: 1;
		border-radius: 0.1rem;
		font-weight: bold;
		text-transform: uppercase;
		will-change: background-color, outline, transform;
		transition: background-color ease 300ms, outline ease 300ms;
		contain: strict;

		&.not-revealed {
			background: transparent;
			outline: 2px solid var(--tile-empty-border);
			outline-offset: -2px;

			&.has-letter {
				animation: scale-yes-letter 300ms ease forwards;
				outline-color: var(--tile-empty-border-with-letter);
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
	}
	@keyframes scale-no-letter {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
	}
</style>
