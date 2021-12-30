<script lang="ts">
	import Icon from '~/lib/components/Icon.svelte'
	import WordManager from '~/lib/WordManager'
	import SPECIAL_LETTERS from '~/lib/SPECIAL_LETTERS'
	import { getLetterAbsoluteGuessState } from '~/lib/getLetterGuessState'
	import LETTER_GUESS_STATES from '~/lib/LETTER_GUESS_STATES'

	export let letter: string | SPECIAL_LETTERS

	let guessState: LETTER_GUESS_STATES
	function updateGuessState() {
		guessState =
			typeof letter === 'string'
				? getLetterAbsoluteGuessState(letter)
				: LETTER_GUESS_STATES.NOT_REVEALED
	}
	WordManager.pastGuesses.subscribe(updateGuessState)
	updateGuessState()

	$: stateClass = {
		[LETTER_GUESS_STATES.NOT_REVEALED]: 'not-revealed',
		[LETTER_GUESS_STATES.REVEALED_CORRECT]: 'revealed-correct',
		[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: 'revealed-incorrect-place',
		[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: 'revealed-no-match',
	}[guessState]
</script>

{#if letter === SPECIAL_LETTERS.ENTER}
	<button class={stateClass} on:click={() => WordManager.submitGuess()}
		>Enter</button
	>
{:else if letter === SPECIAL_LETTERS.BACKSPACE}
	<button
		class={stateClass}
		on:click={() => WordManager.removeLastLetterGuess()}
		><Icon icon="backspace" width={24} /></button
	>
{:else}
	<button
		class={stateClass}
		on:click={() =>
			typeof letter === 'string' && WordManager.addLetterToGuess(letter)}
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
