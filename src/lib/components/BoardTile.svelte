<script lang="ts">
	import LETTER_GUESS_STATES from '~/lib/LETTER_GUESS_STATES'

	export let letter: string = ''
	export let state: LETTER_GUESS_STATES

	$: stateClass = {
		[LETTER_GUESS_STATES.NOT_REVEALED]: 'not-revealed',
		[LETTER_GUESS_STATES.REVEALED_CORRECT]: 'revealed-correct',
		[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: 'revealed-incorrect-place',
		[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: 'revealed-no-match',
	}[state]
</script>

<div class={stateClass}>{letter}</div>

<style lang="scss">
	div {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 4rem;
		height: 4rem;
		line-height: 1;
		border-radius: 0.1rem;
		font-weight: bold;
		text-transform: uppercase;

		&.not-revealed {
			background: transparent;
			outline: 2px solid var(--tile-empty-border);
			outline-offset: -2px;
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
</style>
