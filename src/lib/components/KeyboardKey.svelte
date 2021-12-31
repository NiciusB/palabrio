<script lang="ts">
	import Icon from '~/lib/components/Icon.svelte'
	import WordStore from '~/lib/stores/WordStore'
	import { getLetterAbsoluteGuessState } from '~/lib/helpers/getLetterGuessState'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
	import { readable } from 'svelte/store'
	import SPECIAL_LETTERS from '~/lib/enums/SPECIAL_LETTERS'

	export let letter: string | SPECIAL_LETTERS

	const guessState =
		typeof letter === 'string'
			? getLetterAbsoluteGuessState(letter)
			: readable(LETTER_GUESS_STATES.NOT_REVEALED)

	$: stateClass = {
		[LETTER_GUESS_STATES.NOT_REVEALED]: 'not-revealed',
		[LETTER_GUESS_STATES.REVEALED_CORRECT]: 'revealed-correct',
		[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: 'revealed-incorrect-place',
		[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: 'revealed-no-match',
	}[$guessState]
</script>

{#if letter === SPECIAL_LETTERS.ENTER}
	<button class={stateClass} on:click={() => WordStore.submitGuess()}
		>Enter</button
	>
{:else if letter === SPECIAL_LETTERS.BACKSPACE}
	<button class={stateClass} on:click={() => WordStore.removeLastLetterGuess()}
		><Icon icon="backspace" width={24} /></button
	>
{:else}
	<button
		class={stateClass}
		on:click={() =>
			typeof letter === 'string' && WordStore.addLetterToGuess(letter)}
		>{letter}</button
	>
{/if}

<style lang="scss">
	button {
		flex-grow: 1;
		font-weight: bold;
		border: 0;
		padding: 1rem 0.3rem;
		height: 58px;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		text-transform: uppercase;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
		color: var(--key-text-color);
		transition: background-color ease 300ms, outline ease 300ms;

		&.not-revealed {
			background: var(--key-bg);
		}

		&.revealed-correct {
			background: var(--tile-bg-correct);
		}

		&.revealed-incorrect-place {
			background: var(--tile-bg-incorrect-place);
		}

		&.revealed-no-match {
			background: var(--key-no-match-bg);
		}
	}
</style>
